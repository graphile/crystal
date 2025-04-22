import type { ExecutableStep, UnbatchedExecutionExtra } from "grafast";
import {
  exportAs,
  isDev,
  polymorphicWrap,
  SafeError,
  UnbatchedStep,
} from "grafast";
import type { GraphQLObjectType } from "grafast/graphql";

import { inspect } from "../inspect.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";

/**
 * A map from the potential concrete types a polymorphic item may be, how to
 * determine which one is correct, and how to handle it if it matches.
 */
export interface PgPolymorphicTypeMap<
  TItemStep extends PgSelectSingleStep<any> | PgClassExpressionStep<any, any>,
  TTypeSpecifier,
  TTypeSpecifierStep extends
    ExecutableStep<TTypeSpecifier> = ExecutableStep<TTypeSpecifier>,
> {
  readonly [typeName: string]: {
    match(specifier: TTypeSpecifier): boolean;
    plan($specifier: TTypeSpecifierStep, $item: TItemStep): ExecutableStep;
  };
}

/**
 * This class is used for dealing with polymorphism; you feed it a plan
 * representing an item, a second plan indicating the type of that item, and a
 * PgPolymorphicTypeMap that helps figure out which type the item is and how to
 * handle it.
 */
export class PgPolymorphicStep<
  TItemStep extends PgSelectSingleStep<any> | PgClassExpressionStep<any, any>,
  TTypeSpecifier,
  TTypeSpecifierStep extends
    ExecutableStep<TTypeSpecifier> = ExecutableStep<TTypeSpecifier>,
> extends UnbatchedStep<any> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgPolymorphicStep",
  };
  isSyncAndSafe = true;

  private typeSpecifierStepId: number;
  private itemStepId: number;
  private readonly types: readonly string[];

  constructor(
    $item: TItemStep,
    $typeSpecifier: TTypeSpecifierStep,
    private readonly possibleTypes: PgPolymorphicTypeMap<
      TItemStep,
      TTypeSpecifier,
      TTypeSpecifierStep
    >,
  ) {
    super();
    this.itemStepId = this.addDependency($item);
    this.typeSpecifierStepId = this.addDependency($typeSpecifier);
    this.types = Object.keys(possibleTypes);
    this.peerKey = JSON.stringify(this.types);
  }

  deduplicate(
    peers: PgPolymorphicStep<any, any, any>[],
  ): PgPolymorphicStep<TItemStep, TTypeSpecifier, TTypeSpecifierStep>[] {
    return peers.filter((peer) => {
      return peer.possibleTypes === this.possibleTypes;
    }) as any;
  }

  private itemPlan(): TItemStep {
    return this.getDepOptions<TItemStep>(this.itemStepId).step;
  }

  private typeSpecifierPlan(): TTypeSpecifierStep {
    return this.getDepOptions<TTypeSpecifierStep>(this.typeSpecifierStepId)
      .step;
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
    const $typeSpecifier = this.typeSpecifierPlan();
    const $item = this.itemPlan();
    return spec.plan($typeSpecifier, $item);
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
      throw new SafeError(
        "Could not determine the type to use for this polymorphic value.",
      );
    }
    return t;
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, item: any, specifier: any) {
    if (specifier) {
      const typeName = this.getTypeNameFromSpecifier(specifier);
      return polymorphicWrap(typeName, item);
    } else {
      return null;
    }
  }
}

/**
 * This class is used for dealing with polymorphism; you feed it a plan
 * representing an item, a second plan indicating the type of that item, and a
 * PgPolymorphicTypeMap that helps figure out which type the item is and how to
 * handle it.
 */
export function pgPolymorphic<
  TItemStep extends PgSelectSingleStep<any> | PgClassExpressionStep<any, any>,
  TTypeSpecifier = any,
  TTypeSpecifierStep extends
    ExecutableStep<TTypeSpecifier> = ExecutableStep<TTypeSpecifier>,
>(
  $item: TItemStep,
  $typeSpecifier: TTypeSpecifierStep,
  possibleTypes: PgPolymorphicTypeMap<
    TItemStep,
    TTypeSpecifier,
    TTypeSpecifierStep
  >,
): PgPolymorphicStep<TItemStep, TTypeSpecifier, TTypeSpecifierStep> {
  return new PgPolymorphicStep<TItemStep, TTypeSpecifier, TTypeSpecifierStep>(
    $item,
    $typeSpecifier,
    possibleTypes,
  );
}

exportAs("@dataplan/pg", pgPolymorphic, "pgPolymorphic");
