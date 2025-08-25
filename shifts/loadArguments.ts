// Run with:
// yarn jscodeshift -t ./shifts/loadArguments.ts {grafast,graphile-build}/*/{src,__tests__} --extensions=ts,js,mjs --parser=ts
import { API, FileInfo, JSCodeshift, SpreadElement } from "jscodeshift";

const ALLOWED_KEYS = [
  "lookup",
  "load",
  "ioEquivalence",
  "unary",
  "paginationSupport",
] as const;
type Key = (typeof ALLOWED_KEYS)[number];

/**
 * Rewrites all old `loadOne()` call overloads into the new
 * single-options-object form.
 *
 * Handles:
 *   loadOne(spec, loadCallback);
 *   loadOne(spec, ioEquivalence, loadCallback);
 *   loadOne(spec, unarySpec, loadCallback);
 *   loadOne(spec, unarySpec, ioEquivalence, loadCallback);
 *
 * For the ambiguous 3-arg case, it emits:
 *   unaryOrIoEquivalencePleaseResolve: <arg>,
 *   load: <callback>
 */
export default function transformer(file: FileInfo, api: API) {
  const j: JSCodeshift = api.jscodeshift;
  let root = j(file.source);

  let changed = false;
  // This is the old transform I used, since then we changed our mind, so this
  // is a stacked shift
  root
    .find(j.CallExpression, {
      callee: {
        type: "Identifier",
        name: (name: string) => name === "loadOne" || name === "loadMany",
      },
    })
    .forEach((path) => {
      if (
        path.node.arguments.length === 1 &&
        path.node.arguments[0].type === "ObjectExpression"
      ) {
        // Already transformed with this one
        return;
      }
      if (
        path.node.arguments.length === 2 &&
        path.node.arguments[1].type === "ObjectExpression"
      ) {
        // Already double transformed
        return;
      }
      const args = path.node.arguments.filter(
        (arg) =>
          arg.type !== "NullLiteral" &&
          (arg.type !== "Identifier" || arg.name !== "undefined"),
      );
      if (args.length < 2 || args.length > 4) {
        // Cannot safely transform
        return;
      }

      function buildOptions() {
        const [spec, a, b, c] = args;
        if (spec?.type === "SpreadElement") throw new Error("Spread forbidden");
        if (a?.type === "SpreadElement") throw new Error("Spread forbidden");
        if (b?.type === "SpreadElement") throw new Error("Spread forbidden");
        if (c?.type === "SpreadElement") throw new Error("Spread forbidden");
        const props = [j.objectProperty(j.identifier("lookup"), spec)];

        if (args.length === 2) {
          // (spec, loadCallback)
          props.push(j.objectProperty(j.identifier("load"), a));
        } else if (args.length === 3) {
          // Ambiguous: could be (spec, ioEquivalence, loadCallback) OR (spec, unary, loadCallback)
          props.push(j.objectProperty(j.identifier("load"), b));
          const isArrayOfStrings =
            a.type === "ArrayExpression" &&
            a.elements.every((e) => e?.type === "StringLiteral");
          const isObjectOfStrings =
            a.type === "ObjectExpression" &&
            a.properties.every(
              (p) =>
                p?.type === "ObjectProperty" &&
                p.value.type === "StringLiteral",
            );
          const isString = a.type === "StringLiteral";
          /** This is our best guess */
          const isIoEquivalence =
            isArrayOfStrings || isObjectOfStrings || isString;
          props.push(
            j.objectProperty(
              j.identifier(isIoEquivalence ? "ioEquivalence" : "unary"),
              a,
            ),
          );
        } else if (args.length === 4) {
          // (spec, unary, ioEquivalence, loadCallback)
          props.push(j.objectProperty(j.identifier("load"), c));
          props.push(j.objectProperty(j.identifier("unary"), a));
          props.push(j.objectProperty(j.identifier("ioEquivalence"), b));
        } else {
          return null;
        }

        return j.objectExpression(props);
      }

      const options = buildOptions();
      if (!options) return;
      changed = true;
      path.node.arguments = [options];
    });

  if (changed) {
    // Start again, clean slate
    root = j(root.toSource({ quote: "single" }));
  }

  // This transform takes from the intermediate "mistake" and converts to the
  // new two argument form with options object
  root
    .find(j.CallExpression, {
      callee: {
        type: "Identifier",
        name: (name: string) => name === "loadOne" || name === "loadMany",
      },
    })
    .forEach((path) => {
      if (
        path.node.arguments.length === 2 &&
        path.node.arguments[1].type === "ObjectExpression"
      ) {
        // Already transformed
        return;
      }
      if (
        path.node.arguments.length !== 1 ||
        path.node.arguments[0].type !== "ObjectExpression"
      ) {
        // Cannot handle
        return;
      }
      const objExpr = path.node.arguments[0];
      const kv: Record<
        Key,
        Exclude<(typeof path.node.arguments)[number], SpreadElement>
      > = Object.create(null);
      for (const prop of objExpr.properties) {
        if (prop.type === "ObjectProperty") {
          const key =
            prop.key.type === "Identifier"
              ? prop.key.name
              : prop.key.type === "StringLiteral"
                ? prop.key.value
                : null;
          if (key === null) {
            throw new Error(`Cannot handle key ${prop.key.type}`);
          }
          if (ALLOWED_KEYS.includes(key as Key)) {
            if (
              prop.value.type === "NullLiteral" ||
              (prop.value.type === "Identifier" &&
                prop.value.name === "undefined")
            ) {
              // Ignore
            } else {
              kv[key] = prop.value;
            }
          } else {
            throw new Error(`Unsupported key ${key}`);
          }
        } else {
          // Cannot handle
          throw new Error(`Cannot handle ${prop.type}`);
        }
      }
      changed = true;
      path.node.arguments = [
        kv.lookup ?? j.nullLiteral(),
        kv.unary || kv.ioEquivalence
          ? j.objectExpression.from({
              properties: [
                j.objectProperty(j.identifier("load"), kv.load!),
                ...(kv.ioEquivalence
                  ? [
                      j.objectProperty(
                        j.identifier("ioEquivalence"),
                        kv.ioEquivalence,
                      ),
                    ]
                  : []),
                ...(kv.paginationSupport
                  ? [
                      j.objectProperty(
                        j.identifier("paginationSupport"),
                        kv.paginationSupport,
                      ),
                    ]
                  : []),
                ...(kv.unary
                  ? [j.objectProperty(j.identifier("shared"), kv.unary)]
                  : []),
              ],
            })
          : kv.load,
      ];
    });
  if (!changed) {
    return file.source;
  }

  return root.toSource({ quote: "single" });
}
