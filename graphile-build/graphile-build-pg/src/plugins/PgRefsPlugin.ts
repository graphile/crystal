import type {
  PgCodec,
  PgCodecExtensions,
  PgCodecRefPath,
  PgCodecRelationConfig,
  PgCodecWithAttributes,
  PgRefDefinition,
  PgRefDefinitions,
  PgResourceOptions,
} from "@dataplan/pg";
import { arraysMatch } from "grafast";
import { gatherConfig } from "graphile-build";

import {
  parseDatabaseIdentifierFromSmartTag,
  parseDatabaseIdentifiers,
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

  namespace DataplanPg {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface PgCodecExtensions {
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
}

const EMPTY_OBJECT = Object.freeze({});

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

  gather: gatherConfig({
    namespace: "pgRefs",
    initialCache() {
      return EMPTY_OBJECT;
    },
    initialState() {
      return EMPTY_OBJECT;
    },
    helpers: {},
    hooks: {
      async pgCodecs_PgCodec(info, event) {
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
        const extensions: Partial<PgCodecExtensions> =
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
        const { serviceName, resourceOptions, pgClass } = event;

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
              serviceName,
              targetSchemaName,
              targetTableName,
            );
          if (!targetPgClass) {
            return null;
          }
          const targetCodec = await info.helpers.pgCodecs.getCodecFromClass(
            serviceName,
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

        const refDefinitions = (resourceOptions.codec as PgCodec).extensions
          ?.refDefinitions;
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
                `@ref ${refName} has no valid 'via' on ${resourceOptions.name}`,
              );
              continue;
            }
          }

          const registryBuilder =
            await info.helpers.pgRegistry.getRegistryBuilder();
          const registryConfig = registryBuilder.getRegistryConfig();

          outerLoop: for (const via of vias) {
            const path: PgCodecRefPath = [];
            const parts = via.split(";");
            let currentResourceOptions: PgResourceOptions = resourceOptions;
            for (const rawPart of parts) {
              type RelationEntry = [
                string,
                PgCodecRelationConfig<PgCodecWithAttributes, PgResourceOptions>,
              ];
              const relationEntries = Object.entries(
                registryConfig.pgRelations[currentResourceOptions.codec.name],
              ) as Array<RelationEntry>;
              const part = rawPart.trim();
              // ENHANCE: allow whitespace
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

                const localAttributes = parseDatabaseIdentifiers(
                  rawLocalCols,
                  1,
                ).map((i) => i[0]);
                const maybeTargetAttributes = maybeRawTargetCols
                  ? parseDatabaseIdentifiers(maybeRawTargetCols, 1).map(
                      (i) => i[0],
                    )
                  : null;

                const targetCodec = await getCodecForTableName(
                  targetTableIdentifier,
                );
                if (!targetCodec) {
                  console.error(
                    `Ref ${refName} has bad via '${via}' which references table '${targetTableIdentifier}' which we either cannot find, or have not generated a resource for. Please be sure to indicate the schema if required.`,
                  );
                  continue outerLoop;
                }

                relationEntry = relationEntries.find(([, rel]) => {
                  if (rel.remoteResourceOptions.codec !== targetCodec) {
                    return false;
                  }
                  if (!arraysMatch(rel.localAttributes, localAttributes)) {
                    return false;
                  }
                  if (maybeTargetAttributes) {
                    if (
                      !arraysMatch(rel.remoteAttributes, maybeTargetAttributes)
                    ) {
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
                    `Ref ${refName} has bad via '${via}' which references table '${targetTableIdentifier}' which we either cannot find, or have not generated a resource for. Please be sure to indicate the schema if required.`,
                  );
                  continue outerLoop;
                }
                relationEntry = relationEntries.find(([, rel]) => {
                  return rel.remoteResourceOptions.codec === targetCodec;
                });
              }
              if (relationEntry) {
                path.push({
                  relationName: relationEntry[0],
                });
                const nextSource = relationEntry[1].remoteResourceOptions;
                currentResourceOptions = nextSource;
              } else {
                console.warn(
                  `Could not find matching relation for '${via}' / ${currentResourceOptions.name} -> '${rawPart}'`,
                );
                continue outerLoop;
              }
            }
            paths.push(path);
          }

          if (!resourceOptions.codec.refs) {
            resourceOptions.codec.refs = Object.create(null) as Record<
              string,
              any
            >;
          }
          if (resourceOptions.codec.refs[refName]) {
            throw new Error(
              `@ref ${refName} already registered in ${resourceOptions.codec.name}`,
            );
          }
          resourceOptions.codec.refs[refName] = {
            definition: refDefinition,
            paths,
          };
        }
      },
    },
  }),
};
