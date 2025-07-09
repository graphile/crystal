import { sqlValueWithCodec } from "@dataplan/pg";
import type { GrafastInputFieldConfig } from "grafast";
import type { SQL, sql } from "pg-sql2";
export declare function makeAddPgTableConditionPlugin(match: {
    serviceName?: string;
    schemaName: string;
    tableName: string;
}, conditionFieldName: string, conditionFieldSpecGenerator: (build: GraphileBuild.Build) => GrafastInputFieldConfig, conditionGenerator?: (value: unknown, helpers: {
    sql: typeof sql;
    sqlTableAlias: SQL;
    sqlValueWithCodec: typeof sqlValueWithCodec;
    build: GraphileBuild.Build;
}) => SQL | null | undefined): GraphileConfig.Plugin;
//# sourceMappingURL=makeAddPgTableConditionPlugin.d.ts.map