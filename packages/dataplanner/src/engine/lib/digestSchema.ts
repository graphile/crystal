import type {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLUnionType} from "graphql";
import {
  isObjectType,
  isUnionType,
} from "graphql";

export function digestSchema(schema: GraphQLSchema) {
  const queryType = schema.getQueryType();
  if (!queryType) {
    throw new Error(
      "This GraphQL schema does not support queries, it cannot be used.",
    );
  }
  const mutationType = schema.getMutationType() ?? null;
  const subscriptionType = schema.getSubscriptionType() ?? null;

  // Unions are a pain, let's cache some things up front to make them easier.
  const allTypes = Object.values(schema.getTypeMap());
  const allUnions: GraphQLUnionType[] = [];
  const allObjectTypes: GraphQLObjectType[] = [];
  for (const type of allTypes) {
    if (isUnionType(type)) {
      allUnions.push(type);
    } else if (isObjectType(type)) {
      allObjectTypes.push(type);
    }
  }
  const unionsContainingObjectType: {
    [objectTypeName: string]: GraphQLUnionType[];
  } = Object.create(null);
  for (const objectType of allObjectTypes) {
    unionsContainingObjectType[objectType.name] = [];
  }
  for (const union of allUnions) {
    for (const objectType of union.getTypes()) {
      const objectTypeName = objectType.name;
      unionsContainingObjectType[objectTypeName].push(union);
    }
  }
  return {
    queryType,
    mutationType,
    subscriptionType,
    unionsContainingObjectType,
  };
}

export type SchemaDigest = ReturnType<typeof digestSchema>;
