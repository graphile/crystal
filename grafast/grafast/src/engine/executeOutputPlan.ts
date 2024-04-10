import debugFactory from "debug";
import type { GraphQLError } from "graphql";

import * as assert from "../assert.js";
import type { Bucket, RequestTools } from "../bucket.js";
import { isDev } from "../dev.js";
import { inspect } from "../inspect.js";
import type { JSONValue } from "../interfaces.js";
import type { OutputPlan } from "./OutputPlan.js";

const debug = debugFactory("grafast:OutputPlan");
const debugVerbose = debug.extend("verbose");

export type OutputPath = Array<string | number>;
export interface OutputStream {
  asyncIterable: AsyncIterableIterator<any>;
}

/**
 * PayloadRoot handles the root-level of a payload, it's ultimately responsible
 * for sharing the `data`/`errors` with the user. But it also handles the
 * intermediate payloads for stream/defer.
 *
 * A standard GraphQL query/mutation request (one that doesn't use
 * `@stream`/`@defer`) will have just one payload. A standard GraphQL
 * subscription request gets one payload per subscription event.
 *
 * When we mix `@stream` and `@defer` into this, we will require (often quite a
 * lot) more payloads.
 *
 * @internal
 */
export interface PayloadRoot {
  /**
   * Serialization works differently if we're running inside GraphQL. (Namely:
   * we don't serialize - that's GraphQL's job.)
   */
  insideGraphQL: false;

  /**
   * The errors that have occurred; these are proper GraphQLErrors and will be
   * returned directly to clients so they must be complete.
   */
  errors: GraphQLError[];

  /**
   * Defer queue - we don't start executing these until after the main
   * payload is completed (to allow for a non-null boundary to abort
   * execution).
   */
  queue: Array<SubsequentPayloadSpec>;

  /**
   * Stream queue - we don't start executing these until after the main
   * payload is completed (to allow for a non-null boundary to abort
   * execution).
   */
  streams: Array<SubsequentStreamSpec>;

  /**
   * VERY DANGEROUS. This is _only_ to pass variables through to introspection
   * selections, it shouldn't be used for anything else.
   *
   * @internal
   * */
  variables: { [key: string]: any };
}

export interface OutputPlanContext {
  requestContext: RequestTools;
  root: PayloadRoot;
  path: ReadonlyArray<string | number>;
}

export interface SubsequentPayloadSpec {
  // TODO: abort this stream if an error occurred in this path
  // See: https://github.com/robrichard/defer-stream-wg/discussions/45#discussioncomment-3486994

  root: PayloadRoot;
  path: ReadonlyArray<string | number>;
  bucket: Bucket;
  bucketIndex: number;
  outputPlan: OutputPlan;
  label: string | undefined;
}

export interface SubsequentStreamSpec {
  // TODO: abort this stream if an error occurred in this path
  // See: https://github.com/robrichard/defer-stream-wg/discussions/45#discussioncomment-3486994

  root: PayloadRoot;
  path: ReadonlyArray<string | number>;
  bucket: Bucket;
  bucketIndex: number;
  outputPlan: OutputPlan;
  label: string | undefined;
  stream: AsyncIterator<any> | Iterator<any>;
  startIndex: number;
}

/**
 * @internal
 */
export function executeOutputPlan(
  ctx: OutputPlanContext,
  outputPlan: OutputPlan,
  bucket: Bucket,
  bucketIndex: number,
  outputDataAsString: boolean,
): JSONValue {
  if (debugVerbose.enabled) {
    debugVerbose("Executing %c with data:\n%c", outputPlan, bucket);
  }
  if (isDev) {
    assert.strictEqual(
      bucket.isComplete,
      true,
      "Can only process an output plan for a completed bucket",
    );
  }
  // PERF: feels like this path could be done more efficiently
  const mutablePath = ["SOMEONE_FORGOT_TO_SLICE_THE_PATH!", ...ctx.path];
  return outputDataAsString
    ? outputPlan.executeString(ctx.root, mutablePath, bucket, bucketIndex)
    : outputPlan.execute(ctx.root, mutablePath, bucket, bucketIndex);
}
