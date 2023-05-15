import type { GraphQLObjectType } from "graphql";

import { isDev } from "../dev.js";
import { inspect } from "../inspect.js";
import type {
  ExecutionExtra,
  NodeIdCodec,
  NodeIdHandler,
  PolymorphicData,
} from "../interfaces.js";
import { polymorphicWrap } from "../polymorphic.js";
import type { ExecutableStep, PolymorphicStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { access } from "./access.js";
import { constant } from "./constant.js";
import { lambda } from "./lambda.js";

/**
 * A plan to get a Node by it's global object identifier (string). Accepts an
 * object specifying the supported codecs, an object map detailing the
 * typeNames supported and their details (codec to use, how to find the record,
 * etc), and finally the Node id string plan.
 */
export class NodeStep<TCodecs extends { [key: string]: NodeIdCodec<any> }>
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
    codecs: TCodecs,
    private possibleTypes: {
      [typeName: string]: NodeIdHandler<TCodecs>;
    },
    $id: ExecutableStep<string>,
  ) {
    super();
    function decodeNodeIdWithCodecs(raw: string) {
      return Object.entries(codecs).reduce(
        (memo, [codecName, codec]) => {
          try {
            memo[codecName as keyof TCodecs] = codec.decode(raw);
          } catch (e) {
            memo[codecName as keyof TCodecs] = null;
          }
          return memo;
        },
        { raw } as {
          [key in keyof TCodecs]: ReturnType<TCodecs[key]["decode"]> | null;
        },
      );
    }
    decodeNodeIdWithCodecs.isSyncAndSafe = true; // Optimization
    this.specPlanDep = this.addDependency(lambda($id, decodeNodeIdWithCodecs));
  }

  planForType(type: GraphQLObjectType): ExecutableStep {
    const spec = this.possibleTypes[type.name];
    if (spec !== undefined) {
      return spec.get(
        spec.getSpec(access(this.getDep(this.specPlanDep), [spec.codecName])),
      );
    } else {
      return constant(null);
    }
  }

  private getTypeNameFromSpecifier(specifier: any) {
    for (const [typeName, typeSpec] of Object.entries(this.possibleTypes)) {
      const value = specifier[typeSpec.codecName];
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
    _extra: ExecutionExtra,
    specifier: any,
  ): PolymorphicData<string, ReadonlyArray<any>> | null => {
    const typeName = specifier
      ? this.getTypeNameFromSpecifier(specifier)
      : null;
    return typeName ? polymorphicWrap(typeName) : null;
  };
}

/**
 * A plan to get a Node by it's global object identifier (string). Accepts an
 * object specifying the supported codecs, an object map detailing the
 * typeNames supported and their details (codec to use, how to find the record,
 * etc), and finally the Node id string plan.
 */
export function node<TCodecs extends { [key: string]: NodeIdCodec<any> }>(
  codecs: TCodecs,
  possibleTypes: {
    [typeName: string]: NodeIdHandler<TCodecs>;
  },
  $id: ExecutableStep<string>,
): NodeStep<TCodecs> {
  return new NodeStep(codecs, possibleTypes, $id);
}

export function specFromNodeId(
  codec: NodeIdCodec<any>,
  handler: NodeIdHandler<any>,
  $id: ExecutableStep<string>,
) {
  function decodeWithCodecAndHandler(raw: string) {
    try {
      const decoded = codec.decode(raw);
      if (handler.match(decoded)) {
        return decoded;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  decodeWithCodecAndHandler.displayName = `decode_${handler.typeName}_${handler.codecName}`;
  decodeWithCodecAndHandler.isSyncAndSafe = true; // Optimization
  const $decoded = lambda($id, decodeWithCodecAndHandler);
  return handler.getSpec($decoded);
}
