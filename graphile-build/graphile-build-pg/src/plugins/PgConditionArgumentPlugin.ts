import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodecWithAttributes,
  PgSelectParsedCursorStep,
  PgSelectSingleStep,
  PgSelectStep,
} from "@dataplan/pg";
import type { ConnectionStep } from "grafast";
import type { GraphQLInputObjectType } from "grafast/graphql";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgConditionArgumentPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BehaviorStrings {
      filter: true;
    }
    interface Inflection {
      conditionType(this: Inflection, typeName: string): string;
    }
    interface ScopeInputObject {
      isPgCondition?: boolean;
    }
    interface ScopeInputObjectFieldsField {
      isPgConnectionConditionInputField?: boolean;
    }
  }
}

export const PgConditionArgumentPlugin: GraphileConfig.Plugin = {
  name: "PgConditionArgumentPlugin",
  description: "Adds the 'condition' argument to connections and lists",
  version: version,

  inflection: {
    add: {
      conditionType(options, typeName) {
        return this.upperCamelCase(`${typeName}-condition`);
      },
    },
  },

  schema: {
    behaviorRegistry: {
      add: {
        filter: {
          description: "can we filter this resource/codec",
          entities: ["pgCodec", "pgResource"],
        },
      },
    },

    entityBehavior: {
      pgCodec: ["select", "filter"],
      pgResource: {
        provides: ["default"],
        before: ["inferred", "override"],
        callback(behavior, resource) {
          return resource.parameters ? [behavior] : ["filter", behavior];
        },
      },
    },
    hooks: {
      init(_, build) {
        const { inflection } = build;
        for (const rawCodec of build.pgCodecMetaLookup.keys()) {
          build.recoverable(null, () => {
            // Ignore scalar codecs
            if (!rawCodec.attributes || rawCodec.isAnonymous) {
              return;
            }
            const codec = rawCodec as PgCodecWithAttributes;

            const tableTypeName = inflection.tableType(codec);
            const conditionName = inflection.conditionType(tableTypeName);
            /* const TableConditionType = */
            build.registerInputObjectType(
              conditionName,
              {
                isPgCondition: true,
                pgCodec: codec,
              },

              () => ({
                description: build.wrapDescription(
                  `A condition to be used against \`${tableTypeName}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
                  "type",
                ),
              }),
              `Adding condition type for ${codec.name}.`,
              // ERRORS: implement a more helpful error message:
              /* `You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                table,
                {
                  name: "newNameHere",
                },
              )}`, */
            );
          });
        }
        return _;
      },

      GraphQLObjectType_fields_field_args(args, build, context) {
        const { scope, Self } = context;

        const {
          fieldName,
          fieldBehaviorScope,
          isPgFieldConnection,
          isPgFieldSimpleCollection,
          pgFieldResource: pgResource,
          pgFieldCodec,
        } = scope;

        const shouldAddCondition =
          isPgFieldConnection || isPgFieldSimpleCollection;

        const codec = pgFieldCodec ?? pgResource?.codec;
        const isSuitableSource =
          pgResource && pgResource.codec.attributes && !pgResource.isUnique;
        const isSuitableCodec =
          codec &&
          (isSuitableSource ||
            (!pgResource && codec?.polymorphism?.mode === "union")) &&
          codec.attributes;

        if (!shouldAddCondition || !isSuitableCodec) {
          return args;
        }

        const desiredBehavior = fieldBehaviorScope
          ? `${fieldBehaviorScope}:filter`
          : `filter`;
        if (
          pgResource
            ? !build.behavior.pgResourceMatches(pgResource, desiredBehavior)
            : codec
            ? !build.behavior.pgCodecMatches(codec, desiredBehavior)
            : true
        ) {
          return args;
        }

        const tableTypeName = build.inflection.tableType(codec);
        const tableConditionTypeName =
          build.inflection.conditionType(tableTypeName);
        const tableConditionType = build.getTypeByName(
          tableConditionTypeName,
        ) as GraphQLInputObjectType | undefined;
        if (!tableConditionType) {
          return args;
        }

        return build.extend(
          args,
          {
            condition: {
              description: build.wrapDescription(
                "A condition to be used in determining which values should be returned by the collection.",
                "arg",
              ),
              type: tableConditionType,
              autoApplyAfterParentPlan: true,
              applyPlan: isPgFieldConnection
                ? (
                    _condition,
                    $connection: ConnectionStep<
                      PgSelectSingleStep,
                      PgSelectParsedCursorStep,
                      PgSelectStep
                    >,
                  ) => {
                    const $select = $connection.getSubplan();
                    return $select.wherePlan();
                  }
                : (_condition, $select: PgSelectStep) => {
                    return $select.wherePlan();
                  },
            },
          },
          `Adding condition to connection field '${fieldName}' of '${Self.name}'`,
        );
      },
    },
  },
};
