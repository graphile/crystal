import type { GraphQLObjectType } from "graphql";
import { inspect } from "util";

import { isDev } from "../dev.js";
import type {
  CrystalResultsList,
  CrystalValuesList,
  NodeIdCodec,
  NodeIdHandler,
  PolymorphicData,
} from "../interfaces.js";
import { polymorphicWrap } from "../polymorphic.js";
import type { PolymorphicStep } from "../step.js";
import { ExecutableStep } from "../step.js";
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
  extends ExecutableStep
  implements PolymorphicStep
{
  static $$export = {
    moduleName: "dataplanner",
    exportName: "NodeStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  private specPlanDep: number;

  constructor(
    private codecs: TCodecs,
    private possibleTypes: {
      [typeName: string]: NodeIdHandler<TCodecs>;
    },
    $id: ExecutableStep<string>,
  ) {
    super();
    this.specPlanDep = this.addDependency(
      lambda($id, (raw) =>
        Object.entries(codecs).reduce(
          (memo, [codecName, codec]) => {
            try {
              memo[codecName] = codec.decode(raw);
            } catch (e) {
              memo[codecName] = null;
            }
            return memo;
          },
          { raw },
        ),
      ),
    );
  }

  planForType(type: GraphQLObjectType): ExecutableStep {
    const spec = this.possibleTypes[type.name];
    if (spec) {
      return spec.get(access(this.getDep(this.specPlanDep), [spec.codecName]));
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

  execute(
    values: Array<CrystalValuesList<any>>,
  ): CrystalResultsList<PolymorphicData<string, ReadonlyArray<any>> | null> {
    return values[this.specPlanDep].map((specifier) => {
      const typeName = specifier
        ? this.getTypeNameFromSpecifier(specifier)
        : null;
      return typeName ? polymorphicWrap(typeName) : null;
    });
  }

  executeSingle = (
    v: any[],
  ): PolymorphicData<string, ReadonlyArray<any>> | null => {
    const specifier = v[this.specPlanDep];
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
