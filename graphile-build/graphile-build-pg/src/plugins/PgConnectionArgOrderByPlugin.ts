import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodec,
  PgSelectParsedCursorStep,
  PgSelectSingleStep,
  PgSelectStep,
} from "@dataplan/pg";
import type {
  ConnectionStep,
  GrafastFieldConfigArgumentMap,
  InputStep,
} from "grafast";
import { getEnumValueConfig, SafeError } from "grafast";
import type { GraphQLEnumType, GraphQLSchema } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";
import { inspect } from "util";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      orderByType(this: Inflection, typeName: string): string;
    }
    interface ScopeEnum {
      pgCodec?: PgCodec;
      isPgRowSortEnum?: boolean;
    }
  }
}

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
    entityBehavior: {
      pgCodec: "order",
      pgResource: {
        provides: ["default"],
        before: ["inferred", "override"],
        callback(behavior, resource) {
          if (resource.parameters) {
            return behavior;
          } else {
            return ["order", behavior];
          }
        },
      },
    },
    hooks: {
      init(_, build) {
        const { inflection, pgCodecMetaLookup } = build;
        pgCodecMetaLookup.forEach((meta, codec) => {
          if (!codec.attributes || codec.isAnonymous) return;
          if (!build.behavior.pgCodecMatches(codec, "order")) {
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
                    grafast: {
                      // NATURAL means to not change the sort order
                      applyPlan: EXPORTABLE(() => () => {}, []),
                    },
                  },
                },
              },
            }),
            `Adding connection "orderBy" argument for ${codec.name}.`,
            // ERRORS: implement a more helpful error message:
            /* `You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
              table,
              {
                name: "newNameHere",
              },
            )}`,*/
          );
          if (codec.polymorphism?.mode === "single") {
            // ENHANCE: register OrderBy for each concrete type
          }
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
        const { scope, Self } = context;
        const {
          fieldName,
          isPgFieldConnection,
          isPgFieldSimpleCollection,
          pgFieldResource: pgResource,
          pgFieldCodec,
        } = scope;

        if (!isPgFieldConnection && !isPgFieldSimpleCollection) {
          return args;
        }

        const codec = pgFieldCodec ?? pgResource?.codec;
        const isSuitableSource =
          pgResource && pgResource.codec.attributes && !pgResource.isUnique;
        const isSuitableCodec =
          codec &&
          (isSuitableSource ||
            (!pgResource && codec?.polymorphism?.mode === "union")) &&
          codec.attributes;

        if (!isSuitableCodec) {
          return args;
        }
        if (
          pgResource
            ? !build.behavior.pgResourceMatches(pgResource, "order")
            : codec
            ? !build.behavior.pgCodecMatches(codec, "order")
            : false
        ) {
          return args;
        }

        const tableTypeName = inflection.tableType(codec);
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
              autoApplyAfterParentPlan: true,
              applyPlan: isPgFieldConnection
                ? EXPORTABLE(
                    (applyOrderToPlan, tableOrderByTypeName) =>
                      function plan(
                        _: any,
                        $connection: ConnectionStep<
                          PgSelectSingleStep<any>,
                          PgSelectParsedCursorStep,
                          PgSelectStep<any>
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
                        $select: PgSelectStep<any>,
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
          } as GrafastFieldConfigArgumentMap<any, any, any, any>,
          `Adding 'orderBy' argument to field '${fieldName}' of '${Self.name}'`,
        );
      },
    },
  },
};

export const applyOrderToPlan = EXPORTABLE(
  (SafeError, getEnumValueConfig, inspect) =>
    (
      $select: PgSelectStep<any>,
      $value: InputStep,
      TableOrderByType: GraphQLEnumType,
    ) => {
      const val = $value.eval();
      if (val == null) {
        return;
      }
      if (!Array.isArray(val)) {
        throw new Error("Invalid!");
      }
      val.forEach((order) => {
        const config = getEnumValueConfig(TableOrderByType, order);
        const plan = config?.extensions?.grafast?.applyPlan;
        if (typeof plan !== "function") {
          console.error(
            `Internal server error: invalid orderBy configuration: expected function, but received ${inspect(
              plan,
            )}`,
          );
          throw new SafeError(
            "Internal server error: invalid orderBy configuration",
          );
        }
        plan($select);
      });
    },
  [SafeError, getEnumValueConfig, inspect],
);
