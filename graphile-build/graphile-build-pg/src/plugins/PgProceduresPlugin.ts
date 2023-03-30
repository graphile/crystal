// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import type {
  PgCodec,
  PgFunctionResourceOptions,
  PgResourceExtensions,
  PgResourceOptions,
  PgResourceParameter,
  PgSelectArgumentDigest,
  PgTypeColumns,
} from "@dataplan/pg";
import {
  makePgResourceOptions,
  PgResource,
  recordCodec,
  sqlFromArgDigests,
} from "@dataplan/pg";
import type { PluginHook } from "graphile-config";
import { EXPORTABLE } from "graphile-export";
import type { PgProc } from "pg-introspection";
import sql from "pg-sql2";

import { addBehaviorToTags } from "../utils.js";
import { version } from "../version.js";

// TODO: these should be used, surely?
interface _ComputedColumnDetails {
  resource: PgResource<
    any,
    any,
    any,
    readonly PgResourceParameter<any, any>[],
    any
  >;
}
interface _ArgumentDetails {
  resource: PgResource<
    any,
    any,
    any,
    readonly PgResourceParameter<any, any>[],
    any
  >;
  param: PgResourceParameter<any, any>;
  index: number;
}

declare global {
  namespace GraphileBuild {
    interface Inflection {
      functionResourceName(
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
    interface GatherOptions {
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
        getResourceOptions(
          databaseName: string,
          pgProc: PgProc,
        ): Promise<PgResourceOptions<any, any, any, any> | null>;
      };
    }

    interface GatherHooks {
      pgProcedures_functionResourceOptions: PluginHook<
        (event: {
          databaseName: string;
          pgProc: PgProc;
          baseResourceOptions: PgResourceOptions<any, any, any, any>;
          functionResourceOptions: PgFunctionResourceOptions<
            any,
            any,
            any,
            any
          >;
        }) => void | Promise<void>
      >;

      pgProcedures_PgResourceOptions: PluginHook<
        (event: {
          databaseName: string;
          pgProc: PgProc;
          resourceOptions: PgResourceOptions<any, any, any, any>;
        }) => void | Promise<void>
      >;
    }
  }
}

interface State {
  resourceOptionsByPgProcByDatabase: Map<
    string,
    Map<PgProc, Promise<PgResourceOptions<any, any, any, any> | null>>
  >;
}
interface Cache {}

export const PgProceduresPlugin: GraphileConfig.Plugin = {
  name: "PgProceduresPlugin",
  description:
    "Generates @dataplan/pg resources for the PostgreSQL functions/procedures it finds",
  version: version,

  inflection: {
    add: {
      functionResourceName(options, { databaseName, pgProc }) {
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
          this.functionResourceName(details) + "-record",
        );
      },
    },
  },

  gather: {
    namespace: "pgProcedures",
    helpers: {
      async getResourceOptions(info, databaseName, pgProc) {
        let resourceOptionsByPgProc =
          info.state.resourceOptionsByPgProcByDatabase.get(databaseName);
        if (!resourceOptionsByPgProc) {
          resourceOptionsByPgProc = new Map();
          info.state.resourceOptionsByPgProcByDatabase.set(
            databaseName,
            resourceOptionsByPgProc,
          );
        }
        let resourceOptionsPromise = resourceOptionsByPgProc.get(pgProc);
        if (resourceOptionsPromise) {
          return resourceOptionsPromise;
        }
        resourceOptionsPromise = (async () => {
          const pgConfig = info.resolvedPreset.pgConfigs?.find(
            (db) => db.name === databaseName,
          );
          if (!pgConfig) {
            throw new Error(
              `Could not find pgConfig '${databaseName}' in pgConfigs`,
            );
          }
          const schemas = pgConfig.schemas ?? ["public"];

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

          const name = info.inflection.functionResourceName({
            databaseName,
            pgProc,
          });
          const identifier = `${databaseName}.${namespace.nspname}.${pgProc.proname}(...)`;
          const makeCodecFromReturn = async (): Promise<PgCodec<
            any,
            any,
            any,
            any,
            any,
            any,
            any
          > | null> => {
            // We're building a PgCodec to represent specifically the
            // return type of this function.

            const numberOfArguments = allArgTypes.length ?? 0;
            const columns: PgTypeColumns = Object.create(null);
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
              (columns, recordCodec, recordCodecName, sql) =>
                recordCodec({
                  name: recordCodecName,
                  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
                  columns,
                  extensions: {
                    description: undefined,
                    // TODO: we should figure out what field this is going to use, and reference that
                    /* `The return type of our \`${name}\` ${
                      pgProc.provolatile === "v" ? "mutation" : "query"
                    }.`, */
                  },
                  isAnonymous: true,
                }),
              [columns, recordCodec, recordCodecName, sql],
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

          const parameters: PgResourceParameter<any, any>[] = [];

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
          const tags = JSON.parse(JSON.stringify(rawTags));
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

          addBehaviorToTags(tags, "-filter -order", true);

          const extensions: PgResourceExtensions = {
            tags,
            description,
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
            const resourceOptions =
              await info.helpers.pgTables.getResourceOptions(
                databaseName,
                pgClass,
              );

            const resourceConfig = await (async () => {
              if (resourceOptions) {
                return resourceOptions;
              } else {
                // No resourceOptions for this; presumably the table is not exposed. Create one for the codec instead.
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
                return PgResource.configFromCodec(executor, codec);
              }
            })();

            if (!resourceConfig) {
              return null;
            }

            const options: PgFunctionResourceOptions<any, any, any, any> = {
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

            await info.process("pgProcedures_functionResourceOptions", {
              databaseName,
              pgProc,
              baseResourceOptions: resourceConfig,
              functionResourceOptions: options,
            });

            const finalResourceOptions = EXPORTABLE(
              (PgResource, options, resourceConfig) =>
                PgResource.functionResourceOptions(resourceConfig, options),
              [PgResource, options, resourceConfig],
            );

            await info.process("pgProcedures_PgResourceOptions", {
              databaseName,
              pgProc,
              resourceOptions: finalResourceOptions,
            });

            return EXPORTABLE(
              (finalResourceOptions, makePgResourceOptions) =>
                makePgResourceOptions(finalResourceOptions),
              [finalResourceOptions, makePgResourceOptions],
            );
          } else {
            const options: PgResourceOptions<any, any, any, any> = {
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

            await info.process("pgProcedures_PgResourceOptions", {
              databaseName,
              pgProc,
              resourceOptions: options,
            });

            return EXPORTABLE(
              (makePgResourceOptions, options) =>
                makePgResourceOptions(options),
              [makePgResourceOptions, options],
            );
          }
        })().then((resourceOptions) => {
          if (resourceOptions) {
            registryBuilder.addResource(resourceOptions);
          }
          return resourceOptions;
        });

        resourceOptionsByPgProc.set(pgProc, resourceOptionsPromise!);

        const registryBuilder =
          await info.helpers.pgBasics.getRegistryBuilder();

        return resourceOptionsPromise;
      },
    },
    initialState: () => ({
      resourceOptionsByPgProcByDatabase: new Map(),
    }),
    hooks: {
      async pgIntrospection_proc({ helpers, resolvedPreset }, event) {
        const { entity: pgProc, databaseName } = event;

        const pgConfig = resolvedPreset.pgConfigs?.find(
          (db) => db.name === databaseName,
        );
        if (!pgConfig) {
          throw new Error(`Could not find '${databaseName}' in 'pgConfigs'`);
        }
        const schemas = pgConfig.schemas ?? ["public"];

        // Only process procedures from one of the published namespaces
        const namespace = pgProc.getNamespace();
        if (!namespace || !schemas.includes(namespace.nspname)) {
          return null;
        }

        // Do not select procedures that create range types. These are utility
        // functions that really don’t need to be exposed in an API.
        const introspection = (
          await helpers.pgIntrospection.getIntrospection()
        ).find((n) => n.pgConfig.name === databaseName)!.introspection;
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

        helpers.pgProcedures.getResourceOptions(databaseName, pgProc);
      },
    },
  } as GraphileConfig.PluginGatherConfig<"pgProcedures", State, Cache>,
};
