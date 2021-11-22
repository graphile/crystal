import crypto from "crypto";
import * as _crypto from "crypto";
import graphql, {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
} from "graphql";
import util, { inspect } from "util";

interface $$Export {
  moduleName: string;
  exportName: string | "default" | "*";
}

const wellKnownMap = new Map<unknown, $$Export>();

// TODO: fill this out a bit...
wellKnownMap.set(crypto, { moduleName: "crypto", exportName: "default" });
wellKnownMap.set(util, { moduleName: "util", exportName: "default" });
wellKnownMap.set(inspect, { moduleName: "util", exportName: "inspect" });
wellKnownMap.set(graphql, { moduleName: "graphql", exportName: "default" });
wellKnownMap.set(GraphQLSchema, {
  moduleName: "graphql",
  exportName: "GraphQLSchema",
});
wellKnownMap.set(GraphQLDirective, {
  moduleName: "graphql",
  exportName: "GraphQLDirective",
});
wellKnownMap.set(GraphQLObjectType, {
  moduleName: "graphql",
  exportName: "GraphQLObjectType",
});
wellKnownMap.set(GraphQLInterfaceType, {
  moduleName: "graphql",
  exportName: "GraphQLInterfaceType",
});
wellKnownMap.set(GraphQLUnionType, {
  moduleName: "graphql",
  exportName: "GraphQLUnionType",
});
wellKnownMap.set(GraphQLInputObjectType, {
  moduleName: "graphql",
  exportName: "GraphQLInputObjectType",
});
wellKnownMap.set(GraphQLScalarType, {
  moduleName: "graphql",
  exportName: "GraphQLScalarType",
});
wellKnownMap.set(GraphQLEnumType, {
  moduleName: "graphql",
  exportName: "GraphQLEnumType",
});
wellKnownMap.set(GraphQLList, {
  moduleName: "graphql",
  exportName: "GraphQLList",
});
wellKnownMap.set(GraphQLNonNull, {
  moduleName: "graphql",
  exportName: "GraphQLNonNull",
});

const namespaces = Object.assign(Object.create(null), { crypto: _crypto });

/**
 * Determines if the thing is something well known (like a Node.js builtin); if
 * so, returns the export description of it.
 *
 * @internal
 */
export function wellKnown(thing: unknown): $$Export | undefined {
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

function isSameNamespace<TNamespace>(
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
    if (thing[key] !== namespace[key]) {
      return false;
    }
  }
  return true;
}
