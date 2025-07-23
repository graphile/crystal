// Run with:
// yarn jscodeshift -t ./shifts/loadArguments.ts */*/src --extensions=ts --parser=ts
import { API, FileInfo, JSCodeshift } from "jscodeshift";

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
  const root = j(file.source);

  function buildOptions(args: any[]) {
    const [spec, a, b, c] = args;
    const props = [j.objectProperty(j.identifier("lookup"), spec)];

    if (args.length === 2) {
      // (spec, loadCallback)
      props.push(j.objectProperty(j.identifier("load"), a));
    } else if (args.length === 3) {
      // Ambiguous: could be (spec, ioEquivalence, loadCallback) OR (spec, unary, loadCallback)
      props.push(
        j.objectProperty(j.identifier("unaryOrIoEquivalencePleaseResolve"), a),
      );
      props.push(j.objectProperty(j.identifier("load"), b));
    } else if (args.length === 4) {
      // (spec, unary, ioEquivalence, loadCallback)
      props.push(j.objectProperty(j.identifier("unary"), a));
      props.push(j.objectProperty(j.identifier("ioEquivalence"), b));
      props.push(j.objectProperty(j.identifier("load"), c));
    } else {
      return null;
    }

    return j.objectExpression(props);
  }

  let changed = false;
  root
    .find(j.CallExpression, {
      callee: {
        type: "Identifier",
        name: (name: string) => name === "loadOne" || name === "loadMany",
      },
    })
    .forEach((path) => {
      const args = path.node.arguments;
      if (args.length < 2 || args.length > 4) return;

      const options = buildOptions(args);
      if (!options) return;
      changed = true;

      path.node.arguments = [options];
    });

  if (!changed) {
    return file.source;
  }

  return root.toSource({ quote: "single" });
}
