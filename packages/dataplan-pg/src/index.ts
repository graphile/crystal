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
export { BooleanFilterStep } from "./filters/booleanFilter.js";
export { ClassFilterStep } from "./filters/classFilter.js";
export { ManyFilterStep } from "./filters/manyFilter.js";
export {
  PgClassSingleStep,
  PgDecode,
  PgEncode,
  PgEnumTypeCodec,
  PgGroupSpec,
  PgOrderSpec,
  PgTypeCodec,
  PgTypeCodecExtensions,
  PgTypedExecutableStep,
  PlanByUniques,
  TuplePlanMap,
} from "./interfaces.js";
export { PgSubscriber } from "./PgSubscriber.js";
export {
  pgClassExpression,
  PgClassExpressionStep,
} from "./steps/pgClassExpression.js";
export {
  PgConditionCapableParentStep,
  PgConditionStep,
} from "./steps/pgCondition.js";
export { PgCursorStep } from "./steps/pgCursor.js";
export { pgDelete, PgDeleteStep } from "./steps/pgDelete.js";
export { pgInsert, PgInsertStep } from "./steps/pgInsert.js";
export { pgPageInfo, PgPageInfoStep } from "./steps/pgPageInfo.js";
export {
  pgPolymorphic,
  PgPolymorphicStep,
  PgPolymorphicTypeMap,
} from "./steps/pgPolymorphic.js";
export {
  pgSelect,
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
  pgSelectFromRecords,
  PgSelectIdentifierSpec,
  PgSelectLockableParameter,
  PgSelectLockCallback,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorStep,
  PgSelectStep,
  sqlFromArgDigests,
} from "./steps/pgSelect.js";
export {
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
  PgSelectSinglePlanOptions,
} from "./steps/pgSelectSingle.js";
export {
  pgSingleTablePolymorphic,
  PgSingleTablePolymorphicStep,
} from "./steps/pgSingleTablePolymorphic.js";
export { pgUpdate, PgUpdateStep } from "./steps/pgUpdate.js";
export {
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
} from "./steps/pgValidateParsedCursor.js";
export { TempTableStep } from "./steps/tempTable.js";
export { toPg, ToPgStep } from "./steps/toPg.js";
