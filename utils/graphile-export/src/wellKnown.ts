import * as cryptoStar from "crypto";
import * as grafastStar from "grafast";
import * as graphqlStar from "grafast/graphql";
import * as utilStar from "util";

import type { ExportOptions } from "./interfaces.js";

interface $$Export {
  moduleName: string;
  exportName: string | "default" | "*" | string[];
}

function makeWellKnownFromOptions(options: ExportOptions) {
  const namespaces = Object.create(null);
  const wellKnownMap = new Map<unknown, $$Export>();

  function exportAll(
    moduleStar: Record<string, any>,
    moduleName: string,
    preferViaDefault = false,
  ) {
    namespaces[moduleName] = moduleStar;
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
  thing: unknown,
  namespace: TNamespace,
): thing is TNamespace {
  if (typeof thing !== "object" || thing == null) {
    return false;
  }
  const thingKeys = Object.keys(thing);
  const nspKeys = Object.keys(namespace);
  if (thingKeys.length !== nspKeys.length) {
    return false;
  }
  for (const key of nspKeys) {
    if ((thing as Record<string, any>)[key] !== namespace[key]) {
      return false;
    }
  }
  return true;
}
