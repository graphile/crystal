import type { ExecutableStep, InputStep, Maybe } from "grafast";
import { getEnumValueConfigs, lambda } from "grafast";
import type { GraphQLEnumType, GraphQLInputType } from "grafast/graphql";
import { getNamedType, getNullableType, isEnumType } from "grafast/graphql";

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
  path: string[],
) {
  const enumValueConfigs = getEnumValueConfigs(enumType);
  if (enumType[$$extensionsByValue] === undefined) {
    enumType[$$extensionsByValue] = Object.create(null);
  }
  const serializedPath = JSON.stringify(path);
  if (enumType[$$extensionsByValue]![serializedPath] === undefined) {
    const pathLength = path.length;
    const lookup = Object.entries(enumValueConfigs).reduce(
      (memo, [value, config]) => {
        let valueAtPath: any = config?.extensions;
        for (let pathIndex = 0; pathIndex < pathLength; pathIndex++) {
          if (valueAtPath == null) break;
          valueAtPath = valueAtPath?.[path[pathIndex]];
        }
        memo[value] = valueAtPath;
        return memo;
      },
      Object.create(null),
    );
    const functionNameSuffix = path.join("_");
    const lookupValue = <T>(value: any) => lookup[value] as T | undefined;
    lookupValue.displayName = `extract_${functionNameSuffix}`;
    const lookupValues = <T>(values: Maybe<any[]>) =>
      values?.map(lookupValue<T>);
    lookupValues.displayName = `extractList_${functionNameSuffix}`;
    enumType[$$extensionsByValue]![serializedPath] = {
      lookupValues,
      lookupValue,
    };
  }
  return enumType[$$extensionsByValue]![serializedPath]!;
}

export function extractEnumExtensionValue<T>(
  type: GraphQLInputType,
  path: string[],
  $step: InputStep,
): ExecutableStep<ReadonlyArrayOrDirect<Maybe<T>>> {
  const nullableType = getNullableType(type);
  const enumType = getNamedType(nullableType);
  if (!isEnumType(enumType)) {
    throw new Error(`Only enum types are supported by this method`);
  }
  const { lookupValues, lookupValue } = getEnumExtensionPropertyValueLookups(
    enumType,
    path,
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
