import type { Maybe, NodeIdHandler } from "../interfaces.ts";
import type { Step } from "../step.ts";
import { constant } from "./constant.ts";
import { lambda } from "./lambda.ts";

/**
 * Decodes a global identifier that is expected to correspond to a specific
 * {@link NodeIdHandler}. The returned specifier can be passed directly to
 * whatever data-source helper understands that handler's spec (for example a
 * `get`/`update` helper on your own resource abstraction) without invoking the
 * polymorphic machinery.
 *
 * Prefer `specFromNodeId()` whenever the expected object type is already
 * known (for example in `updateUser(id: ID!, ...)` mutations). It avoids the
 * extra work performed by {@link NodeStep} and keeps plan resolvers
 * straightforward.
 */
export function specFromNodeId<
  THandler extends NodeIdHandler<any> = NodeIdHandler<any>,
>(
  handler: THandler,
  $id: Step<Maybe<string>>,
): ReturnType<THandler["getSpec"]> {
  const $decoded = lambda(
    { handler: constant(handler), raw: $id as Step<string> },
    decodeNodeIdWithHandler,
  );
  return handler.getSpec($decoded);
}

interface DecodeNodeIdDetails {
  handler: NodeIdHandler<any>;
  raw: Maybe<string>;
}

function decodeNodeIdWithHandler(details: DecodeNodeIdDetails) {
  const { handler, raw } = details;
  if (raw == null) return raw;
  try {
    const decoded = handler.codec.decode(raw);
    if (handler.match(decoded)) {
      return decoded;
    }
    return null;
  } catch (e) {
    return null;
  }
}
decodeNodeIdWithHandler.isSyncAndSafe = true; // Optimization

export function nodeIdFromNode(handler: NodeIdHandler<any>, $node: Step) {
  const specifier = handler.plan($node);
  return lambda(specifier, handler.codec.encode);
}

export function makeDecodeNodeIdRuntime(handlers: readonly NodeIdHandler[]) {
  const codecs = [...new Set(handlers.map((h) => h.codec))];

  function decodeNodeIdWithCodecs(raw: string | null | undefined) {
    if (raw == null) return null;
    return codecs.reduce(
      (memo, codec) => {
        try {
          memo[codec.name] = codec.decode(raw);
        } catch (e) {
          memo[codec.name] = null;
        }
        return memo;
      },
      { raw } as {
        [codecName: string]: any | null;
      },
    );
  }
  decodeNodeIdWithCodecs.isSyncAndSafe = true; // Optimization
  return decodeNodeIdWithCodecs;
}

export function makeDecodeNodeId(handlers: readonly NodeIdHandler[]) {
  const decodeNodeIdWithCodecs = makeDecodeNodeIdRuntime(handlers);
  return ($id: Step<string | null | undefined>) =>
    lambda($id, decodeNodeIdWithCodecs);
}
