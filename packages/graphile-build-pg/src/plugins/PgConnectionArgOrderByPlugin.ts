import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgSelectParsedCursorStep,
  PgSelectStep,
  PgSelectSingleStep,
  PgTypeCodec,
} from "@dataplan/pg";
import type {
  ConnectionStep,
  GraphileFieldConfigArgumentMap,
  InputStep,
} from "dataplanner";
import { getEnumValueConfig } from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLEnumType, GraphQLSchema } from "graphql";
import { inspect } from "util";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      orderByType(this: Inflection, typeName: string): string;
    }
    interface ScopeEnum {
      pgCodec?: PgTypeCodec<any, any, any, any>;
      isPgRowSortEnum?: boolean;
    }
  }
}

// TODO: rename this, it's not just for connections
export const PgConnectionArgOrderByPlugin: GraphileConfig.Plugin = {
  name: "PgConnectionArgOrderByPlugin",
  description:
    "Adds the 'orderBy' argument to connections and simple collections",
  version: version,

  inflection: {
    add: {
      orderByType(options, typeName) {
        return this.upperCamelCase(`${typeName}-order-by`);
      },
    },
  },

  schema: {
    hooks: {
      init(_, build) {
        const { inflection, pgCodecMetaLookup } = build;
        pgCodecMetaLookup.forEach((meta, codec) => {
          if (!codec.columns || codec.isAnonymous) return;
          const behavior = getBehavior(codec.extensions);
          // TODO: should this be `type:order` or similar?
          if (!build.behavior.matches(behavior, "order", "order")) {
            return;
          }

          const tableTypeName = inflection.tableType(codec);
          /* const TableOrderByType = */
          const typeName = inflection.orderByType(tableTypeName);
          build.registerEnumType(
            typeName,
            {
              pgCodec: codec,
              isPgRowSortEnum: true,
            },
            () => ({
              description: build.wrapDescription(
                `Methods to use when ordering \`${tableTypeName}\`.`,
                "type",
              ),
              values: {
                [inflection.builtin("NATURAL")]: {
                  extensions: {
                    graphile: {
                      // NATURAL means to not change the sort order
                      applyPlan: EXPORTABLE(() => () => {}, []),
                    },
                  },
                },
              },
            }),
            `Adding connection "orderBy" argument for ${codec.name}.`,
            // TODO:
            /* `You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
              table,
              {
                name: "newNameHere",
              },
            )}`,*/
          );
        });
        return _;
      },

      GraphQLObjectType_fields_field_args(args, build, context) {
        const {
          extend,
          getTypeByName,
          graphql: { GraphQLList, GraphQLNonNull },
          inflection,
        } = build;
        const {
          scope: {
            fieldName,
            isPgFieldConnection,
            isPgFieldSimpleCollection,
            pgSource,
          },
          Self,
        } = context;

        if (!isPgFieldConnection && !isPgFieldSimpleCollection) {
          return args;
        }

        if (!pgSource || !pgSource.codec.columns) {
          return args;
        }
        const behavior = getBehavior(pgSource.extensions);
        if (!build.behavior.matches(behavior, "order", "order")) {
          return args;
        }

        const tableTypeName = inflection.tableType(pgSource.codec);
        const tableOrderByTypeName = inflection.orderByType(tableTypeName);
        const TableOrderByType = getTypeByName(
          tableOrderByTypeName,
        ) as GraphQLEnumType;
        if (!TableOrderByType) {
          return args;
        }

        return extend(
          args,
          {
            orderBy: {
              description: build.wrapDescription(
                `The method to use when ordering \`${tableTypeName}\`.`,
                "arg",
              ),
              type: new GraphQLList(new GraphQLNonNull(TableOrderByType)),
              applyPlan: isPgFieldConnection
                ? EXPORTABLE(
                    (applyOrderToPlan, tableOrderByTypeName) =>
                      function plan(
                        _: any,
                        $connection: ConnectionStep<
                          PgSelectSingleStep<any, any, any, any>,
                          PgSelectParsedCursorStep,
                          PgSelectStep<any, any, any, any>
                        >,
                        val,
                        info: { schema: GraphQLSchema },
                      ) {
                        const $value = val.getRaw();
                        const $select = $connection.getSubplan();
                        applyOrderToPlan(
                          $select,
                          $value,
                          info.schema.getType(
                            tableOrderByTypeName,
                          ) as GraphQLEnumType,
                        );
                        return null;
                      },
                    [applyOrderToPlan, tableOrderByTypeName],
                  )
                : EXPORTABLE(
                    (applyOrderToPlan, tableOrderByTypeName) =>
                      function plan(
                        _: any,
                        $select: PgSelectStep<any, any, any, any>,
                        val,
                        info: { schema: GraphQLSchema },
                      ) {
                        const $value = val.getRaw();
                        applyOrderToPlan(
                          $select,
                          $value,
                          info.schema.getType(
                            tableOrderByTypeName,
                          ) as GraphQLEnumType,
                        );
                        return null;
                      },
                    [applyOrderToPlan, tableOrderByTypeName],
                  ),
            },
          } as GraphileFieldConfigArgumentMap<any, any, any, any>,
          `Adding 'orderBy' argument to field '${fieldName}' of '${Self.name}'`,
        );
      },
    },
  },
};

export const applyOrderToPlan = EXPORTABLE(
  (getEnumValueConfig, inspect) =>
    (
      $select: PgSelectStep<any, any, any, any>,
      $value: InputStep,
      TableOrderByType: GraphQLEnumType,
    ) => {
      const val = $value.eval();
      if (!Array.isArray(val)) {
        throw new Error("Invalid!");
      }
      val.forEach((order) => {
        const config = getEnumValueConfig(TableOrderByType, order);
        const plan = config?.extensions?.graphile?.applyPlan;
        if (typeof plan !== "function") {
          console.error(
            `Internal server error: invalid orderBy configuration: expected function, but received ${inspect(
              plan,
            )}`,
          );
          throw new Error(
            "Internal server error: invalid orderBy configuration",
          );
        }
        plan($select);
      });
    },
  [getEnumValueConfig, inspect],
);
