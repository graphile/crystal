import "./PgTablesPlugin";
import "./PgBasicsPlugin";
import "graphile-config";

import type { PgSelectPlan, PgSelectSinglePlan } from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import type { ConnectionPlan } from "dataplanner";
import { EXPORTABLE } from "graphile-export";

import { version } from "../index.js";

declare global {
  namespace GraphileBuild {
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

        const nodeTypeName = codec ? inflection.tableType(codec) : null;
        if (!nodeTypeName) {
          return fields;
        }

        return extend(
          fields,
          {
            totalCount: fieldWithHooks(
              { fieldName: "totalCount", isPgConnectionTotalCountField: true },
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
                        $connection: ConnectionPlan<
                          PgSelectSinglePlan<any, any, any, any>,
                          PgSelectPlan<any, any, any, any>,
                          PgSelectSinglePlan<any, any, any, any>
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
