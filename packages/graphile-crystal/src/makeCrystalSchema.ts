import type {
  GraphQLFieldResolver,
  GraphQLScalarLiteralParser,
  GraphQLScalarSerializer,
  GraphQLScalarValueParser,
  GraphQLSchema,
} from "graphql";
import {
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isUnionType,
} from "graphql";
import { buildASTSchema, parse } from "graphql";

import type {
  ArgumentPlanResolver,
  EnumPlanResolver,
  ExecutablePlanResolver,
  InputObjectFieldPlanResolver,
  ScalarPlanResolver,
} from "./interfaces";
import type { ExecutablePlan } from "./plan";
import { resolveType } from "./polymorphic";

type FieldPlans =
  | ExecutablePlanResolver<any, any, any, any>
  | {
      plan?: ExecutablePlanResolver<any, any, any, any>;
      subscribePlan?: ExecutablePlanResolver<any, any, any, any>;
      resolve?: GraphQLFieldResolver<any, any>;
      subscribe?: GraphQLFieldResolver<any, any>;
      args?: {
        [argName: string]: ArgumentPlanResolver<any, any, any, any, any>;
      };
    };

type ObjectPlans = {
  __Plan?: { new (...args: any[]): ExecutablePlan<any> };
} & {
  [fieldName: string]: FieldPlans;
};

type InputObjectPlans = {
  [fieldName: string]: InputObjectFieldPlanResolver<any, any, any, any>;
};

type InterfaceOrUnionPlans = {
  __resolveType?: (o: unknown) => string;
};

type ScalarPlans = {
  serialize: GraphQLScalarSerializer<any>;
  parseValue: GraphQLScalarValueParser<any>;
  parseLiteral: GraphQLScalarLiteralParser<any>;
  plan: ScalarPlanResolver<any, any>;
};

type EnumPlans = {
  // The internal value for the enum
  [enumValueName: string]:
    | EnumPlanResolver
    | string
    | number
    | boolean
    | {
        value?: unknown;
        plan?: EnumPlanResolver;
      };
};

interface CrystalPlans {
  [typeName: string]:
    | ObjectPlans
    | InputObjectPlans
    | InterfaceOrUnionPlans
    | ScalarPlans
    | EnumPlans;
}

export function makeCrystalSchema(details: {
  typeDefs: string;
  plans: CrystalPlans;
}): GraphQLSchema {
  const { typeDefs, plans } = details;

  const schema = buildASTSchema(parse(typeDefs), {
    // TODO: enable?
    enableDeferStream: true,
  });

  // Now add the plans/etc to the schema
  for (const [typeName, spec] of Object.entries(plans)) {
    const type = schema.getType(typeName);
    if (!type) {
      console.warn(
        `'plans' specified configuration for type '${typeName}', but that type was not present in the schema`,
      );
      continue;
    }
    if (isObjectType(type)) {
    } else if (isInputObjectType(type)) {
    } else if (isInterfaceType(type) || isUnionType(type)) {
    } else if (isScalarType(type)) {
    } else if (isEnumType(type)) {
    } else {
      const never: never = type;
      console.error(`Unhandled type ${never}`);
    }
  }
  return schema;
}
