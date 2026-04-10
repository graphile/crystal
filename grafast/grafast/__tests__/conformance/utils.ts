import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import {
  buildSchema,
  graphql,
  GraphQLFieldMap,
  GraphQLOutputType,
  GraphQLSchema,
  isEnumType,
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
} from "graphql";

import {
  constant,
  FieldPlan,
  get,
  grafast,
  InterfacePlan,
  makeGrafastSchema,
  ObjectPlan,
  Step,
  UnionPlan,
} from "../../dist/index.js";
import { endResult } from "../incrementalUtils.js";

export const resolvedPreset = resolvePreset({});

const planType = ($specifier: Step) => ({
  $__typename: get($specifier, "__typename"),
});

function makeFieldPlans(
  schema: GraphQLSchema,
  fields: GraphQLFieldMap<any, any>,
) {
  const plans: Record<string, FieldPlan> = Object.create(null);
  for (const [fieldName, field] of Object.entries(fields)) {
    const value = valueForType(schema, field.type);
    plans[fieldName] = () => constant(value);
  }
  return plans;
}

export function makeConformanceSchema(schemaText: string) {
  const graphqljsSchema = buildSchema(schemaText);

  const objects: Record<string, ObjectPlan> = Object.create(null);
  const interfaces: Record<string, InterfacePlan> = Object.create(null);
  const unions: Record<string, UnionPlan> = Object.create(null);

  for (const type of Object.values(graphqljsSchema.getTypeMap())) {
    if (isObjectType(type)) {
      const plans = makeFieldPlans(graphqljsSchema, type.getFields());
      objects[type.name] = { plans };
    } else if (isInterfaceType(type)) {
      interfaces[type.name] = { planType };
    } else if (isUnionType(type)) {
      unions[type.name] = { planType };
    }
  }

  return makeGrafastSchema({
    typeDefs: schemaText,
    objects,
    interfaces,
    unions,
    extensions: { graphqljsSchema },
    enableDeferStream: true,
  });
}

export async function assertConformance(
  schema: GraphQLSchema,
  source: string,
  variableValues?: Record<string, any>,
) {
  const graphqljsSchema = schema.extensions?.graphqljsSchema as GraphQLSchema;
  if (!graphqljsSchema) {
    throw new Error(
      `Conformance schema must be built with makeConformanceSchema()`,
    );
  }

  const graphqljsResult = await endResult(
    graphql({
      schema,
      source,
      variableValues,
      typeResolver: (value) => value.__typename,
      fieldResolver: (_parent, _args, _context, info) =>
        valueForType(info.schema, info.returnType),
    }),
  );
  delete graphqljsResult.extensions;

  expect(graphqljsResult.data).to.be.an("object");
  expect(graphqljsResult.errors).not.to.exist;

  const grafastResult = await endResult(
    grafast({ schema, source, variableValues }),
  );
  delete grafastResult.extensions;

  expect(grafastResult).to.deep.equal(graphqljsResult);
}

function valueForType(schema: GraphQLSchema, type: GraphQLOutputType) {
  if (isNonNullType(type)) {
    return valueForType(schema, type.ofType);
  } else if (isListType(type)) {
    const value = valueForType(schema, type.ofType);
    return [value, value];
    // Below here is named types
  } else if (isObjectType(type)) {
    return Object.create(null);
  } else if (isUnionType(type)) {
    const types = type.getTypes();
    const typeNames = types.map((t) => t.name);
    typeNames.sort();
    return { __typename: typeNames[0] };
  } else if (isInterfaceType(type)) {
    const types = schema.getImplementations(type).objects;
    const typeNames = types.map((t) => t.name);
    typeNames.sort();
    return { __typename: typeNames[0] };
  } else if (isScalarType(type)) {
    switch (type.name) {
      case "Boolean":
        return true;
      case "Int":
        return 2;
      case "Float":
        return 3.14;
      case "ID":
        return "id";
      default:
        return "str";
    }
  } else if (isEnumType(type)) {
    const firstValue = type.getValues()[0];
    return firstValue.value ?? firstValue.name;
  } else {
    const never: never = type;
    throw new Error(`Type ${never} not understood`);
  }
}
