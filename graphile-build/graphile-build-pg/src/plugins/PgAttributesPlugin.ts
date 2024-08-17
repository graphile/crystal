import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgClassExpressionStep,
  PgCodec,
  PgCodecAttribute,
  PgCodecAttributes,
  PgCodecList,
  PgCodecWithAttributes,
  PgConditionStep,
  PgSelectSingleStep,
  PgSelectStep,
} from "@dataplan/pg";
import { pgSelectFromRecords, pgSelectSingleFromRecord } from "@dataplan/pg";
import type { GrafastFieldConfig, SetterStep } from "grafast";
import { each } from "grafast";
import type { GraphQLFieldConfigMap, GraphQLOutputType } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgAttributesPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BehaviorStrings {
      "-condition:attribute:filterBy": true;
      "-attribute:select": true;
      "-attribute:base": true;
      "-attribute:insert": true;
      "-attribute:update": true;
      "-attribute:filterBy": true;
      "-attribute:orderBy": true;
    }
    interface Build {
      pgResolveOutputType(
        codec: PgCodec,
        notNull?: boolean,
      ): [baseCodec: PgCodec, resolvedType: GraphQLOutputType] | null;
    }

    interface Inflection {
      /**
       * Given a attributeName on a PgCodec's attributes, should return the field
       * name to use to represent this attribute (both for input and output).
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behavior.
       */
      _attributeName(
        this: GraphileBuild.Inflection,
        details: {
          codec: PgCodecWithAttributes;
          attributeName: string;
          skipRowId?: boolean;
        },
      ): string;

      /**
       * Takes a codec and the list of attribute names from that codec and turns
       * it into a joined list.
       */
      _joinAttributeNames(
        this: GraphileBuild.Inflection,
        codec: PgCodecWithAttributes,
        names: readonly string[],
      ): string;

      /**
       * The field name for a given attribute on that pg_class' table type. May
       * also be used in other places (e.g. the Input or Patch type associated
       * with the table).
       */
      attribute(
        this: GraphileBuild.Inflection,
        details: {
          attributeName: string;
          codec: PgCodecWithAttributes;
        },
      ): string;
    }

    interface ScopeInputObject {
      isInputType?: boolean;
      isPgPatch?: boolean;
      isPgBaseInput?: boolean;
      isPgRowType?: boolean;
      isPgCompoundType?: boolean;
      pgAttribute?: PgCodecAttribute;
    }
  }
}

