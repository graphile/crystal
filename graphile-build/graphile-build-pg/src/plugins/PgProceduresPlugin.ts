// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import type {
  PgFunctionSourceOptions,
  PgSelectArgumentDigest,
  PgSourceExtensions,
  PgSourceOptions,
  PgSourceParameter,
  PgTypeCodec,
  PgTypeColumns,
} from "@dataplan/pg";
import { PgSource, recordType, sqlFromArgDigests } from "@dataplan/pg";
import type { PluginHook } from "graphile-config";
import { EXPORTABLE } from "graphile-export";
import type { PgProc } from "pg-introspection";
import sql from "pg-sql2";

import { version } from "../index.js";
import { addBehaviorToTags } from "../utils.js";

// TODO: these should be used, surely?
interface _ComputedColumnDetails {
  source: PgSource<any, any, any, PgSourceParameter[]>;
}
interface _ArgumentDetails {
  source: PgSource<any, any, any, PgSourceParameter[]>;
  param: PgSourceParameter;
  index: number;
}

declare global {
  namespace GraphileBuild {
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
       * If true, we'll treat all arguments that don't have defaults as being
       * required.
       */
      pgStrictFunctions?: boolean;
    }
  }
}

declare module "@dataplan/pg" {
  interface PgTypeColumnExtensions {
    argIndex?: number;
    argName?: string;
  }
}

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgProcedures: {
        getSource(
          databaseName: string,
          pgProc: PgProc,
        ): Promise<PgSource<any, any, any, any> | null>;
      };
    }

    interface GatherHooks {
      pgProcedures_PgSource: PluginHook<
        (event: {
          source: PgSource<any, any, any, any>;
          pgProc: PgProc;
          databaseName: string;
        }) => void | Promise<void>
      >;

      // TODO: should pgProcedures_functionSource_options and pgProcedures_PgSource_options be the same hook?
      pgProcedures_functionSource_options: PluginHook<
        (event: {
          databaseName: string;
          pgProc: PgProc;
          options: PgFunctionSourceOptions<any, any, any>;
        }) => void | Promise<void>
      >;

      pgProcedures_PgSource_options: PluginHook<
        (event: {
          databaseName: string;
          pgProc: PgProc;
          options: PgSourceOptions<any, any, any, any>;
        }) => void | Promise<void>
      >;
    }
  }
}

interface State {
  sourceByPgProcByDatabase: Map<
    string,
    Map<PgProc, Promise<PgSource<any, any, any, any> | null>>
  >;
}
interface Cache {}

