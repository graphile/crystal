import * as assert from "assert";
import { inspect } from "util";

import type { Bucket, RequestContext } from "../bucket";
import type { CrystalError} from "../error";
import { newFieldError } from "../error";
import { newCrystalError } from "../error";
import { isCrystalError } from "../error";
import type { PromiseOrDirect } from "../interfaces";
import { $$concreteType } from "../interfaces";
import { isPolymorphicData } from "../polymorphic";
import { arrayOfLength } from "../utils";
import type { LayerPlan } from "./LayerPlan";
import type { OutputPlan } from "./OutputPlan";

export type OutputPath = Array<string | number>;
export interface OutputStream {
  asyncIterable: AsyncIterableIterator<any>;
}

export interface OutputError {
  path: OutputPath;
  error: CrystalError;
}

/** @internal */
export interface OutputResult {
  data?: any;
  streams: OutputStream[];
  errors: OutputError[];
}

// /**
//  * When we take a plan result and store it to the result tree, for non-leaf
//  * plans we're either storing a list or an object. What the underlying plan
//  * represents this as is irrelevant - e.g. a plan for an object type might
//  * return a tuple instead of an object; this is fine - we should still add an
//  * object to the result tree.
//  *
//  * Where possible we try and "merge" the result with the previous result.
//  *
//  * @internal
//  */
// export function bucketValue(
//   operationPlan: OperationPlan,
//   object: object,
//   key: string | number,
//   value: any,
//   spec: OutputPlanChild,
//   concreteType: string | null,
//   // This gets called if any of the non-null constraints are failed, or if
//   // there was an error. This triggers processing through the GraphQL.js stack.
//   requestContext: RequestContext,
//   // `null` here would imply a non-null error
//   onErrorOrNonNullViolation: (errorOrNull: CrystalError | null) => void,
// ): any {
//   const handleNullOrError = (nullOrError: undefined | null | CrystalError) => {
//     if (spec.isNonNull || nullOrError != null) {
//       // Add an error
//       onErrorOrNonNullViolation(nullOrError ?? null);
//     }
//     // DO NOT RETURN `undefined`!
//     return null;
//   };
//   if (isCrystalError(value)) {
//     return handleNullOrError(value);
//   }
//   if (value == null) {
//     return handleNullOrError(value);
//   }
//   switch (spec.mode) {
//     case "root": {
//       return Object.create(null);
//     }
//     case "array": {
//       if (Array.isArray(value)) {
//         return arrayOfLength(value.length);
//       } else {
//         console.warn(
//           `Hit fallback for value ${inspect(value)} coercion to mode ${
//             spec.mode
//           }`,
//         );
//         return handleNullOrError(null);
//       }
//     }
//     case "object": {
//       const typeName = isPolymorphicData(value)
//         ? value[$$concreteType]
//         : concreteType;
//       return spec.objectCreator(typeName);
//     }
//     case "leaf": {
//       if (requestContext.insideGraphQL) {
//         // Do not serialize inside GraphQL, GraphQL will do that for us (and handle any errors)
//         return value;
//       } else {
//         try {
//           return spec.serialize(value);
//         } catch (e) {
//           return handleNullOrError(newCrystalError(e, null));
//         }
//       }
//     }
//     case "null": {
//       if (spec.isNonNull) {
//         return handleNullOrError(null);
//       } else {
//         return null;
//       }
//     }
//     case "__typename": {
//       if (isPolymorphicData(value)) {
//         return value[$$concreteType];
//       } else {
//         // TODO: return the know __typename here
//         throw new Error("TODO");
//       }
//     }
//     case "introspection": {
//       const {
//         isNonNull,
//         field: rawField,
//         introspectionCacheByVariableValues,
//         variableNames,
//       } = spec;
//       const field: FieldNode = {
//         ...rawField,
//         alias: { kind: Kind.NAME, value: "a" },
//       };
//       const document: DocumentNode = {
//         definitions: [
//           {
//             kind: Kind.OPERATION_DEFINITION,
//             operation: OperationTypeNode.QUERY,
//             selectionSet: {
//               kind: Kind.SELECTION_SET,
//               selections: [field],
//             },
//           },
//         ],
//         kind: Kind.DOCUMENT,
//       };
//       const variableValues: Record<string, any> = {};
//       for (const variableName of variableNames) {
//         variableValues[variableName] = variables[variableName];
//       }
//       const canonical = canonicalJSONStringify(variableValues);
//       const cached = introspectionCacheByVariableValues.get(canonical);
//       if (cached) {
//         return cached;
//       }
//       const graphqlResult = executeSync({
//         schema: operationPlan.schema,
//         document,
//         variableValues,
//       });
//       if (graphqlResult.errors) {
//         throw new Error("INTROSPECTION FAILED!");
//       }
//       const result = graphqlResult.data!.a;
//       introspectionCacheByVariableValues.set(canonical, result);
//       return result;
//     }
//     default: {
//       const never: never = spec;
//       throw new Error(
//         `GraphileInternalError<31d26531-b20f-434c-91d8-686048da404c>: Unhandled bucket spec '${
//           (never as any).mode
//         }'`,
//       );
//     }
//   }
// }