function processAttribute(
  fields: GraphQLFieldConfigMap<any, any>,
  build: GraphileBuild.Build,
  context:
    | GraphileBuild.ContextObjectFields
    | GraphileBuild.ContextInterfaceFields,
  attributeName: string,
  overrideName?: string,
  isNotNull?: boolean,
): void {
  const { extend, inflection } = build;

  const {
    scope: { pgCodec: rawPgCodec },
    Self,
  } = context;
  if (!rawPgCodec || !rawPgCodec.attributes) {
    return;
  }

  const pgCodec = rawPgCodec as PgCodecWithAttributes;

  const isInterface = context.type === "GraphQLInterfaceType";

  const attribute = pgCodec.attributes[attributeName];

  if (
    !build.behavior.pgCodecAttributeMatches(
      [pgCodec, attributeName],
      "attribute:select",
    )
  ) {
    // Don't allow selecting this attribute.
    return;
  }

  const attributeFieldName =
    overrideName ??
    inflection.attribute({
      attributeName,
      codec: pgCodec,
    });
  const resolveResult = build.pgResolveOutputType(
    attribute.codec,
    isNotNull || attribute.notNull || attribute.extensions?.tags?.notNull,
  );
  if (!resolveResult) {
    console.warn(
      `Couldn't find a 'output' variant for PgCodec ${
        pgCodec.name
      }'s '${attributeName}' attribute (${
        attribute.codec.name
      }; array=${!!attribute.codec.arrayOfCodec}, domain=${!!attribute.codec
        .domainOfCodec}, enum=${!!(attribute.codec as any).values})`,
    );
    return;
  }
  const [baseCodec, type] = resolveResult;

  const fieldSpec: GrafastFieldConfig<any, any, any, any, any> = {
    description: attribute.description,
    type: type as GraphQLOutputType,
  };

  const resource = baseCodec.attributes
    ? build.pgTableResource(baseCodec as PgCodecWithAttributes, false)
    : null;
  if (baseCodec.attributes && !resource) {
    // We can't load codecs with attributes unless we know the executor.
    return;
  }

  if (!isInterface) {
    const makePlan = () => {
      // See if there's a resource to pull record types from (e.g. for relations/etc)
      if (!baseCodec.attributes) {
        // Simply get the value
        return EXPORTABLE(
          (attributeName) => ($record: PgSelectSingleStep) => {
            return $record.get(attributeName);
          },
          [attributeName],
        );
      } else {
        if (!resource) {
          // This error only exists to satisfy TypeScript
          throw new Error("This should be unreachable");
        }
        // ENHANCE: this is pretty horrible in the export; we should fix that.
        if (!attribute.codec.arrayOfCodec) {
          const notNull = attribute.notNull || attribute.codec.notNull;
          // Single record from resource
          /*
           * ENHANCE: if we refactor `PgSelectSingleStep` we can probably
           * optimise this to do inline selection and still join against
           * the base table using e.g. `(table.column).attribute =
           * joined_thing.column`
           */
          return EXPORTABLE(
            (attributeName, notNull, pgSelectSingleFromRecord, resource) =>
              ($record: PgSelectSingleStep<any>) => {
                const $plan = $record.get(attributeName);
                const $select = pgSelectSingleFromRecord(resource, $plan);
                if (notNull) {
                  $select.coalesceToEmptyObject();
                }
                $select.getClassStep().setTrusted();
                return $select;
              },
            [attributeName, notNull, pgSelectSingleFromRecord, resource],
          );
        } else if (attribute.codec.arrayOfCodec.arrayOfCodec?.arrayOfCodec) {
          throw new Error(
            "Triple nested arrays are currently unsupported... Feel free to send a PR that refactors this whole section!",
          );
        } else if (attribute.codec.arrayOfCodec.arrayOfCodec) {
          return EXPORTABLE(
            (attributeName, each, pgSelectFromRecords, resource) =>
              ($record: PgSelectSingleStep<any>) => {
                const $val = $record.get(
                  attributeName,
                ) as PgClassExpressionStep<PgCodecList<PgCodecList>, any>;
                return each($val, ($list) => {
                  const $select = pgSelectFromRecords(resource, $list);
                  $select.setTrusted();
                  return $select;
                });
              },
            [attributeName, each, pgSelectFromRecords, resource],
          );
        } else {
          // atrribute.codec.arrayOfCodec is set
          // Many records from resource
          return EXPORTABLE(
            (attributeName, pgSelectFromRecords, resource) =>
              ($record: PgSelectSingleStep<any>) => {
                const $val = $record.get(
                  attributeName,
                ) as PgClassExpressionStep<PgCodecList, any>;
                const $select = pgSelectFromRecords(resource, $val);
                $select.setTrusted();
                return $select;
              },
            [attributeName, pgSelectFromRecords, resource],
          );
        }
      }
    };
    fieldSpec.plan = makePlan() as any;
  }
  fields = extend(
    fields,
    {
      [attributeFieldName]: context.fieldWithHooks(
        {
          fieldName: attributeFieldName,
          pgFieldAttribute: attribute,
        },
        fieldSpec,
      ),
    },
    `Adding '${attributeName}' attribute field to GraphQL type '${Self.name}' (representing PgCodec '${pgCodec.name}')`,
  );
}

