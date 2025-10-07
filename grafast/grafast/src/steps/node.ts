import { isDev } from "../dev.js";
import { inspect } from "../inspect.js";
import type {
  Maybe,
  NodeIdHandler,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
import { lambda } from "./lambda.js";

/** @see {@link noed} */
export class NodeStep extends UnbatchedStep<{
  __typename: string;
  specifier: any;
} | null> {
  static $$export = {
    moduleName: "grafast",
    exportName: "NodeStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  constructor(
    private possibleTypes: {
      [typeName: string]: NodeIdHandler;
    },
    $id: Step<string | null | undefined>,
  ) {
    super();
    const decodeNodeId = makeDecodeNodeId(Object.values(possibleTypes));
    this.addDependency(decodeNodeId($id));
  }

  private getTypeNameFromSpecifier(specifier: any) {
    for (const [typeName, typeSpec] of Object.entries(this.possibleTypes)) {
      const value = specifier[typeSpec.codec.name];
      if (value != null && typeSpec.match(value)) {
        return typeName;
      }
    }
    if (isDev) {
      console.error(
        `Could not find a type that matched the specifier '${inspect(
          specifier,
        )}'`,
      );
    }
    return null;
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, specifier: any) {
    const __typename =
      specifier != null ? this.getTypeNameFromSpecifier(specifier) : null;
    return __typename != null ? { __typename, specifier } : null;
  }
}

/**
 * Decodes a GraphQL global object identifier and produces a specifier suitable
 * for polymorphic resolution.
 *
 * The step resolves to either `null` (if the identifier cannot be decoded) or
 * an object `{ __typename, specifier }`. The `specifier` is the decoded
 * payload returned by the relevant {@link NodeIdHandler}; it should then be
 * fed into an abstract type's `planType()` logic to obtain the concrete step
 * required for that object type - this is normally done automatically when the
 * value is returned for an position with an abstract type.
 *
 * This step does **not** fetch the underlying record; it only performs the
 * decode and type discrimination.
 */
export function node(
  possibleTypes: {
    [typeName: string]: NodeIdHandler;
  },
  $id: Step<string | null | undefined>,
): NodeStep {
  return new NodeStep(possibleTypes, $id);
}

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
export function specFromNodeId(
  handler: NodeIdHandler<any>,
  $id: Step<Maybe<string>>,
) {
  function decodeWithCodecAndHandler(raw: Maybe<string>) {
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
  decodeWithCodecAndHandler.displayName = `decode_${handler.typeName}_${handler.codec.name}`;
  decodeWithCodecAndHandler.isSyncAndSafe = true; // Optimization
  const $decoded = lambda($id as Step<string>, decodeWithCodecAndHandler);
  return handler.getSpec($decoded);
}

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
