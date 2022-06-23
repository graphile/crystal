import "graphile-build";
import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgSelectSinglePlan,
  PgSource,
  PgSourceRelation,
  PgTypeCodec,
} from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";
import { arraysMatch, connection } from "dataplanner";
import type { PluginHook } from "graphile-config";
import { EXPORTABLE, isSafeIdentifier } from "graphile-export";
import type { GraphQLObjectType } from "graphql";
import type { PgAttribute, PgClass, PgConstraint } from "pg-introspection";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";

declare global {
  namespace GraphileBuild {
    interface PgRelationsPluginRelationDetails {
      source: PgSource<any, any, any, any>;
      codec: PgTypeCodec<any, any, any>;
      identifier: string;
      relation: PgSourceRelation<any, any>;
    }

    interface ScopeObjectFieldsField {
      isPgSingleRelationField?: boolean;
      isPgManyRelationConnectionField?: boolean;
      isPgManyRelationListField?: boolean;
      pgRelationDetails?: PgRelationsPluginRelationDetails;
    }
    interface Inflection {
      sourceRelationName(
        this: Inflection,
        details: {
          databaseName: string;
          pgConstraint: PgConstraint;
          localClass: PgClass;
          localColumns: PgAttribute[];
          foreignClass: PgClass;
          foreignColumns: PgAttribute[];
          isUnique: boolean;
          isBackwards: boolean;
        },
      ): string;
      singleRelation(
        this: Inflection,
        details: PgRelationsPluginRelationDetails,
      ): string;
      singleRelationBackwards(
        this: Inflection,
        details: PgRelationsPluginRelationDetails,
      ): string;
      manyRelationConnection(
        this: Inflection,
        details: PgRelationsPluginRelationDetails,
      ): string;
      manyRelationList(
        this: Inflection,
        details: PgRelationsPluginRelationDetails,
      ): string;
    }
  }
}

declare module "@dataplan/pg" {
  interface PgSourceRelationExtensions {
    /** The (singular) forward relation name */
    fieldName?: string;
    /** The (singular) backward relation name for a FK against a unique combo */
    foreignSingleFieldName?: string;
    /** The (plural) backward relation name for a FK when exposed as a list (rather than a connection) */
    foreignSimpleFieldName?: string;
    /** The (generally plural) backward relation name, also used as a fallback from foreignSimpleFieldName, foreignSingleFieldName */
    foreignFieldName?: string;
  }
}

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgRelations: {
        addRelation(
          event: {
            pgClass: PgClass;
            databaseName: string;
            relations: GraphileConfig.PgTablesPluginSourceRelations;
          },
          pgConstraint: PgConstraint,
          isBackwards?: boolean,
        ): Promise<void>;
      };
    }
    interface GatherHooks {
      pgRelations_relation: PluginHook<
        (event: {
          databaseName: string;
          pgClass: PgClass;
          pgConstraint: PgConstraint;
          relation: PgSourceRelation<any, any>;
        }) => Promise<void> | void
      >;
    }
  }
}

interface State {}
interface Cache {}

