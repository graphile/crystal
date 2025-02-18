import type { GraphQLObjectType } from "graphql";

import { isDev } from "../dev.js";
import { inspect } from "../inspect.js";
import type {
  AnyInputStep,
  Maybe,
  NodeIdHandler,
  PolymorphicData,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import { polymorphicWrap } from "../polymorphic.js";
import type { ExecutableStep, PolymorphicStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { access } from "./access.js";
import { constant } from "./constant.js";
import { lambda } from "./lambda.js";

/**
 * A plan to get a Node by its global object identifier (string). Accepts an
 * object specifying the supported codecs, an object map detailing the
 * typeNames supported and their details (codec to use, how to find the record,
 * etc), and finally the Node id string plan.
 */
export class NodeStep
  extends UnbatchedExecutableStep
  implements PolymorphicStep
{
  static $$export = {
    moduleName: "grafast",
    exportName: "NodeStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  private specPlanDep: number;

  constructor(
    private possibleTypes: {
      [typeName: string]: NodeIdHandler;
    },
    $id: ExecutableStep<string | null | undefined>,
  ) {
    super();
    const decodeNodeId = makeDecodeNodeId(Object.values(possibleTypes));
    this.specPlanDep = this.addDependency(decodeNodeId($id));
  }

  planForType(type: GraphQLObjectType): ExecutableStep {
    const spec = this.possibleTypes[type.name];
    if (spec !== undefined) {
      return spec.get(
        spec.getSpec(access(this.getDep(this.specPlanDep), [spec.codec.name])),
      );
    } else {
      return constant(null);
    }
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

  unbatchedExecute = (
    _extra: UnbatchedExecutionExtra,
    specifier: any,
  ): PolymorphicData<string, ReadonlyArray<any>> | null => {
    const typeName = specifier
      ? this.getTypeNameFromSpecifier(specifier)
      : null;
    return typeName ? polymorphicWrap(typeName) : null;
  };
}

/**
 * A plan to get a Node by its global object identifier (string). Accepts an
 * object specifying the supported codecs, an object map detailing the
 * typeNames supported and their details (codec to use, how to find the record,
 * etc), and finally the Node id string plan.
 */
export function node(
  possibleTypes: {
    [typeName: string]: NodeIdHandler;
  },
  $id: ExecutableStep<string | null | undefined>,
): NodeStep {
  return new NodeStep(possibleTypes, $id);
}

export function specFromNodeId(
  handler: NodeIdHandler<any>,
  $id: ExecutableStep<Maybe<string>>,
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
  const $decoded = lambda(
    $id as ExecutableStep<string>,
    decodeWithCodecAndHandler,
  );
  return handler.getSpec($decoded);
}

export function nodeIdFromNode(
  handler: NodeIdHandler<any>,
  $node: ExecutableStep,
) {
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
  return ($id: ExecutableStep<string | null | undefined>) =>
    lambda($id, decodeNodeIdWithCodecs);
}
