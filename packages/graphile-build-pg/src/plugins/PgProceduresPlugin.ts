// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import type {
  PgSourceColumns,
  PgSourceExtensions,
  PgSourceParameter,
  PgTypeCodec,
} from "@dataplan/pg";
import { PgSource, recordType } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin, PluginGatherConfig, PluginHook } from "graphile-plugin";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import { version } from "../index";
import type { PgProc } from "../introspection";

interface ComputedColumnDetails {
  source: PgSource<any, any, any, PgSourceParameter[]>;
}
interface ArgumentDetails {
  source: PgSource<any, any, any, PgSourceParameter[]>;
  param: PgSourceParameter;
  index: number;
}

declare global {
  namespace GraphileEngine {
    interface Inflection {
      functionSourceName(
        this: Inflection,
        details: {
          databaseName: string;
          pgProc: PgProc;
        },
      ): string;
      functionRecordReturnCodecName(
        this: Inflection,
        details: {
          databaseName: string;
          pgProc: PgProc;
        },
      ): string;
    }
    interface GraphileBuildGatherOptions {
      /**
       * If true, we'll treat all arguments that don't have arguments as being
       * required.
       */
      pgStrictFunctions?: boolean;
    }
  }
}

declare module "graphile-plugin" {
  interface GatherHelpers {
    pgProcedures: {
      getSource(
        databaseName: string,
        pgProc: PgProc,
      ): Promise<PgSource<any, any, any, any> | null>;
    };
  }

  interface GatherHooks {
    "pgProcedures:PgSource": PluginHook<
      (event: {
        source: PgSource<any, any, any, any>;
        pgProc: PgProc;
        databaseName: string;
      }) => Promise<void>
    >;
  }
}

interface State {
  sourceByPgProcByDatabase: Map<
    string,
    Map<PgProc, Promise<PgSource<any, any, any, any> | null>>
  >;
}
interface Cache {}

