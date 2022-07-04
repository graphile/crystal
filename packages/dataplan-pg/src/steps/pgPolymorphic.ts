import type {
  CrystalResultsList,
  CrystalValuesList,
  PolymorphicData,
  PolymorphicStep,
} from "dataplanner";
import { ExecutableStep, isDev, polymorphicWrap } from "dataplanner";
import type { GraphQLObjectType } from "graphql";
import { inspect } from "util";

import type { PgClassExpressionStep } from "./pgClassExpression.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";

/**
 * A map from the potential concrete types a polymorphic item may be, how to
 * determine which one is correct, and how to handle it if it matches.
 */
export interface PgPolymorphicTypeMap<
  TItemStep extends
    | PgSelectSingleStep<any, any, any, any>
    | PgClassExpressionStep<any, any, any, any, any, any>,
  TTypeSpecifier,
  TTypeSpecifierStep extends ExecutableStep<TTypeSpecifier> = ExecutableStep<TTypeSpecifier>,
> {
  [typeName: string]: {
    match(specifier: TTypeSpecifier): boolean;
    plan($specifier: TTypeSpecifierStep, $item: TItemStep): ExecutableStep<any>;
  };
}

/**
 * This class is used for dealing with polymorphism; you feed it a plan
 * representing an item, a second plan indicating the type of that item, and a
 * PgPolymorphicTypeMap that helps figure out which type the item is and how to
 * handle it.
 */
export class PgPolymorphicStep<
    TItemStep extends
      | PgSelectSingleStep<any, any, any, any>
      | PgClassExpressionStep<any, any, any, any, any, any>,
    TTypeSpecifier,
    TTypeSpecifierStep extends ExecutableStep<TTypeSpecifier> = ExecutableStep<TTypeSpecifier>,
  >
  extends ExecutableStep<any>
  implements PolymorphicStep
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgPolymorphicStep",
  };
  isSyncAndSafe = true;

  private typeSpecifierPlanId: number;
  private itemPlanId: number;
  private types: string[];

  constructor(
    $itemPlan: TItemStep,
    $typeSpecifierPlan: TTypeSpecifierStep,
    private possibleTypes: PgPolymorphicTypeMap<
      TItemStep,
      TTypeSpecifier,
      TTypeSpecifierStep
    >,
  ) {
    super();
    this.itemPlanId = this.addDependency($itemPlan);
    this.typeSpecifierPlanId = this.addDependency($typeSpecifierPlan);
    this.types = Object.keys(possibleTypes);
  }

  deduplicate(
    peers: PgPolymorphicStep<any, any, any>[],
  ): PgPolymorphicStep<TItemStep, TTypeSpecifier, TTypeSpecifierStep> {
    const identical = peers.find((peer) => {
      return peer.possibleTypes === this.possibleTypes;
    }) as any;
    return identical ?? this;
  }

  itemPlan(): TItemStep {
    const plan = this.getPlan(this.dependencies[this.itemPlanId]);
    return plan as any;
  }

  typeSpecifierPlan(): TTypeSpecifierStep {
    const plan = this.getPlan(
      this.dependencies[this.typeSpecifierPlanId],
    ) as TTypeSpecifierStep;
    return plan;
  }

  planForType(type: GraphQLObjectType): ExecutableStep {
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
    return spec.plan(this.typeSpecifierPlan(), this.itemPlan());
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
      throw new Error(
        "Could not determine the type to use for this polymorphic value.",
      );
    }
    return t;
  }

  execute(
    values: Array<CrystalValuesList<any>>,
  ): CrystalResultsList<PolymorphicData<
    string,
    ReadonlyArray<any> // TODO: something to do with TCodec
  > | null> {
    return values[this.typeSpecifierPlanId].map((specifier) => {
      if (specifier) {
        const typeName = this.getTypeNameFromSpecifier(specifier);
        return polymorphicWrap(typeName);
      } else {
        return null;
      }
    });
  }
}

/**
 * This class is used for dealing with polymorphism; you feed it a plan
 * representing an item, a second plan indicating the type of that item, and a
 * PgPolymorphicTypeMap that helps figure out which type the item is and how to
 * handle it.
 */
export function pgPolymorphic<
  TItemStep extends
    | PgSelectSingleStep<any, any, any, any>
    | PgClassExpressionStep<any, any, any, any, any, any>,
  TTypeSpecifier = any,
  TTypeSpecifierStep extends ExecutableStep<TTypeSpecifier> = ExecutableStep<TTypeSpecifier>,
>(
  $itemPlan: TItemStep,
  $typeSpecifierPlan: TTypeSpecifierStep,
  possibleTypes: PgPolymorphicTypeMap<
    TItemStep,
    TTypeSpecifier,
    TTypeSpecifierStep
  >,
): PgPolymorphicStep<TItemStep, TTypeSpecifier, TTypeSpecifierStep> {
  return new PgPolymorphicStep<TItemStep, TTypeSpecifier, TTypeSpecifierStep>(
    $itemPlan,
    $typeSpecifierPlan,
    possibleTypes,
  );
}

Object.defineProperty(pgPolymorphic, "$$export", {
  value: {
    moduleName: "@dataplan/pg",
    exportName: "pgPolymorphic",
  },
});
