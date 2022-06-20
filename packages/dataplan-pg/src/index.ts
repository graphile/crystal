import debugFactory from "debug";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import { formatSQLForDebugging } from "./formatSQLForDebugging.js";

function sqlPrint(fragment: SQL): string {
  const { text } = sql.compile(fragment);
  return formatSQLForDebugging(text);
}

// TODO: polluting the global 'debug' namespace might be a bad idea...
// Registers the '%S' SQL formatter with the 'debug' module.
debugFactory.formatters.S = sqlPrint;

export {
  domainOfCodec,
  enumType,
  getCodecByPgCatalogTypeName,
  isEnumCodec,
  listOfType,
  PgTypeColumn,
  PgTypeColumnExtensions,
  PgTypeColumns,
  PgTypeColumnVia,
  PgTypeColumnViaExplicit,
  rangeOfCodec,
  recordType,
  TYPES,
} from "./codecs.js";
export {
  PgBox,
  PgCircle,
  PgHStore,
  PgInterval,
  PgLine,
  PgLseg,
  PgPath,
  PgPoint,
  PgPolygon,
} from "./codecUtils/index.js";
export {
  PgEnumSource,
  PgEnumSourceExtensions,
  PgEnumSourceOptions,
  PgFunctionSourceOptions,
  PgSource,
  PgSourceBuilder,
  PgSourceExtensions,
  PgSourceOptions,
  PgSourceParameter,
  PgSourceRelation,
  PgSourceRelationExtensions,
  PgSourceRow,
  PgSourceRowAttribute,
  PgSourceUnique,
  PgSourceUniqueExtensions,
} from "./datasource.js";
export {
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgExecutor,
  PgExecutorContext,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
  WithPgClient,
} from "./executor.js";
export { BooleanFilterPlan } from "./filters/booleanFilter.js";
export { ClassFilterPlan } from "./filters/classFilter.js";
export { ManyFilterPlan } from "./filters/manyFilter.js";
export {
  PgClassSinglePlan,
  PgDecode,
  PgEncode,
  PgEnumTypeCodec,
  PgGroupSpec,
  PgOrderSpec,
  PgTypeCodec,
  PgTypeCodecExtensions,
  PgTypedExecutablePlan,
  PlanByUniques,
  TuplePlanMap,
} from "./interfaces.js";
export { PgSubscriber } from "./PgSubscriber.js";
export {
  pgClassExpression,
  PgClassExpressionPlan,
} from "./plans/pgClassExpression.js";
export {
  PgConditionCapableParentPlan,
  PgConditionPlan,
} from "./plans/pgCondition.js";
export { PgCursorPlan } from "./plans/pgCursor.js";
export { pgDelete, PgDeletePlan } from "./plans/pgDelete.js";
export { pgInsert, PgInsertPlan } from "./plans/pgInsert.js";
export { pgPageInfo, PgPageInfoPlan } from "./plans/pgPageInfo.js";
export {
  pgPolymorphic,
  PgPolymorphicPlan,
  PgPolymorphicTypeMap,
} from "./plans/pgPolymorphic.js";
export {
  pgSelect,
  PgSelectArgumentSpec,
  pgSelectFromRecords,
  PgSelectIdentifierSpec,
  PgSelectLockableParameter,
  PgSelectLockCallback,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorPlan,
  PgSelectPlan,
} from "./plans/pgSelect.js";
export {
  pgSelectSingleFromRecord,
  PgSelectSinglePlan,
  PgSelectSinglePlanOptions,
} from "./plans/pgSelectSingle.js";
export {
  pgSingleTablePolymorphic,
  PgSingleTablePolymorphicPlan,
} from "./plans/pgSingleTablePolymorphic.js";
export { pgUpdate, PgUpdatePlan } from "./plans/pgUpdate.js";
export {
  pgValidateParsedCursor,
  PgValidateParsedCursorPlan,
} from "./plans/pgValidateParsedCursor.js";
export { TempTablePlan } from "./plans/tempTable.js";
export { toPg, ToPgPlan } from "./plans/toPg.js";