// TODO: split this into one plugin for gathering and another for schema
export const PgRelationsPlugin: GraphileConfig.Plugin = {
  name: "PgRelationsPlugin",
  description:
    "Creates relationships between the @dataplan/pg data sources, and mirrors these relationships into the GraphQL schema",
  version,

  inflection: {
    add: {
      sourceRelationName(
        options,
        {
          databaseName,
          pgConstraint,
          localClass: _localClass,
          localColumns,
          foreignClass,
          foreignColumns,
          isUnique,
          isBackwards,
        },
      ) {
        const { tags } = pgConstraint.getTagsAndDescription();
        if (!isBackwards && typeof tags.fieldName === "string") {
          return tags.fieldName;
        }
        if (isBackwards && typeof tags.foreignFieldName === "string") {
          return tags.foreignFieldName;
        }
        const remoteName = this.tableSourceName({
          databaseName,
          pgClass: foreignClass,
        });
        const columns = !isBackwards
          ? // We have a column referencing another table
            localColumns
          : // The other table has a constraint that references us; this is the backwards relation.
            foreignColumns;
        const columnNames = columns.map((col) => col.attname);
        return this.camelCase(
          `${isUnique ? remoteName : this.pluralize(remoteName)}-by-${
            isBackwards ? "their" : "my"
          }-${columnNames.join("-and-")}`,
        );
      },

      singleRelation(options, details) {
        if (typeof details.relation.extensions?.tags.fieldName === "string") {
          return details.relation.extensions.tags.fieldName;
        }
        // E.g. posts(author_id) references users(id)
        const remoteType = this.tableType(details.relation.source.codec);
        const localColumns = details.relation.localColumns;
        return this.camelCase(`${remoteType}-by-${localColumns.join("-and-")}`);
      },
      singleRelationBackwards(options, details) {
        if (
          typeof details.relation.extensions?.tags.foreignSingleFieldName ===
          "string"
        ) {
          return details.relation.extensions.tags.foreignSingleFieldName;
        }
        if (
          typeof details.relation.extensions?.tags.foreignFieldName === "string"
        ) {
          return details.relation.extensions.tags.foreignFieldName;
        }
        // E.g. posts(author_id) references users(id)
        const remoteType = this.tableType(details.relation.source.codec);
        const remoteColumns = details.relation.remoteColumns;
        return this.camelCase(
          `${remoteType}-by-${remoteColumns.join("-and-")}`,
        );
      },
      manyRelationConnection(options, details) {
        if (
          typeof details.relation.extensions?.tags.foreignFieldName === "string"
        ) {
          return this.camelCase(
            details.relation.extensions.tags.foreignFieldName,
          );
        }
        // E.g. users(id) references posts(author_id)
        const remoteType = this.tableType(details.relation.source.codec);
        const remoteColumns = details.relation.remoteColumns;
        return this.camelCase(
          `${this.pluralize(remoteType)}-by-${remoteColumns.join("-and-")}`,
        );
      },
      manyRelationList(options, details) {
        if (
          typeof details.relation.extensions?.tags.foreignSimpleFieldName ===
          "string"
        ) {
          return details.relation.extensions.tags.foreignSimpleFieldName;
        }
        if (
          typeof details.relation.extensions?.tags.foreignFieldName === "string"
        ) {
          return this.camelCase(
            details.relation.extensions.tags.foreignFieldName + "-list",
          );
        }
        const remoteType = this.tableType(details.relation.source.codec);
        const remoteColumns = details.relation.remoteColumns;
        return this.camelCase(
          `${this.pluralize(remoteType)}-by-${remoteColumns.join(
            "-and-",
          )}-list`,
        );
      },
    },
  },

  gather: <GraphileConfig.PluginGatherConfig<"pgRelations", State, Cache>>{
    namespace: "pgRelations",
    initialState: (): State => ({}),
    helpers: {
      async addRelation(info, event, pgConstraint, isBackwards = false) {
        const pgClass = isBackwards
          ? pgConstraint.getForeignClass()
          : pgConstraint.getClass();
        const foreignClass = isBackwards
          ? pgConstraint.getClass()
          : pgConstraint.getForeignClass();
        if (!pgClass || !foreignClass) {
          throw new Error(`Invalid introspection`);
        }
        const localColumnNumbers = isBackwards
          ? pgConstraint.confkey!
          : pgConstraint.conkey!;
        const foreignColumnNumbers = isBackwards
          ? pgConstraint.conkey!
          : pgConstraint.confkey!;
        const isUnique = !isBackwards
          ? true
          : (() => {
              // This relationship is unique if the REFERENCED table (not us!)
              // has a unique constraint on the remoteColumns the relationship
              // specifies (or a subset thereof).
              const foreignUniqueColumnOnlyConstraints = foreignClass
                .getConstraints()!
                .filter(
                  (c) =>
                    ["u", "p"].includes(c.contype) &&
                    c.conkey?.every((k) => k > 0),
                );
              const foreignUniqueColumnNumberCombinations =
                foreignUniqueColumnOnlyConstraints.map((c) => c.conkey!);
              const isUnique = foreignUniqueColumnNumberCombinations.some(
                (foreignUniqueColumnNumbers) => {
                  return foreignUniqueColumnNumbers.every(
                    (n) => n > 0 && pgConstraint.conkey!.includes(n),
                  );
                },
              );
              return isUnique;
            })();
        const { databaseName, relations } = event;
        const localColumns = await Promise.all(
          localColumnNumbers.map((key) =>
            info.helpers.pgIntrospection.getAttribute(
              databaseName,
              pgClass._id,
              key,
            ),
          ),
        );
        const foreignColumns = await Promise.all(
          foreignColumnNumbers.map((key) =>
            info.helpers.pgIntrospection.getAttribute(
              databaseName,
              foreignClass!._id,
              key,
            ),
          ),
        );
        const foreignSource = await info.helpers.pgTables.getSourceBuilder(
          databaseName,
          foreignClass,
        );
        if (!foreignSource) {
          return;
        }
        const relationName = info.inflection.sourceRelationName({
          databaseName,
          pgConstraint,
          localClass: pgClass,
          localColumns: localColumns as PgAttribute[],
          foreignClass,
          foreignColumns: foreignColumns as PgAttribute[],
          isUnique,
          isBackwards,
        });
        const existingRelation = relations[relationName];
        const newRelation: PgSourceRelation<any, any> = {
          localColumns: localColumns.map((c) => c!.attname),
          remoteColumns: foreignColumns.map((c) => c!.attname),
          source: foreignSource,
          isUnique,
          isBackwards,
        };
        await info.process("pgRelations_relation", {
          databaseName,
          pgClass,
          pgConstraint,
          relation: newRelation,
        });
        if (existingRelation) {
          const isEquivalent =
            existingRelation.isUnique === newRelation.isUnique &&
            existingRelation.isBackwards === newRelation.isBackwards &&
            arraysMatch(
              existingRelation.localColumns,
              newRelation.localColumns,
            ) &&
            arraysMatch(
              existingRelation.remoteColumns,
              newRelation.remoteColumns,
            ) &&
            existingRelation.source === newRelation.source;
          const message = `Attempted to add a ${
            isBackwards ? "backwards" : "forwards"
          } relation named '${relationName}' to '${pgClass.relname}' for ${
            isEquivalent ? "equivalent " : ""
          }constraint '${pgConstraint.conname}' on '${
            pgClass.getNamespace()!.nspname
          }.${
            pgClass.relname
          }', but a relation by that name already exists; consider renaming the relation by overriding the 'sourceRelationName' inflector`;
          if (isEquivalent) {
            console.warn(message);
            return;
          } else {
            throw new Error(message);
          }
        }
        relations[relationName] = newRelation;
      },
    },
    hooks: {
      async pgTables_PgSourceBuilder_relations(info, event) {
        const { pgClass, databaseName } = event;
        const constraints =
          await info.helpers.pgIntrospection.getConstraintsForClass(
            databaseName,
            pgClass._id,
          );

        const foreignConstraints =
          await info.helpers.pgIntrospection.getForeignConstraintsForClass(
            databaseName,
            pgClass._id,
          );

        for (const constraint of constraints) {
          if (constraint.contype === "f") {
            await info.helpers.pgRelations.addRelation(event, constraint);
          }
        }
        for (const constraint of foreignConstraints) {
          if (constraint.contype === "f") {
            await info.helpers.pgRelations.addRelation(event, constraint, true);
          }
        }
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          extend,
          graphql: { GraphQLList, GraphQLObjectType },
          options: { simpleCollections },
        } = build;
        const {
          Self,
          scope: { isPgTableType, pgCodec: codec },
          fieldWithHooks,
        } = context;
        if (!isPgTableType || !codec) {
          return fields;
        }
        const source = build.input.pgSources.find((s) => s.codec === codec);
        if (!source) {
          return fields;
        }
        const relations: {
          [identifier: string]: PgSourceRelation<any, any>;
        } = source.getRelations();
        return Object.entries(relations).reduce(
          (memo, [identifier, relation]) => {
            const {
              isUnique,
              localColumns,
              remoteColumns,
              source: otherSourceOrBuilder,
              extensions,
            } = relation;
            const relationTypeScope = isUnique
              ? `singularRelation`
              : `manyRelation`;
            const otherSource =
              otherSourceOrBuilder instanceof PgSourceBuilder
                ? otherSourceOrBuilder.get()
                : otherSourceOrBuilder;
            const otherCodec = otherSource.codec;
            const typeName = build.inflection.tableType(otherCodec);
            const OtherType = build.getTypeByName(typeName);
            if (!OtherType || !(OtherType instanceof GraphQLObjectType)) {
              return memo;
            }
            let fields = memo;
            const behavior = getBehavior(extensions);
            const defaultBehavior = isUnique
              ? "single -singleRelation:list -singleRelation:connection"
              : simpleCollections === "both"
              ? "connection list"
              : simpleCollections === "only"
              ? "list"
              : "connection";

            const relationDetails: GraphileBuild.PgRelationsPluginRelationDetails =
              {
                source,
                codec,
                identifier,
                relation,
              };
            const clean =
              remoteColumns.every(
                (remoteColumnName) =>
                  typeof remoteColumnName === "string" &&
                  isSafeIdentifier(remoteColumnName),
              ) &&
              localColumns.every(
                (localColumnName) =>
                  typeof localColumnName === "string" &&
                  isSafeIdentifier(localColumnName),
              );
            const singleRecordPlan = clean
              ? // Optimise function for both execution and export.
                // eslint-disable-next-line graphile-export/exhaustive-deps
                (EXPORTABLE(
                  new Function(
                    "otherSource",
                    `return $messages => otherSource.get({ ${remoteColumns
                      .map(
                        (remoteColumnName, i) =>
                          `${
                            remoteColumnName as string
                          }: $messages.get(${JSON.stringify(localColumns[i])})`,
                      )
                      .join(", ")} })`,
                  ) as any,
                  [otherSource],
                ) as any)
              : EXPORTABLE(
                  (localColumns, otherSource, remoteColumns) =>
                    function plan(
                      $message: PgSelectSinglePlan<any, any, any, any>,
                    ) {
                      const spec = remoteColumns.reduce(
                        (memo, remoteColumnName, i) => {
                          memo[remoteColumnName] = $message.get(
                            localColumns[i] as string,
                          );
                          return memo;
                        },
                        {},
                      );
                      return otherSource.get(spec);
                    },
                  [localColumns, otherSource, remoteColumns],
                );

            const listPlan = clean
              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                (EXPORTABLE(
                  new Function(
                    "otherSource",
                    `return $messages => otherSource.find({ ${remoteColumns
                      .map(
                        (remoteColumnName, i) =>
                          `${
                            remoteColumnName as string
                          }: $messages.get(${JSON.stringify(localColumns[i])})`,
                      )
                      .join(", ")} })`,
                  ) as any,
                  [otherSource],
                ) as any)
              : EXPORTABLE(
                  (localColumns, otherSource, remoteColumns) =>
                    function plan(
                      $message: PgSelectSinglePlan<any, any, any, any>,
                    ) {
                      const spec = remoteColumns.reduce(
                        (memo, remoteColumnName, i) => {
                          memo[remoteColumnName] = $message.get(
                            localColumns[i] as string,
                          );
                          return memo;
                        },
                        {},
                      );
                      return otherSource.find(spec);
                    },
                  [localColumns, otherSource, remoteColumns],
                );

            const connectionPlan = clean
              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                (EXPORTABLE(
                  new Function(
                    "otherSource",
                    "connection",
                    `return $messages => {
  const $records = otherSource.find({ ${remoteColumns
    .map(
      (remoteColumnName, i) =>
        `${remoteColumnName as string}: $messages.get(${JSON.stringify(
          localColumns[i],
        )})`,
    )
    .join(", ")} });
  return connection($records);
}`,
                  ) as any,
                  [otherSource, connection],
                ) as any)
              : EXPORTABLE(
                  (connection, localColumns, otherSource, remoteColumns) =>
                    function plan(
                      $message: PgSelectSinglePlan<any, any, any, any>,
                    ) {
                      const spec = remoteColumns.reduce(
                        (memo, remoteColumnName, i) => {
                          memo[remoteColumnName] = $message.get(
                            localColumns[i] as string,
                          );
                          return memo;
                        },
                        {},
                      );
                      return connection(otherSource.find(spec));
                    },
                  [connection, localColumns, otherSource, remoteColumns],
                );

            if (
              isUnique &&
              build.behavior.matches(
                behavior,
                `${relationTypeScope}:single`,
                defaultBehavior,
              )
            ) {
              const fieldName = relationDetails.relation.isBackwards
                ? build.inflection.singleRelationBackwards(relationDetails)
                : build.inflection.singleRelation(relationDetails);
              fields = extend(
                fields,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
                      fieldBehaviorScope: `${relationTypeScope}:single`,
                      isPgSingleRelationField: true,
                      pgRelationDetails: relationDetails,
                    },
                    {
                      // TODO: handle nullability
                      type: OtherType as GraphQLObjectType,
                      plan: singleRecordPlan,
                    },
                  ),
                },
                `Adding '${identifier}' single relation field to ${Self.name}`,
                "recoverable",
              );
            }

            if (
              build.behavior.matches(
                behavior,
                `${relationTypeScope}:connection`,
                defaultBehavior,
              )
            ) {
              const connectionTypeName =
                build.inflection.connectionType(typeName);
              const ConnectionType =
                build.getOutputTypeByName(connectionTypeName);
              if (ConnectionType) {
                const fieldName =
                  build.inflection.manyRelationConnection(relationDetails);
                fields = extend(
                  fields,
                  {
                    [fieldName]: fieldWithHooks(
                      {
                        fieldName,
                        fieldBehaviorScope: `${relationTypeScope}:connection`,
                        pgSource: otherSource,
                        isPgFieldConnection: true,
                        isPgManyRelationConnectionField: true,
                        pgRelationDetails: relationDetails,
                      },
                      {
                        // TODO: handle nullability
                        type: ConnectionType as GraphQLObjectType,
                        plan: connectionPlan,
                      },
                    ),
                  },
                  `Adding '${identifier}' many relation connection field to ${Self.name}`,
                  "recoverable",
                );
              }
            }

            if (
              build.behavior.matches(
                behavior,
                `${relationTypeScope}:list`,
                defaultBehavior,
              )
            ) {
              const fieldName =
                build.inflection.manyRelationList(relationDetails);
              fields = extend(
                fields,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
                      fieldBehaviorScope: `${relationTypeScope}:list`,
                      pgSource: otherSource,
                      isPgFieldSimpleCollection: true,
                      isPgManyRelationListField: true,
                      pgRelationDetails: relationDetails,
                    },
                    {
                      // TODO: handle nullability x2
                      type: new GraphQLList(OtherType),
                      plan: listPlan,
                    },
                  ),
                },
                `Adding '${identifier}' many relation list field to ${Self.name}`,
                "recoverable",
              );
            }

            return fields;
          },
          fields,
        );
      },
    },
  },
};