export const PgProceduresPlugin: Plugin = {
  name: "PgProceduresPlugin",
  description: "Generates sources for the PostgreSQL procedures it finds",
  version: version,

  inflection: {
    add: {
      functionSourceName(options, { databaseName, pgProc }) {
        const pgNamespace = pgProc.getNamespace()!;
        const schemaPrefix = this._schemaPrefix({ databaseName, pgNamespace });
        return this.camelCase(`${schemaPrefix}${pgProc.proname}`);
      },
      functionRecordReturnCodecName(options, { databaseName, pgProc }) {
        const pgNamespace = pgProc.getNamespace()!;
        const schemaPrefix = this._schemaPrefix({ databaseName, pgNamespace });
        return this.camelCase(`${schemaPrefix}${pgProc.proname}`);
      },
    },
  },

  gather: {
    namespace: "pgProcedures",
    helpers: {
      getSource(info, databaseName, pgProc) {
        let sourceByPgProc =
          info.state.sourceByPgProcByDatabase.get(databaseName);
        if (!sourceByPgProc) {
          sourceByPgProc = new Map();
          info.state.sourceByPgProcByDatabase.set(databaseName, sourceByPgProc);
        }
        let source = sourceByPgProc.get(pgProc);
        if (source) {
          return source;
        }
        source = (async () => {
          const database = info.options.pgDatabases.find(
            (db) => db.name === databaseName,
          )!;
          const schemas = database.schemas;

          const namespace = await info.helpers.pgIntrospection.getNamespace(
            databaseName,
            pgProc.pronamespace,
          );
          if (!namespace) {
            return null;
          }

          if (!schemas.includes(namespace.nspname)) {
            return null;
          }

          /**
           * The types of all the arguments that the function has, including
           * both input, output, inout, variadic and table arguments.
           *
           * @remarks If all arguments are 'in' arguments, proallargtypes will
           * be null and we fall back to proargtypes.  Note: proargnames and
           * proargmodes are both indexed off of proallargtypes, but sometimes
           * that's null so we assume in those cases it's actually indexed off
           * of proargtypes - this may be a small oversight in the Postgres
           * docs.
           */
          const allArgTypes = pgProc.proallargtypes ?? pgProc.proargtypes ?? [];

          /**
           * If there's any OUT, INOUT or TABLE arguments then we'll need to
           * generate a codec for the payload.
           */
          const needsPayloadCodecToBeGenerated = pgProc.proargmodes?.some(
            (m) => m === "o" || m === "b" || m === "t",
          );

          const isRecordReturnType =
            pgProc.prorettype === "2249"; /* OID of the 'record' type */

          if (isRecordReturnType && !needsPayloadCodecToBeGenerated) {
            // We do not support anonymous 'record' return type
            return null;
          }

          const name = info.inflection.functionSourceName({
            databaseName,
            pgProc,
          });
          const identifier = `${databaseName}.${namespace.nspname}.${pgProc.proname}(...)`;
          const makeCodecFromReturn = async (): Promise<PgTypeCodec<
            any,
            any,
            any
          > | null> => {
            // We're building a PgTypeCodec to represent specifically the
            // return type of this function.

            const numberOfArguments = allArgTypes.length ?? 0;
            const columns: PgSourceColumns = {};
            for (let i = 0, l = numberOfArguments; i < l; i++) {
              const argType = allArgTypes[i];
              const argName = pgProc.proargnames?.[i] || `column${i + 1}`;

              // TODO: smart tag should allow changing the modifier
              const typeModifier = undefined;

              // i for IN arguments, o for OUT arguments, b for INOUT arguments,
              // v for VARIADIC arguments, t for TABLE arguments
              const argMode = (pgProc.proargmodes?.[i] ?? "i") as
                | "i"
                | "o"
                | "b"
                | "v"
                | "t";

              if (argMode === "o" || argMode === "b" || argMode === "t") {
                // This argument exists on the record type output
                // NOTE: we treat `OUT foo`, `INOUT foo` and
                // `RETURNS TABLE (foo ...)` as the same.
                const columnCodec =
                  await info.helpers.pgCodecs.getCodecFromType(
                    databaseName,
                    argType,
                    null,
                  );
                if (!columnCodec) {
                  return null;
                }
                columns[argName] = {
                  notNull: false,
                  codec: columnCodec,
                };
              }
            }
            const recordCodecName =
              info.inflection.functionRecordReturnCodecName({
                pgProc,
                databaseName,
              });
            return EXPORTABLE(
              (columns, recordCodecName, recordType, sql) =>
                recordType(
                  recordCodecName,
                  sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
                  columns,
                  {},
                  true,
                ),
              [columns, recordCodecName, recordType, sql],
            );
          };

          const returnCodec = needsPayloadCodecToBeGenerated
            ? await makeCodecFromReturn()
            : await info.helpers.pgCodecs.getCodecFromType(
                databaseName,
                pgProc.prorettype,
              );

          if (!returnCodec) {
            return null;
          }

          const executor =
            info.helpers.pgIntrospection.getExecutorForDatabase(databaseName);
          // TODO: this isn't a sufficiently unique name, it does not allow for overloaded functions

          const parameters: PgSourceParameter[] = [];

          let processedFirstInputArg = false;

          // "v" is for "volatile"; but let's just say anything that's not
          // _i_mmutable or _s_table is volatile
          const isMutation =
            pgProc.provolatile !== "i" && pgProc.provolatile !== "s";

          const extensions: PgSourceExtensions = {
            tags: {
              // TODO
            },
          };

          const numberOfArguments = allArgTypes.length ?? 0;
          const numberOfArgumentsWithDefaults = pgProc.pronargdefaults ?? 0;
          const numberOfRequiredArguments =
            numberOfArguments - numberOfArgumentsWithDefaults;
          const isStrict = pgProc.proisstrict ?? false;
          const isStrictish =
            isStrict || info.options.pgStrictFunctions === true;
          for (let i = 0, l = numberOfArguments; i < l; i++) {
            const argType = allArgTypes[i];
            const argName = pgProc.proargnames?.[i] ?? null;

            // TODO: smart tag should allow changing the modifier
            const typeModifier = undefined;

            // i for IN arguments, o for OUT arguments, b for INOUT arguments,
            // v for VARIADIC arguments, t for TABLE arguments
            const argMode = (pgProc.proargmodes?.[i] ?? "i") as
              | "i"
              | "o"
              | "b"
              | "v"
              | "t";

            if (argMode === "v") {
              // We don't currently support variadic arguments
              return null;
            }

            if (argMode === "i" || argMode === "b") {
              // Generate a parameter for this argument
              const argCodec = await info.helpers.pgCodecs.getCodecFromType(
                databaseName,
                argType,
                typeModifier,
              );
              if (!argCodec) {
                return null;
              }
              let required = i < numberOfRequiredArguments;
              let notNull = isStrictish;
              if (!processedFirstInputArg) {
                processedFirstInputArg = true;
                if (argCodec.columns && !isMutation) {
                  // Computed column!
                  required = true;
                  notNull = true;
                }
              }
              parameters.push({
                name: argName,
                required,
                notNull,
                codec: argCodec,
              });
            }
          }

          const returnsSetof = pgProc.proretset;
          const namespaceName = namespace.nspname;
          const procName = pgProc.proname;

          const sourceCallback = EXPORTABLE(
            (namespaceName, procName, sql) =>
              (...args: SQL[]) =>
                sql`${sql.identifier(namespaceName, procName)}(${
                  args.length > 1
                    ? sql.indent(sql.join(args, ",\n"))
                    : sql.join(args, ", ")
                })`,
            [namespaceName, procName, sql],
          );

          if (
            !returnCodec.isAnonymous &&
            (returnCodec.columns || returnCodec.arrayOfCodec?.columns)
          ) {
            const returnPgType = await info.helpers.pgIntrospection.getType(
              databaseName,
              pgProc.prorettype,
            );
            if (!returnPgType) return null;
            const returnsArray = !!returnCodec.arrayOfCodec;
            const pgType = returnsArray
              ? await info.helpers.pgIntrospection.getType(
                  databaseName,
                  returnPgType.typelem!,
                )
              : returnPgType;
            if (!pgType) return null;
            const pgClass = await info.helpers.pgIntrospection.getClass(
              databaseName,
              pgType.typrelid!,
            );
            if (!pgClass) return null;
            const sourceBuilder = await info.helpers.pgTables.getSourceBuilder(
              databaseName,
              pgClass,
            );
            if (!sourceBuilder) return null;
            const source = await info.helpers.pgTables.getSource(sourceBuilder);
            if (!source) {
              return null;
            }
            return EXPORTABLE(
              (
                extensions,
                identifier,
                isMutation,
                name,
                parameters,
                returnsArray,
                returnsSetof,
                source,
                sourceCallback,
              ) =>
                source.functionSource({
                  name,
                  identifier,
                  source: sourceCallback,
                  parameters,
                  returnsArray,
                  returnsSetof,
                  extensions,
                  isMutation,
                }),
              [
                extensions,
                identifier,
                isMutation,
                name,
                parameters,
                returnsArray,
                returnsSetof,
                source,
                sourceCallback,
              ],
            );
          }

          return EXPORTABLE(
            (
              PgSource,
              executor,
              extensions,
              identifier,
              isMutation,
              name,
              parameters,
              returnCodec,
              returnsSetof,
              sourceCallback,
            ) =>
              new PgSource({
                executor,
                name,
                identifier,
                source: sourceCallback,
                parameters,
                isUnique: !returnsSetof,
                codec: returnCodec,
                uniques: [],
                extensions,
                isMutation,
              }),
            [
              PgSource,
              executor,
              extensions,
              identifier,
              isMutation,
              name,
              parameters,
              returnCodec,
              returnsSetof,
              sourceCallback,
            ],
          );
        })();
        sourceByPgProc.set(pgProc, source!);
        return source;
      },
    },
    initialState: () => ({
      sourceByPgProcByDatabase: new Map(),
    }),
    hooks: {
      async "pgIntrospection:proc"({ helpers }, event) {
        const { entity: pgProc, databaseName } = event;
        helpers.pgProcedures.getSource(databaseName, pgProc);
      },
    },
    async main(output, info) {
      if (!output.pgSources) {
        output.pgSources = [];
      }
      for (const [
        databaseName,
        sourceByPgProc,
      ] of info.state.sourceByPgProcByDatabase.entries()) {
        for (const [pgProc, sourcePromise] of sourceByPgProc.entries()) {
          const source = await sourcePromise;
          if (!source) {
            continue;
          }
          await info.process("pgProcedures:PgSource", {
            source,
            pgProc,
            databaseName,
          });
          output.pgSources!.push(source);
        }
      }
    },
  } as PluginGatherConfig<"pgProcedures", State, Cache>,
};
