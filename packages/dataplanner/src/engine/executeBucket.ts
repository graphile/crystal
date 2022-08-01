import type { DocumentNode, FieldNode } from "graphql";
import { executeSync } from "graphql";
import { graphqlSync, OperationDefinitionNode } from "graphql";
import { Kind, OperationTypeNode } from "graphql";
import { inspect } from "util";

import type { Bucket, BucketPath, RequestContext } from "../bucket";
import type { CrystalError } from "../error";
import { newCrystalError } from "../error";
import { newNonNullError } from "../error";
import { isCrystalError } from "../error";
import { $$concreteType, $$idempotent } from "../interfaces";
import { isPolymorphicData } from "../polymorphic";
import { arrayOfLength } from "../utils";
import type { OutputPath } from "./executeOutputPlan";
import { LayerPlanReason } from "./LayerPlan";
import type { MetaByStepId, OperationPlan } from "./OperationPlan";
import type { OutputPlanChild } from "./OutputPlan";

/**
 * When we take a plan result and store it to the result tree, for non-leaf
 * plans we're either storing a list or an object. What the underlying plan
 * represents this as is irrelevant - e.g. a plan for an object type might
 * return a tuple instead of an object; this is fine - we should still add an
 * object to the result tree.
 *
 * Where possible we try and "merge" the result with the previous result.
 *
 * @internal
 */
export function bucketValue(
  operationPlan: OperationPlan,
  object: object,
  key: string | number,
  value: any,
  spec: OutputPlanChild,
  concreteType: string | null,
  // This gets called if any of the non-null constraints are failed, or if
  // there was an error. This triggers processing through the GraphQL.js stack.
  requestContext: RequestContext,
  // `null` here would imply a non-null error
  onErrorOrNonNullViolation: (errorOrNull: CrystalError | null) => void,
): any {
  const handleNullOrError = (nullOrError: undefined | null | CrystalError) => {
    if (spec.isNonNull || nullOrError != null) {
      // Add an error
      onErrorOrNonNullViolation(nullOrError ?? null);
    }
    // DO NOT RETURN `undefined`!
    return null;
  };
  if (isCrystalError(value)) {
    return handleNullOrError(value);
  }
  if (value == null) {
    return handleNullOrError(value);
  }
  switch (spec.mode) {
    case "array": {
      if (Array.isArray(value)) {
        return arrayOfLength(value.length);
      } else {
        console.warn(
          `Hit fallback for value ${inspect(value)} coercion to mode ${
            spec.mode
          }`,
        );
        return handleNullOrError(null);
      }
    }
    case "object": {
      const typeName = isPolymorphicData(value)
        ? value[$$concreteType]
        : concreteType;
      return spec.objectCreator(typeName);
    }
    case "leaf": {
      if (requestContext.insideGraphQL) {
        // Do not serialize inside GraphQL, GraphQL will do that for us (and handle any errors)
        return value;
      } else {
        try {
          return spec.serialize(value);
        } catch (e) {
          return handleNullOrError(newCrystalError(e, null));
        }
      }
    }
    case "null": {
      if (spec.isNonNull) {
        return handleNullOrError(null);
      } else {
        return null;
      }
    }
    case "__typename": {
      if (isPolymorphicData(value)) {
        return value[$$concreteType];
      } else {
        // TODO: return the know __typename here
        throw new Error("TODO");
      }
    }
    case "introspection": {
      const {
        isNonNull,
        field: rawField,
        introspectionCacheByVariableValues,
        variableNames,
      } = spec;
      const field: FieldNode = {
        ...rawField,
        alias: { kind: Kind.NAME, value: "a" },
      };
      const document: DocumentNode = {
        definitions: [
          {
            kind: Kind.OPERATION_DEFINITION,
            operation: OperationTypeNode.QUERY,
            selectionSet: {
              kind: Kind.SELECTION_SET,
              selections: [field],
            },
          },
        ],
        kind: Kind.DOCUMENT,
      };
      const variableValues: Record<string, any> = {};
      for (const variableName of variableNames) {
        variableValues[variableName] = variables[variableName];
      }
      const canonical = canonicalJSONStringify(variableValues);
      const cached = introspectionCacheByVariableValues.get(canonical);
      if (cached) {
        return cached;
      }
      const graphqlResult = executeSync({
        schema: operationPlan.schema,
        document,
        variableValues,
      });
      if (graphqlResult.errors) {
        throw new Error("INTROSPECTION FAILED!");
      }
      const result = graphqlResult.data!.a;
      introspectionCacheByVariableValues.set(canonical, result);
      return result;
    }
    default: {
      const never: never = spec;
      throw new Error(
        `GraphileInternalError<31d26531-b20f-434c-91d8-686048da404c>: Unhandled bucket spec '${
          (never as any).mode
        }'`,
      );
    }
  }
}

/** @internal */
export async function executeBucket(
  bucket: Bucket,
  metaByStepId: MetaByStepId,
  requestContext: RequestContext,
): Promise<void> {}
