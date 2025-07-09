import type { ExecutableStep, PolymorphicData, PolymorphicStep, UnbatchedExecutionExtra } from "grafast";
import { UnbatchedStep } from "grafast";
import type { GraphQLObjectType } from "grafast/graphql";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";
/**
 * A map from the potential concrete types a polymorphic item may be, how to
 * determine which one is correct, and how to handle it if it matches.
 */
export interface PgPolymorphicTypeMap<TItemStep extends PgSelectSingleStep<any> | PgClassExpressionStep<any, any>, TTypeSpecifier, TTypeSpecifierStep extends ExecutableStep<TTypeSpecifier> = ExecutableStep<TTypeSpecifier>> {
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
export declare class PgPolymorphicStep<TItemStep extends PgSelectSingleStep<any> | PgClassExpressionStep<any, any>, TTypeSpecifier, TTypeSpecifierStep extends ExecutableStep<TTypeSpecifier> = ExecutableStep<TTypeSpecifier>> extends UnbatchedStep<any> implements PolymorphicStep {
    private readonly possibleTypes;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private typeSpecifierStepId;
    private itemStepId;
    private readonly types;
    constructor($item: TItemStep, $typeSpecifier: TTypeSpecifierStep, possibleTypes: PgPolymorphicTypeMap<TItemStep, TTypeSpecifier, TTypeSpecifierStep>);
    deduplicate(peers: PgPolymorphicStep<any, any, any>[]): PgPolymorphicStep<TItemStep, TTypeSpecifier, TTypeSpecifierStep>[];
    private itemPlan;
    private typeSpecifierPlan;
    planForType(type: GraphQLObjectType): ExecutableStep;
    private getTypeNameFromSpecifier;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, _item: any, specifier: any): PolymorphicData<string> | null;
}
/**
 * This class is used for dealing with polymorphism; you feed it a plan
 * representing an item, a second plan indicating the type of that item, and a
 * PgPolymorphicTypeMap that helps figure out which type the item is and how to
 * handle it.
 */
export declare function pgPolymorphic<TItemStep extends PgSelectSingleStep<any> | PgClassExpressionStep<any, any>, TTypeSpecifier = any, TTypeSpecifierStep extends ExecutableStep<TTypeSpecifier> = ExecutableStep<TTypeSpecifier>>($item: TItemStep, $typeSpecifier: TTypeSpecifierStep, possibleTypes: PgPolymorphicTypeMap<TItemStep, TTypeSpecifier, TTypeSpecifierStep>): PgPolymorphicStep<TItemStep, TTypeSpecifier, TTypeSpecifierStep>;
//# sourceMappingURL=pgPolymorphic.d.ts.map