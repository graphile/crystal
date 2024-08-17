import "./PgTablesPlugin.js";
import "./PgBasicsPlugin.js";
import "graphile-config";

import type {
  PgSelectParsedCursorStep,
  PgSelectSingleStep,
  PgSelectStep,
  PgUnionAllStep,
} from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import type { ConnectionStep } from "grafast";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgConnectionTotalCountPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BehaviorStrings {
      totalCount: true;
    }
    interface ScopeObjectFieldsField {
      /**
       * 'true' if this field is the 'totalCount' field on a connection as
       * added by {@link PgConnectionTotalCountPlugin}.
       */
      isPgConnectionTotalCountField?: true;
    }
  }
}

export const PgConnectionTotalCountPlugin: GraphileConfig.Plugin = {
  name: "PgConnectionTotalCountPlugin",
  description: "Add 'totalCount' field to connections",
  version,
  schema: {
    behaviorRegistry: {
      add: {
        totalCount: {},
      },
    },

    entityBehavior: {
      pgCodec: "totalCount",
    },
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          extend,
          inflection,
          graphql: { GraphQLInt, GraphQLNonNull },
          sql,
        } = build;
        const {
          scope: { isPgConnectionRelated, isConnectionType, pgCodec: codec },
          fieldWithHooks,
          Self,
        } = context;

        if (!isPgConnectionRelated || !isConnectionType) {
          return fields;
        }

        const nodeTypeName = codec
          ? codec.attributes
            ? inflection.tableType(codec)
            : build.getGraphQLTypeNameByPgCodec(codec, "output")
          : null;
        if (!nodeTypeName) {
          return fields;
        }

        if (!build.behavior.pgCodecMatches(codec!, "totalCount")) {
          return fields;
        }

        return extend(
          fields,
          {
            totalCount: fieldWithHooks(
              {
                fieldName: "totalCount",
                fieldBehaviorScope: `totalCount`,
                isPgConnectionTotalCountField: true,
              },
              () => {
                return {
                  description: build.wrapDescription(
                    `The count of *all* \`${nodeTypeName}\` you could get from the connection.`,
                    "field",
                  ),
                  type: new GraphQLNonNull(GraphQLInt),
                  plan: EXPORTABLE(
                    (TYPES, sql) =>
                      (
                        $connection: ConnectionStep<
                          PgSelectSingleStep<any> | PgUnionAllStep<any, any>,
                          PgSelectParsedCursorStep,
                          PgSelectStep<any> | PgUnionAllStep<any, any>,
                          PgSelectSingleStep<any> | PgUnionAllStep<any, any>
                        >,
                      ) =>
                        $connection
                          .cloneSubplanWithoutPagination("aggregate")
                          .singleAsRecord()
                          .select(sql`count(*)`, TYPES.bigint) as any,
                    [TYPES, sql],
                  ),
                };
              },
            ),
          },
          `Adding totalCount to connection '${Self.name}'`,
        );
      },
    },
  },
};
