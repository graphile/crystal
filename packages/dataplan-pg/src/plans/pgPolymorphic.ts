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
import type { PgTypeCodec } from "../interfaces";
import type { PgClassExpressionPlan } from "./pgClassExpression";
import type { PgSelectSinglePlan } from "./pgSelectSingle";

interface PgPolymorphicTypeMap<
  TTypeSpecifier,
  TTypeSpecifierPlan extends ExecutablePlan<TTypeSpecifier>,
> {
  [typeName: string]: {
    match(specifier: TTypeSpecifier): boolean;
    plan($specifier: TTypeSpecifierPlan): ExecutablePlan<any>;
  };
}

export class PgPolymorphicPlan<
    TCodec extends PgTypeCodec,
    TTypeSpecifier,
    TTypeSpecifierPlan extends ExecutablePlan<TTypeSpecifier> = ExecutablePlan<TTypeSpecifier>,
  >
  extends ExecutablePlan<any>
  implements PolymorphicPlan
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgPolymorphicPlan",
  };

  private typeSpecifierPlanId: number;
  private itemPlanId: number;
  private types: string[];

  constructor(
    $itemPlan:
      | PgSelectSinglePlan<PgSource<TCodec, any, any, any, any>>
      | PgClassExpressionPlan<any, TCodec>,
    $typeSpecifierPlan: TTypeSpecifierPlan,
    private possibleTypes: PgPolymorphicTypeMap<
      TTypeSpecifier,
      TTypeSpecifierPlan
    >,
  ) {
    super();
    this.itemPlanId = this.addDependency($itemPlan);
    this.typeSpecifierPlanId = this.addDependency($typeSpecifierPlan);
    this.types = Object.keys(possibleTypes);
  }

  typeSpecifierPlan(): TTypeSpecifierPlan {
    const plan = this.getPlan(
      this.dependencies[this.typeSpecifierPlanId],
    ) as TTypeSpecifierPlan;
    return plan;
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
    return spec.plan(this.typeSpecifierPlan());
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

  async execute(values: CrystalValuesList<any[]>): Promise<
    CrystalResultsList<PolymorphicData<
      string,
      ReadonlyArray<any> // TODO: something to do with TCodec
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

export function pgPolymorphic<
  TCodec extends PgTypeCodec,
  TTypeSpecifierPlan extends ExecutablePlan<any> = ExecutablePlan<any>,
>(
  $itemPlan:
    | PgSelectSinglePlan<PgSource<TCodec, any, any, any, any>>
    | PgClassExpressionPlan<any, TCodec>,
  $typeSpecifierPlan: TTypeSpecifierPlan,
  possibleTypes: PgPolymorphicTypeMap<
    TTypeSpecifierPlan extends ExecutablePlan<infer U> ? U : any,
    TTypeSpecifierPlan
  >,
): PgPolymorphicPlan<
  TCodec,
  TTypeSpecifierPlan extends ExecutablePlan<infer U> ? U : any,
  TTypeSpecifierPlan
> {
  return new PgPolymorphicPlan<
    TCodec,
    TTypeSpecifierPlan extends ExecutablePlan<infer U> ? U : any,
    TTypeSpecifierPlan
  >($itemPlan, $typeSpecifierPlan, possibleTypes);
}

Object.assign(pgPolymorphic, {
  $$export: {
    moduleName: "@dataplan/pg",
    exportName: "pgPolymorphic",
  },
});
