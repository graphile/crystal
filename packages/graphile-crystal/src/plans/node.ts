import type { GraphQLObjectType } from "graphql";
import { inspect } from "util";

import { isDev } from "../dev";
import type {
  CrystalResultsList,
  CrystalValuesList,
  NodeIdCodec,
  NodeIdHandler,
  PolymorphicData,
} from "../interfaces";
import type { PolymorphicPlan } from "../plan";
import { ExecutablePlan } from "../plan";
import { polymorphicWrap } from "../polymorphic";
import { access } from "./access";
import { constant } from "./constant";
import { lambda } from "./lambda";

export class NodePlan<TCodecs extends { [key: string]: NodeIdCodec<any> }>
  extends ExecutablePlan
  implements PolymorphicPlan
{
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "NodePlan",
  };
  sync = true;

  private specPlanId: number;

  constructor(
    private codecs: TCodecs,
    private possibleTypes: {
      [typeName: string]: NodeIdHandler<TCodecs>;
    },
    $id: ExecutablePlan<string>,
  ) {
    super();
    this.specPlanId = this.addDependency(
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

  planForType(type: GraphQLObjectType): ExecutablePlan {
    const spec = this.possibleTypes[type.name];
    if (spec) {
      return spec.get(access(this.getDep(this.specPlanId), [spec.codecName]));
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
    throw new Error("Could not determine the type to use");
  }

  execute(
    values: CrystalValuesList<any[]>,
  ): CrystalResultsList<PolymorphicData<string, ReadonlyArray<any>> | null> {
    return values.map((v) => {
      const specifier = v[this.specPlanId];
      if (specifier) {
        const typeName = this.getTypeNameFromSpecifier(specifier);
        return polymorphicWrap(typeName);
      } else {
        return null;
      }
    });
  }
}

export function node<TCodecs extends { [key: string]: NodeIdCodec<any> }>(
  codecs: TCodecs,
  possibleTypes: {
    [typeName: string]: NodeIdHandler<TCodecs>;
  },
  $id: ExecutablePlan<string>,
): NodePlan<TCodecs> {
  return new NodePlan(codecs, possibleTypes, $id);
}
