import type {
  CrystalResultsList,
  CrystalValuesList,
  PolymorphicData,
  PolymorphicPlan,
} from "graphile-crystal";
import { ExecutablePlan, polymorphicWrap } from "graphile-crystal";
import { isDev } from "graphile-crystal/src/dev";
import type { GraphQLObjectType } from "graphql";
import { inspect } from "util";

import type { PgSource } from "../datasource";
import type { PgSelectSinglePlan } from "./pgSelectSingle";

interface PgRelationalInterfaceTypeMap<TTypeSpecifier extends any> {
  [typeName: string]: {
    match(specifier: TTypeSpecifier): boolean;
    plan(): ExecutablePlan<any>;
  };
}

export class PgRelationalInterfacePlan<
    TDataSource extends PgSource<any, any, any, any, any>,
    TTypeSpecifier extends any,
  >
  extends ExecutablePlan<any>
  implements PolymorphicPlan
{
  private typeSpecifierPlanId: number;
  private itemPlanId: number;
  private types: string[];

  constructor(
    $itemPlan: PgSelectSinglePlan<TDataSource>,
    $typeSpecifierPlan: ExecutablePlan<TTypeSpecifier>,
    private possibleTypes: PgRelationalInterfaceTypeMap<TTypeSpecifier>,
  ) {
    super();
    this.itemPlanId = this.addDependency($itemPlan);
    this.typeSpecifierPlanId = this.addDependency($typeSpecifierPlan);
    this.types = Object.keys(possibleTypes);
  }

  planForType(type: GraphQLObjectType): ExecutablePlan {
    const spec = this.possibleTypes[type.name];
    if (!spec) {
      throw new Error(
        `${this} could resolve to ${
          type.name
        }, but can only handle the following types: '${Object.keys(
          this.possibleTypes,
        ).join("', '")}'`,
      );
    }
    return spec.plan();
  }

  private getTypeNameFromSpecifier(specifier: TTypeSpecifier) {
    const t = this.types.find((t) => this.possibleTypes[t].match(specifier));
    if (!t) {
      if (isDev) {
        console.error(
          `Could not find a type that matched the specifier '${inspect(
            specifier,
          )}'`,
        );
      }
      throw new Error("Could not determine the type to use");
    }
    return t;
  }

  async execute(
    values: CrystalValuesList<any[]>,
  ): Promise<
    CrystalResultsList<PolymorphicData<
      string,
      ReadonlyArray<TDataSource["TRow"]>
    > | null>
  > {
    return values.map((v) => {
      const specifier = v[this.typeSpecifierPlanId];
      if (specifier) {
        const typeName = this.getTypeNameFromSpecifier(specifier);
        return polymorphicWrap(typeName, v[this.itemPlanId]);
      } else {
        return null;
      }
    });
  }
}

export function pgRelationalInterface<
  TDataSource extends PgSource<any, any, any, any, any>,
  TTypeSpecifier extends any,
>(
  $itemPlan: PgSelectSinglePlan<TDataSource>,
  $typeSpecifierPlan: ExecutablePlan<TTypeSpecifier>,
  possibleTypes: PgRelationalInterfaceTypeMap<TTypeSpecifier>,
): PgRelationalInterfacePlan<TDataSource, TTypeSpecifier> {
  return new PgRelationalInterfacePlan<TDataSource, TTypeSpecifier>(
    $itemPlan,
    $typeSpecifierPlan,
    possibleTypes,
  );
}