/**
 * To help us avoid having too many promises/awaits/etc, we add our work to the
 * queue and then exhaust the queue as much as we can synchronously.
 */
interface NextStep {
  /** path */
  p: Array<string | number>;
  /** target */
  t: object;
  /** key */
  k: string;
  /** outputPlan */
  o: OutputPlan;
  /** streams */
  s: OutputStream[];
  /** errors */
  e: OutputError[];
}

type NextStepByLayerPlan = { [layerPlanId: number]: NextStep[] };

interface PayloadRoot {
  streams: OutputStream[];
  errors: OutputError[];
}

// TODO: to start with we're going to do looping here; but later we can compile
// the output plans (even nested ones) into simple functions that just generate
// the resulting objects directly without looping.
/**
 * @internal
 */
export function executeOutputPlan(
  requestContext: RequestContext,
  root: PayloadRoot,
  outputPlan: OutputPlan,
  bucket: Bucket,
  bucketIndex: number,
  path: Array<string | number>,
  queue: NextStepByLayerPlan,
): unknown {
  const { streams, errors } = root;
  assert.strictEqual(
    bucket.isComplete,
    true,
    "Can only process an output plan for a completed bucket",
  );
  const bucketRootValue = bucket.store[outputPlan.rootStepId][bucketIndex];

  const output = (
    object: Record<string, unknown>,
    key: string,
    childOutputPlan: OutputPlan,
  ) => {
    queue[childOutputPlan.layerPlan.id].push({
      p: [...path, key],
      t: object,
      k: key,
      o: childOutputPlan,
      s: streams,
      e: errors,
    });
  };

  if (isCrystalError(bucketRootValue)) {
    // > If the field returns null because of a field error which has already
    // > been added to the "errors" list in the response, the "errors" list must
    // > not be further affected. That is, only one error should be added to the
    // > errors list per field.
    // -- https://spec.graphql.org/draft/#sel-EANTNDLAACNAn7V
    return newFieldError(bucketRootValue, path);
  } else {
    switch (outputPlan.type.mode) {
      case "root":
      case "object":
      case "polymorphic": {
        let typeName: string;
        if (outputPlan.type.mode === "root") {
          typeName = outputPlan.type.typeName;
        } else if (bucketRootValue == null) {
          return null;
        } else if (outputPlan.type.mode === "object") {
          typeName = outputPlan.type.typeName;
        } else {
          assert.ok(
            isPolymorphicData(bucketRootValue),
            "Expected polymorphic data",
          );
          typeName = bucketRootValue[$$concreteType];
          assert.ok(typeName, "Could not determine concreteType for object");
        }
        data = outputPlan.objectCreator!(typeName);
        for (const [key, spec] of Object.entries(outputPlan.keys[typeName])) {
          // __typename already handled
          if (spec.type === "outputPlan") {
            output(data, key, spec.outputPlan);
          }
        }
        break;
      }
      case "array": {
      }
      case "null": {
      }
      case "leaf": {
      }
    }
  }
  return null as any;
}
