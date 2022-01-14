import chalk from "chalk";
import { getNamedType } from "graphql";

import { getGlobalState } from "../global";
import type { ExecutablePlan, ListCapablePlan } from "../plan";
import { isListCapablePlan } from "../plan";
import type { __ItemPlan } from "./__item";
import type { __TransformPlan } from "./transform";
import { transform } from "./transform";

export function each<
  TListPlan extends ExecutablePlan<readonly any[]>,
  TResultItemPlan extends ExecutablePlan<any>,
>(
  listPlan: TListPlan,
  mapper: (
    itemPlan: TListPlan extends ListCapablePlan<any, any>
      ? ReturnType<TListPlan["listItem"]>
      : __ItemPlan<any>,
  ) => TResultItemPlan,
): __TransformPlan<any, any, any, any> {
  const currentGraphQLType = getGlobalState().currentGraphQLType;
  if (!currentGraphQLType) {
    throw new Error("partitionByIndex cannot be used in this position");
  }
  const namedType = getNamedType(currentGraphQLType);
  return transform<any, any, any, any>({
    listPlan,
    itemPlanCallback: (itemPlan) => itemPlan,
    initialState: () => [] as any,
    reduceCallback: (memo, item) => {
      memo.push(item);
      return memo;
    },
    listItem: isListCapablePlan(listPlan)
      ? (itemPlan) => mapper(listPlan.listItem(itemPlan as any) as any)
      : mapper,
    namedType,
    meta: `each:${chalk.yellow(listPlan.id)}${
      mapper.name ? `/${mapper.name}` : ""
    }`,
  });
}
