import {
  InputStep,
  Maybe,
  getEnumValueConfigs,
  ExecutableStep,
  lambda,
} from "grafast";
import {
  GraphQLEnumType,
  GraphQLInputType,
  getNamedType,
  getNullableType,
  isEnumType,
} from "graphql";
import type { ReadonlyArrayOrDirect } from "../interfaces.js";

declare module "graphql" {
  interface GraphQLEnumType {
    [$$extensionsByValue]?: Record<
      string,
      {
        lookupValues: (values: any[]) => any;
        lookupValue: (value: any) => any;
      }
    >;
  }
}

const $$extensionsByValue = Symbol("extensionsByValue");
function getEnumExtensionPropertyValueLookups(
  enumType: GraphQLEnumType,
  extensionsProperty: string,
) {
  const enumValueConfigs = getEnumValueConfigs(enumType);
  if (enumType[$$extensionsByValue] === undefined) {
    enumType[$$extensionsByValue] = Object.create(null) as {};
  }
  if (enumType[$$extensionsByValue][extensionsProperty] === undefined) {
    const lookup = Object.entries(enumValueConfigs).reduce(
      (memo, [value, config]) => {
        memo[value] = config?.extensions?.[extensionsProperty];
        return memo;
      },
      Object.create(null),
    );
    const lookupValues = <T>(values: any) =>
      values?.map((v: any) => lookup[v] as T | undefined);
    lookupValues.displayName = `extractList_${extensionsProperty}`;
    const lookupValue = <T>(value: any) => lookup[value] as T | undefined;
    lookupValue.displayName = `extract_${extensionsProperty}`;
    enumType[$$extensionsByValue][extensionsProperty] = {
      lookupValues,
      lookupValue,
    };
  }
  return enumType[$$extensionsByValue]![extensionsProperty]!;
}

export function extractEnumExtensionValue<T>(
  type: GraphQLInputType,
  extensionsProperty: string,
  $step: InputStep,
): ExecutableStep<ReadonlyArrayOrDirect<Maybe<T>>> {
  const nullableType = getNullableType(type);
  const enumType = getNamedType(nullableType);
  if (!isEnumType(enumType)) {
    throw new Error(`Only enum types are supported by this method`);
  }
  const { lookupValues, lookupValue } = getEnumExtensionPropertyValueLookups(
    enumType,
    extensionsProperty,
  );
  if (
    // Quicker than but equivalent to isListType(nullableType):
    nullableType !== enumType
  ) {
    return lambda($step, lookupValues, true);
  } else {
    return lambda($step, lookupValue, true);
  }
}