export const PgAttributesPlugin: GraphileConfig.Plugin = {
  name: "PgAttributesPlugin",
  description:
    "Adds PostgreSQL attributes (columns) to the relevant GraphQL object/input object types",
  version: version,
  after: ["PgTablesPlugin"],

  inflection: {
    add: {
      _attributeName(options, { attributeName, codec }) {
        const attribute = codec.attributes[attributeName];
        return this.coerceToGraphQLName(
          attribute.extensions?.tags?.name || attributeName,
        );
      },

      _joinAttributeNames(options, codec, names) {
        return names
          .map((attributeName) => {
            return this.attribute({ attributeName, codec });
          })
          .join("-and-");
      },

      attribute(options, details) {
        const attributeFieldName = this.camelCase(this._attributeName(details));
        // Avoid conflict with 'id' field used for Relay.
        return attributeFieldName === "id" && !details.codec.isAnonymous
          ? "rowId"
          : attributeFieldName;
      },
    },
  },

  schema: {
    behaviorRegistry: {
      add: {
        "-attribute:select": {
          description: "can this attribute be selected?",
          entities: ["pgCodecAttribute"],
        },
        "-attribute:insert": {
          description: "can this attribute be written on create?",
          entities: ["pgCodecAttribute"],
        },
        "-attribute:update": {
          description: "can this attribute be updated?",
          entities: ["pgCodecAttribute"],
        },
        "-attribute:base": {
          description: "should we add this attribute to the 'base' input type?",
          entities: ["pgCodecAttribute"],
        },
        "-attribute:filterBy": {
          description: "can we filter by this attribute?",
          entities: ["pgCodecAttribute"],
        },
        "-condition:attribute:filterBy": {
          description:
            "can we filter by this attribute in the `condition` argument?",
          entities: ["pgCodecAttribute"],
        },
        "-attribute:orderBy": {
          description: "can we order by this attribute?",
          entities: ["pgCodecAttribute"],
        },
      },
    },

    entityBehavior: {
      pgCodecAttribute: {
        provides: ["default"],
        before: ["inferred", "override"],
        callback(behavior, [codec, attributeName]) {
          const behaviors = new Set<GraphileBuild.BehaviorString>([
            "select",
            "base",
            "update",
            "insert",
            "filterBy",
            "orderBy",
          ]);
          const attribute = codec.attributes[attributeName];
          function walk(codec: PgCodec) {
            if (codec.arrayOfCodec) {
              behaviors.add("-condition:attribute:filterBy");
              behaviors.add(`-attribute:orderBy`);
              walk(codec.arrayOfCodec);
            } else if (codec.rangeOfCodec) {
              behaviors.add(`-condition:attribute:filterBy`);
              behaviors.add(`-attribute:orderBy`);
              walk(codec.rangeOfCodec);
            } else if (codec.domainOfCodec) {
              // No need to add a behavior for domain
              walk(codec.domainOfCodec);
            } else if (codec.attributes) {
              behaviors.add(`-condition:attribute:filterBy`);
              behaviors.add(`-attribute:orderBy`);
            } else if (codec.isBinary) {
              // Never filter, not in condition plugin nor any other
              behaviors.add(`-attribute:filterBy`);
              behaviors.add(`-attribute:orderBy`);
            } else {
              // Done
            }
          }
          walk(attribute.codec);

          return [...behaviors, behavior];
        },
      },
    },
    hooks: {
      build(build) {
        return build.extend(
          build,
          {
            pgResolveOutputType(codec, notNull) {
              return resolveOutputType(
                build as GraphileBuild.Build,
                codec,
                notNull,
              );
            },
          },
          "Adding helpers from PgAttributesPlugin",
        );
      },
      GraphQLInterfaceType_fields(fields, build, context) {
        const {
          scope: { pgCodec, pgPolymorphism },
        } = context;

        if (!pgPolymorphism || !pgCodec?.attributes) {
          return fields;
        }

        for (const attributeName in pgCodec.attributes) {
          switch (pgPolymorphism.mode) {
            case "single": {
              if (!pgPolymorphism.commonAttributes.includes(attributeName)) {
                continue;
              }
              break;
            }
            case "relational": {
              break;
            }
            case "union": {
              break;
            }
            default: {
              const never: never = pgPolymorphism;
              throw new Error(
                `Unhandled polymorphism mode ${(never as any).mode}}`,
              );
            }
          }
          processAttribute(fields, build, context, attributeName);
        }
        return fields;
      },
      GraphQLObjectType_fields(fields, build, context) {
        const {
          scope: {
            pgCodec,
            isPgClassType,
            pgPolymorphism,
            pgPolymorphicSingleTableType,
          },
        } = context;

        if (!isPgClassType || !pgCodec?.attributes) {
          return fields;
        }

        for (const attributeName in pgCodec.attributes) {
          let overrideName: string | undefined = undefined;
          let isNotNull: boolean | undefined = undefined;
          if (pgPolymorphism) {
            switch (pgPolymorphism.mode) {
              case "single": {
                const match = pgPolymorphicSingleTableType?.attributes.find(
                  (c) => c.attribute === attributeName,
                );
                if (
                  !pgPolymorphism.commonAttributes.includes(attributeName) &&
                  !match
                ) {
                  continue;
                }
                if (match?.rename) {
                  overrideName = match.rename;
                }
                isNotNull = match?.isNotNull;

                break;
              }
              case "relational": {
                break;
              }
              case "union": {
                break;
              }
              default: {
                const never: never = pgPolymorphism;
                throw new Error(
                  `Unhandled polymorphism mode ${(never as any).mode}}`,
                );
              }
            }
          }
          processAttribute(
            fields,
            build,
            context,
            attributeName,
            overrideName,
            isNotNull,
          );
        }
        return fields;
      },
      GraphQLInputObjectType_fields(fields, build, context) {
        const { extend, inflection, sql } = build;
        const {
          scope: {
            isPgRowType,
            isPgCompoundType,
            isPgPatch,
            isPgBaseInput,
            pgCodec: rawPgCodec,
            isPgCondition,
          },
          fieldWithHooks,
        } = context;
        if (
          !(isPgRowType || isPgCompoundType || isPgCondition) ||
          !rawPgCodec ||
          !rawPgCodec.attributes ||
          rawPgCodec.isAnonymous
        ) {
          return fields;
        }
        const pgCodec = rawPgCodec as PgCodecWithAttributes;
        const allAttributes = pgCodec.attributes;
        const allowedAttributes =
          pgCodec.polymorphism?.mode === "single"
            ? [
                ...pgCodec.polymorphism.commonAttributes,
                // ENHANCE: add condition input type for the underlying concrete types, which should also include something like:
                /*
                  ...(pgPolymorphicSingleTableType
                    ? pgCodec.polymorphism.types[
                        pgPolymorphicSingleTableType.typeIdentifier
                      ].attributes.map(
                        (attr) =>
                          // FIX*ME: we should be factoring in the attr.rename
                          attr.attribute,
                      )
                    : []),
                  */
              ]
            : null;
        const attributes = allowedAttributes
          ? (Object.fromEntries(
              Object.entries(allAttributes).filter(([attrName, _attr]) =>
                allowedAttributes.includes(attrName),
              ),
            ) as PgCodecAttributes)
          : allAttributes;

        return Object.entries(attributes).reduce(
          (memo, [attributeName, attribute]) =>
            build.recoverable(memo, () => {
              const fieldBehaviorScope = isPgBaseInput
                ? `attribute:base`
                : isPgPatch
                ? `attribute:update`
                : isPgCondition
                ? `condition:attribute:filterBy`
                : `attribute:insert`;

              if (
                !build.behavior.pgCodecAttributeMatches(
                  [pgCodec, attributeName],
                  fieldBehaviorScope,
                )
              ) {
                return memo;
              }

              const fieldName = inflection.attribute({
                attributeName,
                codec: pgCodec,
              });
              if (memo[fieldName]) {
                throw new Error(
                  `Two attributes produce the same GraphQL field name '${fieldName}' on input PgCodec '${pgCodec.name}'; one of them is '${attributeName}'`,
                );
              }
              const attributeType = build.getGraphQLTypeByPgCodec(
                attribute.codec,
                "input",
              );
              if (!attributeType) {
                return memo;
              }
              return extend(
                memo,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
                      fieldBehaviorScope,
                      pgCodec,
                      pgAttribute: attribute,
                      isPgConnectionConditionInputField: isPgCondition,
                    },
                    {
                      description: isPgCondition
                        ? build.wrapDescription(
                            `Checks for equality with the object’s \`${fieldName}\` field.`,
                            "field",
                          )
                        : attribute.description,
                      type: build.nullableIf(
                        isPgBaseInput ||
                          isPgPatch ||
                          isPgCondition ||
                          (!attribute.notNull &&
                            !attribute.extensions?.tags?.notNull) ||
                          attribute.hasDefault ||
                          Boolean(attribute.extensions?.tags?.hasDefault),
                        attributeType,
                      ),
                      autoApplyAfterParentInputPlan: true,
                      autoApplyAfterParentApplyPlan: true,
                      applyPlan: isPgCondition
                        ? EXPORTABLE(
                            (attribute, attributeName, sql) =>
                              function plan(
                                $condition: PgConditionStep<PgSelectStep<any>>,
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
                          )
                        : EXPORTABLE(
                            (attributeName) =>
                              function plan(
                                $insert: SetterStep<any, any>,
                                val,
                              ) {
                                $insert.set(attributeName, val.get());
                              },
                            [attributeName],
                          ),
                    },
                  ),
                },
                `Adding input object field for ${pgCodec.name}.`,
                // ERRORS: implement a more helpful error message:
                /* `You can rename this field with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                  attr,
                  {
                    name: "newNameHere",
                  },
                )}`, */
              );
            }),
          fields,
        );
      },
    },
  },
};

function resolveOutputType(
  build: GraphileBuild.Build,
  codec: PgCodec,
  notNull?: boolean,
): [baseCodec: PgCodec, resolvedType: GraphQLOutputType] | null {
  const {
    getGraphQLTypeByPgCodec,
    graphql: { GraphQLList, GraphQLNonNull, getNullableType, isOutputType },
  } = build;
  if (codec.arrayOfCodec) {
    const resolvedResult = resolveOutputType(build, codec.arrayOfCodec);
    if (!resolvedResult) {
      return null;
    }
    const [innerCodec, innerType] = resolvedResult;
    const nullableType = new GraphQLList(innerType);
    const type =
      notNull || codec.notNull
        ? new GraphQLNonNull(nullableType)
        : nullableType;
    return [innerCodec, type];
  } else {
    const baseType = getGraphQLTypeByPgCodec(codec, "output");
    if (!baseType || !isOutputType(baseType)) {
      return null;
    }
    const type =
      notNull || codec.notNull
        ? new GraphQLNonNull(getNullableType(baseType))
        : baseType;
    return [codec, type];
  }
}