export const PgProceduresPlugin: GraphileConfig.Plugin = {
  name: "PgProceduresPlugin",
  description:
    "Generates @dataplan/pg sources for the PostgreSQL functions/procedures it finds",
  version: version,

  inflection: {
    add: {
      functionSourceName(options, { databaseName, pgProc }) {
        const { tags } = pgProc.getTagsAndDescription();
        if (typeof tags.name === "string") {
          return tags.name;
        }
        const pgNamespace = pgProc.getNamespace()!;
        const schemaPrefix = this._schemaPrefix({ databaseName, pgNamespace });
        return `${schemaPrefix}${pgProc.proname}`;
      },
      functionRecordReturnCodecName(options, details) {
        return this.upperCamelCase(
          this.functionSourceName(details) + "-record",
        );
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
          const database = info.resolvedPreset.pgSources?.find(
            (db) => db.name === databaseName,
          );
          if (!database) {
            throw new Error(
              `Could not find database '${databaseName}' in pgSources`,
            );
          }
          const schemas = database.schemas ?? ["public"];

          const namespace = pgProc.getNamespace();
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
           * If there's two or more OUT or inout arguments INOUT, or any TABLE
           * arguments then we'll need to generate a codec for the payload.
           */
          const outOrInoutOrTableArgModes =
            pgProc.proargmodes?.filter(
              (m) => m === "o" || m === "b" || m === "t",
            ) ?? [];
          const isRecordReturnType =
            pgProc.prorettype === "2249"; /* OID of the 'record' type */
          const needsPayloadCodecToBeGenerated =
            outOrInoutOrTableArgModes.length > 1;

          const debugProcName = `${namespace.nspname}.${pgProc.proname}`;

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
            const columns: PgTypeColumns = {};
            for (let i = 0, l = numberOfArguments; i < l; i++) {
              const argType = allArgTypes[i];
              const trueArgName = pgProc.proargnames?.[i];
              const argName = trueArgName || `column${i + 1}`;

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
                    typeModifier,
                  );
                if (!columnCodec) {
                  console.warn(
                    `Could not make codec for '${debugProcName}' argument '${argName}' which has type ${argType} (${
                      (await info.helpers.pgIntrospection.getType(
                        databaseName,
                        argType,
                      ))!.typname
                    }); skipping function`,
                  );
                  return null;
                }
                columns[argName] = {
                  notNull: false,
                  codec: columnCodec,
                  extensions: {
                    argIndex: i,
                    argName: trueArgName,
                  },
                  // TODO: could use "param" smart tag in function to add extensions here?
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
                  {
                    description: undefined,
                    // TODO: we should figure out what field this is going to use, and reference that
                    /* `The return type of our \`${name}\` ${
                      pgProc.provolatile === "v" ? "mutation" : "query"
                    }.`, */
                  },
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
            console.warn(
              `Could not make return codec for '${debugProcName}'; skipping function`,
            );
            return null;
          }

          const executor =
            info.helpers.pgIntrospection.getExecutorForDatabase(databaseName);
          // TODO: this isn't a sufficiently unique name, it does not allow for overloaded functions

          const parameters: PgSourceParameter[] = [];

          // const processedFirstInputArg = false;

          // "v" is for "volatile"; but let's just say anything that's not
          // _i_mmutable or _s_table is volatile
          const isMutation =
            pgProc.provolatile !== "i" && pgProc.provolatile !== "s";

          const numberOfArguments = allArgTypes.length ?? 0;
          const numberOfArgumentsWithDefaults = pgProc.pronargdefaults ?? 0;
          const isStrict = pgProc.proisstrict ?? false;
          const isStrictish =
            isStrict || info.options.pgStrictFunctions === true;
          const numberOfRequiredArguments =
            numberOfArguments - numberOfArgumentsWithDefaults;
          const { tags: rawTags, description } = pgProc.getTagsAndDescription();
          for (let i = 0, l = numberOfArguments; i < l; i++) {
            const argType = allArgTypes[i];
            const argName = pgProc.proargnames?.[i] ?? null;

            // TODO: smart tag should allow changing the modifier
            const tag = rawTags[`arg${i}variant`];
            const variant = typeof tag === "string" ? tag : undefined;

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
                undefined,
              );
              if (!argCodec) {
                console.warn(
                  `Could not make codec for '${debugProcName}' argument '${argName}' which has type ${argType} (${
                    (await info.helpers.pgIntrospection.getType(
                      databaseName,
                      argType,
                    ))!.typname
                  }); skipping function`,
                );
                return null;
              }
              const required = i < numberOfRequiredArguments;
              const notNull =
                isStrict || (isStrictish && i < numberOfRequiredArguments);
              /*
              if (!processedFirstInputArg) {
                processedFirstInputArg = true;
                if (argCodec.columns && !isMutation) {
                  // Computed column!
                  required = true;
                  notNull = true;
                }
              }
              */
              parameters.push({
                name: argName,
                required,
                notNull,
                codec: argCodec,
                extensions: {
                  variant,
                },
              });
            }
          }

          const returnsSetof = pgProc.proretset;
          const namespaceName = namespace.nspname;
          const procName = pgProc.proname;

          const sourceCallback = EXPORTABLE(
            (namespaceName, procName, sql, sqlFromArgDigests) =>
              (...args: PgSelectArgumentDigest[]) =>
                sql`${sql.identifier(
                  namespaceName,
                  procName,
                )}(${sqlFromArgDigests(args)})`,
            [namespaceName, procName, sql, sqlFromArgDigests],
          );

          const tags = { ...rawTags };

          addBehaviorToTags(tags, "-filter -order", true);

          const extensions: PgSourceExtensions = {
            tags: {
              ...tags,
            },
          };

          if (outOrInoutOrTableArgModes.length === 1) {
            const outOrInoutArg = (() => {
              for (let i = 0, l = numberOfArguments; i < l; i++) {
                const trueArgName = pgProc.proargnames?.[i];
                const argMode = pgProc.proargmodes?.[i] ?? "i";
                if (argMode === "b" || argMode === "o" || argMode === "t") {
                  return trueArgName;
                }
              }
            })();
            if (outOrInoutArg) {
              extensions.singleOutputParameterName = outOrInoutArg;
            }
          }

          if (
            !returnCodec.isAnonymous &&
            (returnCodec.columns || returnCodec.arrayOfCodec?.columns)
          ) {
            const returnPgType = await info.helpers.pgIntrospection.getType(
              databaseName,
              pgProc.prorettype,
            );
            if (!returnPgType) {
              console.log(`Failed to get returnPgType for '${debugProcName}'`);
              return null;
            }
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

            const source = await (async () => {
              if (sourceBuilder) {
                return await info.helpers.pgTables.getSource(sourceBuilder);
              } else {
                // No sourceBuilder for this; presumably the table is not exposed. Create one for the codec instead.
                const codec = await info.helpers.pgCodecs.getCodecFromClass(
                  databaseName,
                  pgClass._id,
                );
                if (!codec) {
                  return null;
                }
                const executor =
                  info.helpers.pgIntrospection.getExecutorForDatabase(
                    databaseName,
                  );
                return PgSource.fromCodec(executor, codec);
              }
            })();

            if (!source) {
              return null;
            }

            const options: PgFunctionSourceOptions<any, any, any> = {
              name,
              identifier,
              source: sourceCallback,
              parameters,
              returnsArray,
              returnsSetof,
              isMutation,
              extensions,
              description,
            };

            await info.process("pgProcedures_functionSource_options", {
              databaseName,
              pgProc,
              options,
            });

            return EXPORTABLE(
              (options, source) => source.functionSource(options),
              [options, source],
            );
          } else {
            const options: PgSourceOptions<any, any, any, any> = {
              executor,
              name,
              identifier,
              source: sourceCallback,
              parameters,
              isUnique: !returnsSetof,
              codec: returnCodec,
              uniques: [],
              isMutation,
              extensions,
              description,
            };
            await info.process("pgProcedures_PgSource_options", {
              databaseName,
              pgProc,
              options,
            });

            return EXPORTABLE(
              (PgSource, options) => new PgSource(options),
              [PgSource, options],
            );
          }
        })();
        sourceByPgProc.set(pgProc, source!);
        return source;
      },
    },
    initialState: () => ({
      sourceByPgProcByDatabase: new Map(),
    }),
    hooks: {
      async pgIntrospection_proc({ helpers, resolvedPreset }, event) {
        const { entity: pgProc, databaseName } = event;

        const database = resolvedPreset.pgSources?.find(
          (db) => db.name === databaseName,
        );
        if (!database) {
          throw new Error(`Could not find '${databaseName}' in 'pgSources'`);
        }
        const schemas = database.schemas ?? ["public"];

        // Only process procedures from one of the published namespaces
        const namespace = pgProc.getNamespace();
        if (!namespace || !schemas.includes(namespace.nspname)) {
          return null;
        }

        // Do not select procedures that create range types. These are utility
        // functions that really don’t need to be exposed in an API.
        const introspection = (
          await helpers.pgIntrospection.getIntrospection()
        ).find((n) => n.database.name === databaseName)!.introspection;
        const rangeType = introspection.types.find(
          (t) =>
            t.typnamespace === pgProc.pronamespace &&
            t.typname === pgProc.proname &&
            t.typtype === "r",
        );
        if (rangeType) {
          return;
        }

        // Do not expose trigger functions (type trigger has oid 2279)
        if (pgProc.prorettype === "2279") {
          return;
        }

        // We don't want functions that will clash with GraphQL (treat them as private)
        if (pgProc.proname.startsWith("__")) {
          return;
        }

        // We also don’t want procedures that have been defined in our namespace
        // twice. This leads to duplicate fields in the API which throws an
        // error. In the future we may support this case. For now though, it is
        // too complex.
        const overload = introspection.procs.find(
          (p) =>
            p.pronamespace === pgProc.pronamespace &&
            p.proname === pgProc.proname &&
            p._id !== pgProc._id,
        );
        if (overload) {
          return;
        }

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
          await info.process("pgProcedures_PgSource", {
            source,
            pgProc,
            databaseName,
          });
          output.pgSources!.push(source);
        }
      }
    },
  } as GraphileConfig.PluginGatherConfig<"pgProcedures", State, Cache>,
};
