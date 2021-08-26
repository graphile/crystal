import debugFactory from "debug";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import { formatSQLForDebugging } from "./formatSQLForDebugging";

function sqlPrint(fragment: SQL): string {
  const { text } = sql.compile(fragment);
  return formatSQLForDebugging(text);
}

debugFactory.formatters.S = sqlPrint;

export { recordType, TYPES } from "./codecs";
export { PgSource, PgSourceColumn } from "./datasource";
export { PgExecutor, PgExecutorContext, WithPgClient } from "./executor";
export { PgTypeCodec } from "./interfaces";
export {
  pgClassExpression,
  PgClassExpressionPlan,
} from "./plans/pgClassExpression";
export {
  PgConditionCapableParentPlan,
  PgConditionPlan,
} from "./plans/pgCondition";
export { PgConnectionPlan } from "./plans/pgConnection";
export { pgSelect, PgSelectPlan } from "./plans/pgSelect";
export { PgSelectSinglePlan } from "./plans/pgSelectSingle";
export {
  pgSingleTableInterface,
  PgSingleTableInterfacePlan,
} from "./plans/pgSingleTableInterface";
