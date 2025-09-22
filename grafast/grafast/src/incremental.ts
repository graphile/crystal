import type {
  BooleanValueNode,
  DefinitionNode,
  GraphQLArgument,
  GraphQLType,
  InputValueDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  StringValueNode,
  TypeNode,
} from "graphql";
import {
  DirectiveLocation,
  GraphQLBoolean,
  GraphQLDirective,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  Kind,
} from "graphql";

// This file contains the Stream/Defer directives, to be used when GraphQL itself doesn't provide them.

// Taken from https://github.com/graphql/graphql-js/blob/bc6b2e47512ee11c01eb5185d184990e743df736/src/type/directives.ts

/*
MIT License

Copyright (c) GraphQL Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Used to conditionally defer fragments.
 */
export const GraphQLDeferDirective = new GraphQLDirective({
  name: "defer",
  description:
    "Directs the executor to defer this fragment when the `if` argument is true or undefined.",
  locations: [
    DirectiveLocation.FRAGMENT_SPREAD,
    DirectiveLocation.INLINE_FRAGMENT,
  ],
  args: {
    if: {
      type: GraphQLBoolean,
      description: "Deferred when true or undefined.",
    },
    label: {
      type: GraphQLString,
      description: "Unique name",
    },
  },
});
export const deferDefinition: DefinitionNode = toDirectiveDef(
  GraphQLDeferDirective,
);

/**
 * Used to conditionally stream list fields.
 */
export const GraphQLStreamDirective = new GraphQLDirective({
  name: "stream",
  description:
    "Directs the executor to stream plural fields when the `if` argument is true or undefined.",
  locations: [DirectiveLocation.FIELD],
  args: {
    if: {
      type: GraphQLBoolean,
      description: "Stream when true or undefined.",
    },
    label: {
      type: GraphQLString,
      description: "Unique name",
    },
    initialCount: {
      defaultValue: 0,
      type: GraphQLInt,
      description: "Number of items to return immediately",
    },
  },
});
export const streamDefinition: DefinitionNode = toDirectiveDef(
  GraphQLStreamDirective,
);

function toDirectiveDef(directive: GraphQLDirective): DefinitionNode {
  return {
    kind: Kind.DIRECTIVE_DEFINITION,
    description: toDescription(directive.description),
    name: { kind: Kind.NAME, value: directive.name },
    arguments: directive.args.map(toDirectiveArgDef),
    repeatable: directive.isRepeatable,
    locations: directive.locations.map((n) => ({ kind: Kind.NAME, value: n })),
  };
}

function toDirectiveArgDef(arg: GraphQLArgument): InputValueDefinitionNode {
  return {
    kind: Kind.INPUT_VALUE_DEFINITION,
    description: toDescription(arg.description),
    name: { kind: Kind.NAME, value: arg.name },
    type: toTypeDef(arg.type),
    defaultValue: toValue(arg.defaultValue),
  };
}

function toTypeDef(type: GraphQLType): TypeNode {
  if (type instanceof GraphQLNonNull) {
    return {
      kind: Kind.NON_NULL_TYPE,
      type: toTypeDef(type.ofType) as NamedTypeNode | ListTypeNode,
    };
  } else if (type instanceof GraphQLList) {
    return {
      kind: Kind.LIST_TYPE,
      type: toTypeDef(type.ofType),
    };
  } else {
    return {
      kind: Kind.NAMED_TYPE,
      name: { kind: Kind.NAME, value: type.name },
    };
  }
}

function toDescription(
  value: string | null | undefined,
): StringValueNode | undefined {
  return value != null ? { kind: Kind.STRING, value } : undefined;
}

function toValue(value: unknown): undefined | BooleanValueNode {
  if (value === undefined) {
    return undefined;
  } else if (typeof value === "boolean") {
    return { kind: Kind.BOOLEAN, value };
  } else {
    throw new Error(`Not yet supported`);
  }
}
