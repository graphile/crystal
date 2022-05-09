import debugFactory from "debug";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import { formatSQLForDebugging } from "./formatSQLForDebugging";

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
} from "./codecs";
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
} from "./codecUtils";
export {
  PgEnumSource,
  PgEnumSourceExtensions,
  PgEnumSourceOptions,
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
} from "./datasource";
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
} from "./executor";
export { BooleanFilterPlan } from "./filters/booleanFilter";
export { ClassFilterPlan } from "./filters/classFilter";
export { ManyFilterPlan } from "./filters/manyFilter";
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
} from "./interfaces";
export { PgSubscriber } from "./PgSubscriber";
export {
  pgClassExpression,
  PgClassExpressionPlan,
} from "./plans/pgClassExpression";
export {
  PgConditionCapableParentPlan,
  PgConditionPlan,
} from "./plans/pgCondition";
export { PgCursorPlan } from "./plans/pgCursor";
export { pgDelete, PgDeletePlan } from "./plans/pgDelete";
export { pgInsert, PgInsertPlan } from "./plans/pgInsert";
export { pgPageInfo, PgPageInfoPlan } from "./plans/pgPageInfo";
export {
  pgPolymorphic,
  PgPolymorphicPlan,
  PgPolymorphicTypeMap,
} from "./plans/pgPolymorphic";
export {
  pgSelect,
  PgSelectArgumentSpec,
  pgSelectFromRecords,
  PgSelectLockableParameter,
  PgSelectLockCallback,
  PgSelectMode,
  PgSelectOptions,
  PgSelectPlan,
  PgSelectIdentifierSpec,
} from "./plans/pgSelect";
export {
  pgSelectSingleFromRecord,
  PgSelectSinglePlan,
  PgSelectSinglePlanOptions,
} from "./plans/pgSelectSingle";
export { PgSetCapableParentPlan, PgSetPlan } from "./plans/pgSet";
export {
  pgSingleTablePolymorphic,
  PgSingleTablePolymorphicPlan,
} from "./plans/pgSingleTablePolymorphic";
export { pgUpdate, PgUpdatePlan } from "./plans/pgUpdate";
export {
  pgValidateParsedCursor,
  PgValidateParsedCursorPlan,
} from "./plans/pgValidateParsedCursor";
export { TempTablePlan } from "./plans/tempTable";
export { toPg, ToPgPlan } from "./plans/toPg";
