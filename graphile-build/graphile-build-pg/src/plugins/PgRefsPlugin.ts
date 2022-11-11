import type {
  PgSourceRefPath,
  PgSourceRelation,
  PgTypeColumns,
  PgSource,
  PgSourceRef,
} from "@dataplan/pg";
import { PgTypeColumn, PgSourceBuilder } from "@dataplan/pg";
import { arraysMatch } from "grafast";
import type { PgClass } from "pg-introspection";

import { version } from "../index.js";
import {
  parseDatabaseIdentifierFromSmartTag,
  parseSmartTagsOptsString,
} from "../utils.js";

function isNotNullish<T>(a: T | null | undefined): a is T {
  return a != null;
}

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
        details: { ref: PgSourceRef; identifier: string },
      ): string;
      refList(
        this: Inflection,
        details: { ref: PgSourceRef; identifier: string },
      ): string;
      refConnection(
        this: Inflection,
        details: { ref: PgSourceRef; identifier: string },
      ): string;
    }
  }
}

interface State {
  events: Array<{
    databaseName: string;
    pgClass: PgClass;
    source: PgSource<any, any, any, undefined>;
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
      refSingle(stuff, { ref, identifier }) {
        return ref.singleRecordFieldName ?? this.singularize(identifier);
      },
      refList(stuff, { ref, identifier }) {
        return (
          ref.listFieldName ??
          this.listField(this.pluralize(this.singularize(identifier)))
        );
      },
      refConnection(stuff, { ref, identifier }) {
        return (
          ref.connectionFieldName ??
          this.connectionField(this.pluralize(this.singularize(identifier)))
        );
      },
    },
  },

  gather: {
    namespace: "pgRefs",
    helpers: {},
    initialState: () => ({ events: [] }),
    hooks: {
      async pgTables_PgSource(info, event) {
        info.state.events.push(event);
      },
    },
    async main(output, info) {
      for (const event of info.state.events) {
        const { databaseName, source, pgClass } = event;

        const getSourceForTableName = async (targetTableIdentifier: string) => {
          const [targetSchemaName, targetTableName] =
            parseDatabaseIdentifierFromSmartTag(
              targetTableIdentifier,
              2,
              pgClass.getNamespace()?.nspname!,
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
          const targetSource = await info.helpers.pgCodecs.getCodecFromClass(
            databaseName,
            targetPgClass._id,
          );
          return targetSource;
        };

        const { tags } = pgClass.getTagsAndDescription();

        const rawRefs = Array.isArray(tags.ref)
          ? tags.ref
          : tags.ref
          ? [tags.ref]
          : null;
        const rawRefVias = Array.isArray(tags.refVia)
          ? tags.refVia
          : tags.refVia
          ? [tags.refVia]
          : null;

        if (!rawRefs) {
          if (rawRefVias) {
            throw new Error(`@refVia without matching @ref is invalid`);
          }
          continue;
        }

        const refs = rawRefs.map((ref) => parseSmartTagsOptsString(ref, 1));
        const refVias =
          rawRefVias?.map((refVia) => parseSmartTagsOptsString(refVia, 1)) ??
          [];

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
          const relevantVias = refVias.filter((v) => v.args[0] === name);
          const vias = [
            ...(rawVia ? [rawVia] : []),
            ...relevantVias.map((v) => v.params.via).filter(isNotNullish),
          ];

          const paths: PgSourceRefPath[] = [];

          if (vias.length === 0) {
            if (!tags.interface) {
              console.warn(`@ref ${name} has no 'via' on ${source.name}`);
            }
            continue;
          }

          outerLoop: for (const via of vias) {
            const path: PgSourceRefPath = [];
            const parts = via.split(";");
            let currentSource: PgSource<any, any, any, any> = source;
            for (const rawPart of parts) {
              type RelationEntry = [
                string,
                PgSourceRelation<PgTypeColumns<string>, PgTypeColumns<string>>,
              ];
              const relationEntries = Object.entries(
                currentSource.getRelations(),
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

                const targetSource = await getSourceForTableName(
                  targetTableIdentifier,
                );
                if (!targetSource) {
                  console.error(
                    `Ref ${name} has bad via '${via}' which references table '${targetTableIdentifier}' which we either cannot find, or have not generated a source for. Please be sure to indicate the schema if required.`,
                  );
                  continue outerLoop;
                }

                relationEntry = relationEntries.find(([, rel]) => {
                  if (rel.source.name !== targetSource.name) {
                    return false;
                  }
                  if (!arraysMatch(rel.localColumns, localColumns)) {
                    return false;
                  }
                  if (!arraysMatch(rel.localColumns, localColumns)) {
                    return false;
                  }
                  return true;
                });
              } else {
                const targetTableIdentifier = part;
                const targetSource = await getSourceForTableName(
                  targetTableIdentifier,
                );
                if (!targetSource) {
                  console.error(
                    `Ref ${name} has bad via '${via}' which references table '${targetTableIdentifier}' which we either cannot find, or have not generated a source for. Please be sure to indicate the schema if required.`,
                  );
                  continue outerLoop;
                }
                relationEntry = relationEntries.find(([, rel]) => {
                  return rel.source.name === targetSource.name;
                });
              }
              if (relationEntry) {
                path.push({
                  relationName: relationEntry[0],
                });
                const nextSource = relationEntry[1].source;
                currentSource =
                  nextSource instanceof PgSourceBuilder
                    ? nextSource.get()
                    : nextSource;
              } else {
                console.warn(
                  `Could not find matching relation for '${via}' / ${currentSource.name} -> '${rawPart}'`,
                );
                continue outerLoop;
              }
            }
            paths.push(path);
          }

          if (source.refs[name]) {
            throw new Error(
              `@ref ${name} already registered in ${source.name}`,
            );
          }
          source.refs[name] = {
            singular,
            graphqlType: to,
            paths,
            extensions: {
              tags: {
                behavior,
              },
            },
          };
        }
      }
    },
  } as GraphileConfig.PluginGatherConfig<"pgRefs", State, Cache>,
};
