import * as cryptoStar from "crypto";
import * as grafastStar from "grafast";
import * as graphqlStar from "grafast/graphql";
import * as utilStar from "util";

import type { ExportOptions } from "./interfaces.ts";
import { arraysMatch } from "grafast";

interface $$Export {
  moduleName: string;
  exportName: string | "default" | "*" | string[];
}

function isPojo(obj: any): obj is object {
  if (obj == null) return false;
  if (typeof obj !== "object") return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === null || proto === Object.prototype;
}

interface NamespaceDetails<TNamespace extends Record<string, any> = any> {
  moduleStar: TNamespace;
  /** Object.keys(moduleStar) */
  keys: readonly string[];
  /** keys[0]; if keys.length === 0 this will be undefined for a faster check */
  firstKey: string | undefined;
}

function makeWellKnownFromOptions(options: ExportOptions) {
  const namespaces = Object.create(null) as Record<string, NamespaceDetails>;
  const wellKnownMap = new Map<unknown, $$Export>();

  function exportAll(
    moduleStar: Record<string, any>,
    moduleName: string,
    preferViaDefault = false,
  ) {
    const keys = Object.keys(moduleStar);
    const firstKey = keys[0];
    namespaces[moduleName] = { moduleStar, keys, firstKey };
    for (const exportName of Object.keys(moduleStar)) {
      if (!wellKnownMap.has(moduleStar[exportName])) {
        /**
         * ESM is still a bit flaky, so though `import { foo } from 'bar';` may
         * work in some contexts, in raw Node it's often required to do
         * `import bar from 'bar'; const foo = bar.foo;`. This code determines
         * if this latter approach is desired.
         */
        const viaDefault =
          preferViaDefault &&
          exportName !== "default" &&
          moduleStar[exportName] === moduleStar["default"]?.[exportName];
        wellKnownMap.set(moduleStar[exportName], {
          moduleName,
          exportName: viaDefault ? ["default", exportName] : exportName,
        });
      }
    }
    if (!wellKnownMap.has(moduleStar)) {
      wellKnownMap.set(moduleStar, { moduleName, exportName: "*" });
    }
    // Node's ESM support is... interesting. Let's handle stuff hanging off of default too
    if (isPojo(moduleStar.default)) {
      for (const [exportName, value] of Object.entries(moduleStar.default)) {
        if (!wellKnownMap.has(value)) {
          wellKnownMap.set(value, {
            moduleName,
            exportName: ["default", exportName],
          });
        }
      }
    }
  }

  exportAll(cryptoStar, "crypto");
  exportAll(grafastStar, "grafast");
  exportAll(graphqlStar, "graphql");
  exportAll(utilStar, "util");

  // When defining custom scalars it's often useful to copy the implementation from builtins
  for (const builtinScalarName of [
    "GraphQLBoolean",
    "GraphQLInt",
    "GraphQLFloat",
    "GraphQLString",
    "GraphQLID",
  ] as const) {
    for (const method of ["serialize", "parseValue", "parseLiteral"] as const) {
      wellKnownMap.set(graphqlStar[builtinScalarName][method], {
        moduleName: "graphql",
        exportName: [builtinScalarName, method],
      });
    }
  }

  // Now process options
  if (options.modules) {
    for (const [moduleName, moduleStar] of Object.entries(options.modules)) {
      exportAll(moduleStar, moduleName, true);
    }
  }

  return { namespaces, wellKnownMap };
}

const $$wellKnown = Symbol("wellKnown");
declare module "./interfaces.js" {
  interface ExportOptions {
    /** @internal */
    [$$wellKnown]?: ReturnType<typeof makeWellKnownFromOptions>;
  }
}
function getWellKnownFromOptions(
  options: ExportOptions,
): ReturnType<typeof makeWellKnownFromOptions> {
  if (!options[$$wellKnown]) {
    options[$$wellKnown] = makeWellKnownFromOptions(options);
  }
  return options[$$wellKnown];
}

/**
 * Determines if the thing is something well known (like a Node.js builtin); if
 * so, returns the export description of it.
 *
 * @internal
 */
export function wellKnown(
  options: ExportOptions,
  thing: unknown,
): $$Export | undefined {
  const { wellKnownMap, namespaces } = getWellKnownFromOptions(options);

  // Straight imports are relatively easy:
  const simple = wellKnownMap.get(thing);
  if (simple) {
    return simple;
  }

  // Checking for namespace matches is a bit tougher
  for (const moduleName in namespaces) {
    if (isSameNamespace(thing, namespaces[moduleName])) {
      return { moduleName, exportName: "*" };
    }
  }

  return undefined;
}

function isSameNamespace<TNamespace extends Record<string, any>>(
  rawThing: unknown,
  { moduleStar, keys, firstKey }: NamespaceDetails<TNamespace>,
): rawThing is TNamespace {
  if (rawThing == null || typeof rawThing !== "object") return false;
  if (firstKey === undefined) return false;

  // At this point, keys must have at least 1 value, and thing is an object
  const thing = rawThing as Record<string, unknown>;

  // Early exit - most things fail on the first key
  if (thing[firstKey] !== moduleStar[firstKey]) return false;

  // In case values are undefined, we must ensure they keys actually match.
  // This also avoids us dereferencing keys of an object that don't exist
  // (other than the early exit above of course).
  const thingKeys = Object.keys(thing);
  if (!arraysMatch(thingKeys, keys)) {
    return false;
  }

  for (const key of keys) {
    if (thing[key] !== moduleStar[key]) {
      return false;
    }
  }
  return true;
}
