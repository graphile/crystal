import type { TableConditionArgs } from "./makeAddPgTableConditionPlugin.ts";
import { addPgTableCondition } from "./makeAddPgTableConditionPlugin.ts";
import type { TableOrderByArgs } from "./makeAddPgTableOrderByPlugin.ts";
import { addPgTableOrderBy } from "./makeAddPgTableOrderByPlugin.ts";
import { changeNullability } from "./makeChangeNullabilityPlugin.ts";
import { extendSchema } from "./makeExtendSchemaPlugin.ts";
import { jsonPgSmartTags, pgSmartTags } from "./makePgSmartTagsPlugin.ts";
import { processSchema } from "./makeProcessSchemaPlugin.ts";
import type {
  PlanWrapperFilter,
  PlanWrapperFilterRule,
  PlanWrapperRules,
  PlanWrapperRulesGenerator,
  WrapPlansOptions,
} from "./makeWrapPlansPlugin.ts";
import { wrapPlans } from "./makeWrapPlansPlugin.ts";
import type { ScopedTableMatch } from "./resolveTableMatch.ts";

export type ScopedUtils<TScope extends keyof GraphileBuild.PluginScopes> =
  Readonly<{
    addPgTableCondition<
      const TMatch extends ScopedTableMatch<TScope>,
      TValue = any,
    >(
      ...args: TableConditionArgs<TScope, TValue, TMatch>
    ): GraphileConfig.Plugin;
    addPgTableOrderBy<const TMatch extends ScopedTableMatch<TScope>>(
      ...args: TableOrderByArgs<TScope, TMatch>
    ): GraphileConfig.Plugin;
    changeNullability: typeof changeNullability<TScope>;
    extendSchema: typeof extendSchema<TScope>;
    jsonPgSmartTags: typeof jsonPgSmartTags<TScope>;
    pgSmartTags: typeof pgSmartTags<TScope>;
    processSchema: typeof processSchema<TScope>;
    wrapPlans: {
      (
        rulesOrGenerator:
          | PlanWrapperRules<TScope>
          | PlanWrapperRulesGenerator<TScope>,
        options?: WrapPlansOptions<TScope>,
      ): GraphileConfig.Plugin;
      <T>(
        filter: PlanWrapperFilter<T, TScope>,
        rule: PlanWrapperFilterRule<T>,
        options?: WrapPlansOptions<TScope>,
      ): GraphileConfig.Plugin;
    };
  }>;

const utils = Object.freeze({
  addPgTableCondition,
  addPgTableOrderBy,
  changeNullability,
  extendSchema,
  jsonPgSmartTags,
  pgSmartTags,
  processSchema,
  wrapPlans,
});

/** Binds the helpers to a generated type scope without changing their behaviour. */
export function scopedUtils<TScope extends keyof GraphileBuild.PluginScopes>(
  _scope: TScope,
): ScopedUtils<TScope> {
  return utils as unknown as ScopedUtils<TScope>;
}
