import "./PgTablesPlugin";
import "./PgBasicsPlugin";

import type { PgSelectPlan } from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import type { ConnectionPlan } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";

import { version } from "../index.js";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLObjectTypeFieldsField {
      isPgConnectionTotalCountField?: true;
    }
  }
}

export const PgConnectionTotalCountPlugin: Plugin = {
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
          scope: { isPgRowConnectionType, pgCodec: codec },
          fieldWithHooks,
          Self,
        } = context;

        if (!isPgRowConnectionType) {
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
                          PgSelectPlan<any, any, any, any>
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
