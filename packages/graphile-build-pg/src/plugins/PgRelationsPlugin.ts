import "graphile-build";

import type {
  PgSelectSinglePlan,
  PgSource,
  PgSourceRelation,
  PgTypeCodec,
} from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";
import { connection } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLObjectType } from "graphql";
import { GraphQLList } from "graphql";

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

export const PgRelationsPlugin: Plugin = {
  name: "PgRelationsPlugin",
  description: "Creates links between types representing PostgreSQL tables",
  version,
  schema: {
    hooks: {
      inflection(inflection, build) {
        return build.extend(
          inflection,
          {
            singleRelation(details) {
              return this.camelCase(details.identifier);
            },
            manyRelationConnection(details) {
              return this.camelCase(details.identifier);
            },
            manyRelationList(details) {
              return this.camelCase(details.identifier + "-list");
            },
          },
          "Adding inflectors from PgForwardRelationPlugin",
        );
      },
      GraphQLObjectType_fields(fields, build, context) {
        const { extend } = build;
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
                  return connection(otherSource.find(spec));
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
