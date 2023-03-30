import type {
  PgCodecRefPath,
  PgCodecRelationConfig,
  PgRefDefinition,
  PgRefDefinitions,
  PgResource,
  PgResourceOptions,
  PgTypeCodecAny,
  PgTypeCodecExtensions,
  PgTypeCodecWithColumns,
} from "@dataplan/pg";
import { arraysMatch } from "grafast";
import type { PgClass } from "pg-introspection";

import {
  parseDatabaseIdentifierFromSmartTag,
  parseSmartTagsOptsString,
} from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgRefs: Record<string, never>;
    }
  }
  namespace GraphileBuild {
    interface Inflection {
      refSingle(
        this: Inflection,
        details: { refDefinition: PgRefDefinition; identifier: string },
      ): string;
      refList(
        this: Inflection,
        details: { refDefinition: PgRefDefinition; identifier: string },
      ): string;
      refConnection(
        this: Inflection,
        details: { refDefinition: PgRefDefinition; identifier: string },
      ): string;
    }
  }
}

declare module "@dataplan/pg" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PgTypeCodecExtensions {
    /**
     * References between codecs (cannot be implemented directly, but sources
     * may implement them).
     */
    refDefinitions?: PgRefDefinitions;
  }

  interface PgRefDefinitionExtensions {
    /** @experimental Need to define its own TypeScript type. */
    tags?: {
      behavior?: string | string[];
    };
    via?: string;
  }
}

interface State {
  sourceEvents: Array<{
    databaseName: string;
    pgClass: PgClass;
    source: PgResource<any, any, any, undefined, any>;
    relations: GraphileConfig.PgTablesPluginSourceRelations;
  }>;
}
interface Cache {}

