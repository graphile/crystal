import "graphile-build";
import "./PgTablesPlugin.js";

import type {
  PgSelectSinglePlan,
  PgSource,
  PgSourceRelation,
  PgTypeCodec,
} from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";
import { connection } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin, PluginGatherConfig } from "graphile-plugin";
import type { GraphQLObjectType } from "graphql";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";

interface RelationDetails {
  source: PgSource<any, any, any, any>;
  codec: PgTypeCodec<any, any, any>;
  identifier: string;
  relation: PgSourceRelation<any, any>;
}

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLObjectTypeFieldsField {
      isPgSingleRelationField?: boolean;
      isPgManyRelationConnectionField?: boolean;
      isPgManyRelationListField?: boolean;
      pgRelationDetails?: RelationDetails;
    }
    interface Inflection {
      singleRelation(this: Inflection, details: RelationDetails): string;
      manyRelationConnection(
        this: Inflection,
        details: RelationDetails,
      ): string;
      manyRelationList(this: Inflection, details: RelationDetails): string;
    }
  }
}

declare module "graphile-plugin" {
  interface GatherHelpers {
    pgRelations: Record<string, never>;
  }
}

interface State {}
interface Cache {}

export const PgRelationsPlugin: Plugin = {
  name: "PgRelationsPlugin",
  description: "Creates links between types representing PostgreSQL tables",
  version,
  gather: <PluginGatherConfig<"pgRelations", State, Cache>>{
    namespace: "pgRelations",
    helpers: {},
    initialState: (): State => ({}),
    hooks: {
      async "pgTables:PgSourceBuilder:relations"(
        info,
        { pgClass, databaseName, relations },
      ) {
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
        const addRelation = async (
          relationName: string,
          localColumnNumbers: readonly number[],
          foreignClassId: string,
          foreignColumnNumbers: readonly number[],
          isUnique: boolean,
        ) => {
          const localColumns = await Promise.all(
            localColumnNumbers!.map((key) =>
              info.helpers.pgIntrospection.getAttribute(
                databaseName,
                pgClass._id,
                key,
              ),
            ),
          );
          const foreignClass = await info.helpers.pgIntrospection.getClass(
            databaseName,
            foreignClassId,
          );
          if (!foreignClass) {
            throw new Error(`Could not find class with id '${foreignClassId}'`);
          }
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
          relations[relationName] = {
            localColumns: localColumns.map((c) => c!.attname),
            remoteColumns: foreignColumns.map((c) => c!.attname),
            source: foreignSource,
            isUnique,
            extensions: { tags: {} },
          };
        };

        for (const constraint of constraints) {
          if (constraint.contype === "f") {
            addRelation(
              constraint.conname,
              constraint.conkey!,
              constraint.confrelid!,
              constraint.confkey!,
              true,
            );
          }
        }
        for (const constraint of foreignConstraints) {
          if (constraint.contype === "f") {
            // This relationship is unique if the REFERENCED table (not us!)
            // has a unique constraint on the remoteColumns the relationship
            // specifies (or a subset thereof).
            const foreignUniqueColumnOnlyConstraints =
              foreignConstraints.filter(
                (c) =>
                  ["u", "p"].includes(c.contype) &&
                  c.conkey?.every((k) => k > 0),
              );
            const foreignUniqueColumnNumberCombinations =
              foreignUniqueColumnOnlyConstraints.map((c) => c.conkey!);
            const isUnique = foreignUniqueColumnNumberCombinations.some(
              (foreignUniqueColumnNumbers) => {
                return foreignUniqueColumnNumbers.every(
                  (n) => n > 0 && constraint.confkey!.includes(n),
                );
              },
            );
            addRelation(
              constraint.conname,
              constraint.confkey!,
              constraint.conrelid!,
              constraint.conkey!,
              isUnique,
            );
          }
        }
      },
    },
  },
  schema: {
    hooks: {
      inflection(inflection, build) {
        return build.extend(
          inflection,
          {
            singleRelation(details) {
              // E.g. posts(author_id) references users(id)
              const remoteType = this.tableType(details.relation.source.codec);
              const localColumns = details.relation.localColumns;
              return this.camelCase(
                `${remoteType}-by-${localColumns.join("-and-")}`,
              );
            },
            manyRelationConnection(details) {
              // E.g. users(id) references posts(author_id)
              const remoteType = this.tableType(details.relation.source.codec);
              const remoteColumns = details.relation.remoteColumns;
              return this.camelCase(
                `${this.pluralize(remoteType)}-by-${remoteColumns.join(
                  "-and-",
                )}`,
              );
            },
            manyRelationList(details) {
              const remoteType = this.tableType(details.relation.source.codec);
              const remoteColumns = details.relation.remoteColumns;
              return this.camelCase(
                `${this.pluralize(remoteType)}-by-${remoteColumns.join(
                  "-and-",
                )}-list`,
              );
            },
          },
          "Adding inflectors from PgForwardRelationPlugin",
        );
      },
      GraphQLObjectType_fields(fields, build, context) {
        const {
          extend,
          graphql: { GraphQLList },
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
            const otherSource =
              otherSourceOrBuilder instanceof PgSourceBuilder
                ? otherSourceOrBuilder.get()
                : otherSourceOrBuilder;
            const otherCodec = otherSource.codec;
            const typeName = build.inflection.tableType(otherCodec);
            const OtherType = build.getOutputTypeByName(typeName);
            if (!OtherType) {
              return memo;
            }
            let fields = memo;
            const behavior =
              getBehavior(extensions) ??
              (isUnique ? ["single"] : ["connection"]);

            const relationDetails: RelationDetails = {
              source,
              codec,
              identifier,
              relation,
            };
            const singleRecordPlan = EXPORTABLE(
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

            const listPlan = EXPORTABLE(
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

            const connectionPlan = EXPORTABLE(
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
                  return connection(
                    otherSource.find(spec),
                    ($item) => $item,
                    ($item: PgSelectSinglePlan<any, any, any, any>) =>
                      $item.cursor(),
                  );
                },
              [connection, localColumns, otherSource, remoteColumns],
            );

            if (isUnique && behavior.includes("single")) {
              const fieldName =
                build.inflection.singleRelation(relationDetails);
              fields = extend(
                fields,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
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

            if (behavior.includes("connection")) {
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

            if (behavior.includes("list")) {
              const fieldName =
                build.inflection.manyRelationList(relationDetails);
              fields = extend(
                fields,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
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
