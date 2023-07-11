import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodecWithAttributes,
  PgConditionStep,
  PgSelectParsedCursorStep,
  PgSelectSingleStep,
  PgSelectStep,
} from "@dataplan/pg";
import type { ConnectionStep } from "grafast";
import { EXPORTABLE } from "graphile-build";
import type { GraphQLInputObjectType, GraphQLInputType } from "graphql";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
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
    entityBehavior: {
      pgCodec: "select filter",
      pgCodecAttribute: "filterBy",
      pgResource: {
        provides: ["default"],
        before: ["inferred", "override"],
        callback(behavior, resource) {
          return [resource.parameters ? "" : "filter", behavior];
        },
      },
    },
    hooks: {
      init(_, build) {
        const { inflection, sql } = build;
        for (const rawCodec of build.pgCodecMetaLookup.keys()) {
          build.recoverable(null, () => {
            // Ignore scalar codecs
            if (!rawCodec.attributes || rawCodec.isAnonymous) {
              return;
            }
            const codec = rawCodec as PgCodecWithAttributes;

            // TODO: do we want this filter here? E.g. we might want to enable
            // a bulk delete mutation without allowing any selects? Maybe this
            // is actually a 'filter' behavior instead?
            if (!build.behavior.pgCodecMatches(codec, "select")) {
              return;
            }

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
                fields: (context) => {
                  const { fieldWithHooks } = context;
                  const allAttributes = codec.attributes;
                  const allowedAttributes =
                    codec.polymorphism?.mode === "single"
                      ? [
                          ...codec.polymorphism.commonAttributes,
                          // TODO: add condition input type for the underlying concrete types, which should also include something like:
                          /*
                          ...(pgPolymorphicSingleTableType
                            ? codec.polymorphism.types[
                                pgPolymorphicSingleTableType.typeIdentifier
                              ].attributes.map(
                                (attr) =>
                                  // FIXME: we should be factoring in the attr.rename
                                  attr.attribute,
                              )
                            : []),
                          */
                        ]
                      : null;
                  const attributes = allowedAttributes
                    ? Object.fromEntries(
                        Object.entries(allAttributes).filter(
                          ([attrName, _attr]) =>
                            allowedAttributes.includes(attrName),
                        ),
                      )
                    : allAttributes;
                  // TODO: move this to PgAttributesPlugin (see
                  // PgNodeIdAttributesPlugin for similar approach for NodeIDs)
                  return Object.entries(attributes).reduce(
                    (memo, [attributeName, attribute]) => {
                      if (
                        !build.behavior.pgCodecAttributeMatches(
                          [codec, attributeName],
                          "attribute:filterBy",
                        )
                      ) {
                        return memo;
                      }

                      // TODO: add `range:`/`binary:`/`array:attribute:filterBy` ?

                      const fieldName = inflection.attribute({
                        attributeName,
                        codec,
                      });
                      const type = build.getGraphQLTypeByPgCodec(
                        attribute.codec,
                        "input",
                      );
                      if (!type) {
                        return memo;
                      }
                      memo = build.extend(
                        memo,
                        {
                          [fieldName]: fieldWithHooks(
                            {
                              fieldName,
                              fieldBehaviorScope: "attribute:filterBy",
                              isPgConnectionConditionInputField: true,
                            },
                            {
                              description: build.wrapDescription(
                                `Checks for equality with the object’s \`${fieldName}\` field.`,
                                "field",
                              ),
                              type: type as GraphQLInputType,
                              applyPlan: EXPORTABLE(
                                (attribute, attributeName, sql) =>
                                  function plan(
                                    $condition: PgConditionStep<
                                      PgSelectStep<any>
                                    >,
                                    val,
                                  ) {
                                    if (val.getRaw().evalIs(null)) {
                                      $condition.where({
                                        type: "attribute",
                                        attribute: attributeName,
                                        callback: (expression) =>
                                          sql`${expression} is null`,
                                      });
                                    } else {
                                      $condition.where({
                                        type: "attribute",
                                        attribute: attributeName,
                                        callback: (expression) =>
                                          sql`${expression} = ${$condition.placeholder(
                                            val.get(),
                                            attribute.codec,
                                          )}`,
                                      });
                                    }
                                  },
                                [attribute, attributeName, sql],
                              ),
                            },
                          ),
                        },
                        `Adding condition argument for ${codec.name}' ${attributeName} attribute`,
                      );
                      return memo;
                    },
                    Object.create(null),
                  );
                },
              }),
              `Adding condition type for ${codec.name}.`,
              // TODO:
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