export const PgRefsPlugin: GraphileConfig.Plugin = {
  name: "PgRefsPlugin",
  description:
    "Looks for `@ref` and `@refVia` smart tags and registers the given refs",
  version: version,
  after: ["smart-tags", "PgRelationsPlugin"],

  inflection: {
    add: {
      refSingle(stuff, { refDefinition, identifier }) {
        return (
          refDefinition.singleRecordFieldName ?? this.singularize(identifier)
        );
      },
      refList(stuff, { refDefinition, identifier }) {
        return (
          refDefinition.listFieldName ??
          this.listField(this.pluralize(this.singularize(identifier)))
        );
      },
      refConnection(stuff, { refDefinition, identifier }) {
        return (
          refDefinition.connectionFieldName ??
          this.connectionField(this.pluralize(this.singularize(identifier)))
        );
      },
    },
  },

  gather: {
    namespace: "pgRefs",
    helpers: {},
    initialState: () => ({ sourceEvents: [] }),
    hooks: {
      async pgCodecs_PgTypeCodec(info, event) {
        const { pgCodec, pgClass } = event;
        if (!pgClass) {
          return;
        }

        const { tags } = pgClass.getTagsAndDescription();

        const rawRefs = Array.isArray(tags.ref)
          ? tags.ref
          : tags.ref
          ? [tags.ref]
          : null;

        if (!rawRefs) {
          return;
        }

        const refs = rawRefs.map((ref) => parseSmartTagsOptsString(ref, 1));
        const extensions: Partial<PgTypeCodecExtensions> =
          pgCodec.extensions ?? Object.create(null);
        pgCodec.extensions = extensions;
        const refDefinitions: PgRefDefinitions =
          extensions.refDefinitions ?? Object.create(null);
        extensions.refDefinitions = refDefinitions;

        for (const ref of refs) {
          const {
            args: [name],
            params: {
              to,
              plural: rawPlural,
              singular: rawSingular,
              via: rawVia,
              behavior,
            },
          } = ref;
          const singular = rawSingular != null;
          if (singular && rawPlural != null) {
            throw new Error(
              `Both singular and plural were set on ref '${name}'; this isn't valid`,
            );
          }

          if (refDefinitions[name]) {
            throw new Error(
              `@ref ${name} already registered in ${pgCodec.name}`,
            );
          }
          refDefinitions[name] = {
            singular,
            graphqlType: to,
            extensions: {
              via: rawVia,
              tags: {
                behavior,
              },
            },
          };
        }
      },
      async pgTables_PgResourceOptions_relations_post(info, event) {
        const { databaseName, sourceOptions, pgClass } = event;

        const getCodecForTableName = async (targetTableIdentifier: string) => {
          const nsp = pgClass.getNamespace();
          if (!nsp) {
            throw new Error(
              `Couldn't determine namespace for '${pgClass.relname}'`,
            );
          }
          const [targetSchemaName, targetTableName] =
            parseDatabaseIdentifierFromSmartTag(
              targetTableIdentifier,
              2,
              nsp.nspname,
            );
          const targetPgClass =
            await info.helpers.pgIntrospection.getClassByName(
              databaseName,
              targetSchemaName,
              targetTableName,
            );
          if (!targetPgClass) {
            return null;
          }
          const targetCodec = await info.helpers.pgCodecs.getCodecFromClass(
            databaseName,
            targetPgClass._id,
          );
          return targetCodec;
        };

        const { tags } = pgClass.getTagsAndDescription();

        const rawRefVias = Array.isArray(tags.refVia)
          ? tags.refVia
          : tags.refVia
          ? [tags.refVia]
          : null;

        const refDefinitions = (sourceOptions.codec as PgTypeCodecAny)
          .extensions?.refDefinitions;
        if (!refDefinitions) {
          if (rawRefVias) {
            throw new Error(`@refVia without matching @ref is invalid`);
          }
          return;
        }

        const refVias =
          rawRefVias?.map((refVia) => parseSmartTagsOptsString(refVia, 1)) ??
          [];

        for (const [refName, refDefinition] of Object.entries(refDefinitions)) {
          const relevantVias = refVias.filter((v) => v.args[0] === refName);
          const relevantViaStrings = relevantVias
            .map((v) => v.params.via)
            .filter((via): via is string => {
              if (!via) {
                console.warn(
                  `Invalid '@refVia' detected on '${
                    pgClass.getNamespace()!.nspname
                  }.${pgClass.relname}'; no 'via:' parameter.`,
                );
                return false;
              } else {
                return true;
              }
            });
          const rawVia = refDefinition.extensions?.via;
          const vias = [...(rawVia ? [rawVia] : []), ...relevantViaStrings];

          const paths: PgCodecRefPath[] = [];

          if (vias.length === 0) {
            if (!tags.interface) {
              console.warn(
                `@ref ${refName} has no valid 'via' on ${sourceOptions.name}`,
              );
              continue;
            }
          }

          const registryBuilder =
            await info.helpers.pgBasics.getRegistryBuilder();
          const registryConfig = registryBuilder.getRegistryConfig();

          outerLoop: for (const via of vias) {
            const path: PgCodecRefPath = [];
            const parts = via.split(";");
            let currentSourceOptions: PgResourceOptions<any, any, any, any> =
              sourceOptions;
            for (const rawPart of parts) {
              type RelationEntry = [
                string,
                PgCodecRelationConfig<
                  PgTypeCodecWithColumns,
                  PgResourceOptions<any, any, any, any>
                >,
              ];
              const relationEntries = Object.entries(
                registryConfig.pgRelations[currentSourceOptions.codec.name],
              ) as Array<RelationEntry>;
              const part = rawPart.trim();
              // TODO: allow whitespace
              const matches = part.match(
                /^\(([^)]+)\)->([^)]+)(?:\(([^)]+)\))?$/,
              );

              let relationEntry: RelationEntry | undefined;
              if (matches) {
                const [
                  ,
                  rawLocalCols,
                  targetTableIdentifier,
                  maybeRawTargetCols,
                ] = matches;

                // TODO: use proper identifier parsing here!
                const localColumns = rawLocalCols
                  .split(",")
                  .map((t) => t.trim());
                const maybeTargetColumns = maybeRawTargetCols
                  ? // TODO: use proper identifier parsing here!
                    maybeRawTargetCols.split(",").map((t) => t.trim())
                  : null;

                const targetCodec = await getCodecForTableName(
                  targetTableIdentifier,
                );
                if (!targetCodec) {
                  console.error(
                    `Ref ${refName} has bad via '${via}' which references table '${targetTableIdentifier}' which we either cannot find, or have not generated a source for. Please be sure to indicate the schema if required.`,
                  );
                  continue outerLoop;
                }

                relationEntry = relationEntries.find(([, rel]) => {
                  if (rel.remoteSourceOptions.codec !== targetCodec) {
                    return false;
                  }
                  if (!arraysMatch(rel.localColumns, localColumns)) {
                    return false;
                  }
                  if (maybeTargetColumns) {
                    if (!arraysMatch(rel.remoteColumns, maybeTargetColumns)) {
                      return false;
                    }
                  }
                  return true;
                });
              } else {
                const targetTableIdentifier = part;
                const targetCodec = await getCodecForTableName(
                  targetTableIdentifier,
                );
                if (!targetCodec) {
                  console.error(
                    `Ref ${refName} has bad via '${via}' which references table '${targetTableIdentifier}' which we either cannot find, or have not generated a source for. Please be sure to indicate the schema if required.`,
                  );
                  continue outerLoop;
                }
                relationEntry = relationEntries.find(([, rel]) => {
                  return rel.remoteSourceOptions.name === targetCodec.name;
                });
              }
              if (relationEntry) {
                path.push({
                  relationName: relationEntry[0],
                });
                const nextSource = relationEntry[1].remoteSourceOptions;
                currentSourceOptions = nextSource;
              } else {
                console.warn(
                  `Could not find matching relation for '${via}' / ${currentSourceOptions.name} -> '${rawPart}'`,
                );
                continue outerLoop;
              }
            }
            paths.push(path);
          }

          if (!sourceOptions.codec.refs) {
            sourceOptions.codec.refs = Object.create(null) as Record<
              string,
              any
            >;
          }
          if (sourceOptions.codec.refs[refName]) {
            throw new Error(
              `@ref ${refName} already registered in ${sourceOptions.codec.name}`,
            );
          }
          sourceOptions.codec.refs[refName] = {
            definition: refDefinition,
            paths,
          };
        }
      },
    },
  } as GraphileConfig.PluginGatherConfig<"pgRefs", State, Cache>,
};
