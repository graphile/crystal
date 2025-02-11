import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodec,
  PgSelectParsedCursorStep,
  PgSelectQueryBuilderCallback,
  PgSelectSingleStep,
  PgSelectStep,
} from "@dataplan/pg";
import { extractEnumExtensionValue } from "@dataplan/pg";
import type {
  ConnectionStep,
  ExecutableStep,
  GrafastFieldConfigArgumentMap,
} from "grafast";
import type { GraphQLEnumType } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgConnectionArgOrderByPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BehaviorStrings {
      "resource:connection:order": true;
      "resource:list:order": true;
    }
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
    behaviorRegistry: {
      add: {
        "resource:connection:order": {
          entities: ["pgResource"],
          description: "",
        },
        "resource:list:order": {
          entities: ["pgResource"],
          description: "",
        },
      },
    },
    entityBehavior: {
      pgCodec: "order",
      pgResource: {
        inferred: {
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
                  // No need for hooks, it doesn't change the order
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
        const { scope, Self, addToPlanResolver } = context;
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

        // TODO: inflection
        const argName = "orderBy";

        if (isPgFieldConnection) {
          addToPlanResolver<
            any,
            ExecutableStep,
            ConnectionStep<
              PgSelectSingleStep<any>,
              PgSelectParsedCursorStep,
              PgSelectStep<any>
            >
          >(
            EXPORTABLE(
              (argName, extractEnumExtensionValue) =>
                ($connection, $parent, fieldArgs, { field }) => {
                  const $orderBy = fieldArgs.getRaw(argName);
                  const $select = $connection.getSubplan();
                  const orderByArg = field.args.find((a) => a.name === argName);
                  $select.apply(
                    extractEnumExtensionValue<PgSelectQueryBuilderCallback>(
                      orderByArg!.type,
                      ["grafast", "pgSelectApply"],
                      $orderBy,
                    ),
                  );
                  return $connection;
                },
              [argName, extractEnumExtensionValue],
            ),
          );
        } else {
          addToPlanResolver<any, ExecutableStep, PgSelectStep<any>>(
            EXPORTABLE(
              (argName, extractEnumExtensionValue) =>
                ($select, $parent, fieldArgs, { field }) => {
                  const $orderBy = fieldArgs.getRaw(argName);
                  const orderByArg = field.args.find((a) => a.name === argName);
                  $select.apply(
                    extractEnumExtensionValue<PgSelectQueryBuilderCallback>(
                      orderByArg!.type,
                      ["grafast", "pgSelectApply"],
                      $orderBy,
                    ),
                  );
                  return $select;
                },
              [argName, extractEnumExtensionValue],
            ),
          );
        }

        return extend(
          args,
          {
            [argName]: {
              description: build.wrapDescription(
                `The method to use when ordering \`${tableTypeName}\`.`,
                "arg",
              ),
              type: new GraphQLList(new GraphQLNonNull(TableOrderByType)),
            },
          } as GrafastFieldConfigArgumentMap<any, any, any, any>,
          `Adding '${argName}' (orderBy) argument to field '${fieldName}' of '${Self.name}'`,
        );
      },
    },
  },
};
