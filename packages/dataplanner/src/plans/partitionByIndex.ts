import chalk from "chalk";
import { getNamedType } from "graphql";

import { getCurrentGraphQLType } from "../global.js";
import type { ExecutablePlan } from "../plan.js";
import { isListCapablePlan } from "../plan.js";
import type { __ItemPlan } from "./__item.js";
import { each } from "./each.js";
import type {
  __ListTransformPlan,
  ListTransformItemPlanCallback,
  ListTransformReduce,
} from "./listTransform.js";
import { listTransform } from "./listTransform.js";

type Reduce = ListTransformReduce<unknown[][], number>;

/**
 * For 0-based indexes
 *
 * @internal
 */
const reduceCallback0: Reduce = (memo, entireItemValue, idx) => {
  if (!memo[idx]) memo[idx] = [];
  memo[idx].push(entireItemValue);
  return memo;
};

/**
 * For 1-based indexes
 *
 * @internal
 */
const reduceCallback1: Reduce = (memo, entireItemValue, idx1) => {
  const idx = idx1 - 1;
  if (!memo[idx]) memo[idx] = [];
  memo[idx].push(entireItemValue);
  return memo;
};

const initialState = () => [];

/**
 * Takes a single dimensional list plan and a mapper that calculates a
 * (potentially duplicate) target index for each entry in the list. Returns a
 * plan that results in a two dimensional list of the items in the original
 * list partitioned (grouped) by their target index.
 *
 * If your datasource returns indexes that are 1-indexed then you may pass `1`
 * as the third argument and we'll account for this.
 *
 * @example For this data:
 *
 * ```jsonc
 * [
 *   {"array_idx": 1, "id": "b0b00000-0000-0000-0000-000000000b0b", "username": "Bob"},
 *   {"array_idx": 2, "id": "a11ce000-0000-0000-0000-0000000a11ce", "username": "Alice"}],
 *   {"array_idx": 2, "id": "cec111a0-0000-0000-0000-00000cec111a", "username": "Cecilia"}],
 * ]
 * ```
 *
 * partitioning by the array_idx (which is 1-indexed), would result in:
 *
 * ```jsonc
 * [
 *   [
 *     {"array_idx": 1, "id": "b0b00000-0000-0000-0000-000000000b0b", "username": "Bob"},
 *   ],
 *   [
 *     {"array_idx": 2, "id": "a11ce000-0000-0000-0000-0000000a11ce", "username": "Alice"}],
 *     {"array_idx": 2, "id": "cec111a0-0000-0000-0000-00000cec111a", "username": "Cecilia"}],
 *   ],
 * ]
 * ```
 *
 * Beware: the target indexes should not contain gaps.
 */
export function partitionByIndex<
  TListPlan extends ExecutablePlan<readonly any[]>,
  TItemPlan extends ExecutablePlan<number>,
>(
  listPlan: TListPlan,
  mapper: ListTransformItemPlanCallback<TListPlan, TItemPlan>,
  startIndex: 0 | 1 = 0,
): __ListTransformPlan<TListPlan, TItemPlan, unknown[][], any> {
  if (startIndex !== 0 && startIndex !== 1) {
    throw new Error(
      `partitionByIndex only supports 0- and 1-indexed lists currently; please use 'lambda' to convert your index`,
    );
  }
  const currentGraphQLType = getCurrentGraphQLType();
  if (!currentGraphQLType) {
    throw new Error("partitionByIndex cannot be used in this position");
  }
  const namedType = getNamedType(currentGraphQLType);
  return listTransform<TListPlan, TItemPlan, unknown[][], any>({
    listPlan,
    itemPlanCallback: mapper,
    initialState,
    reduceCallback: startIndex === 1 ? reduceCallback1 : reduceCallback0,
    listItem: isListCapablePlan(listPlan)
      ? (itemPlan) => {
          return each(itemPlan as any, ($item) =>
            listPlan.listItem($item as any),
          );
        }
      : undefined,
    namedType,
    meta: `partitionByIndex${startIndex}:${chalk.yellow(listPlan.id)}${
      mapper.name ? `/${mapper.name}` : ""
    }`,
  });
}
