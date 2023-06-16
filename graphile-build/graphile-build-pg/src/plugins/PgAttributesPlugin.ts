import "./PgTablesPlugin.js";
import "../interfaces.js";
import "graphile-config";

import type {
  PgClassExpressionStep,
  PgCodec,
  PgCodecAttribute,
  PgCodecAttributes,
  PgCodecList,
  PgCodecWithAttributes,
  PgRegistry,
  PgSelectSingleStep,
} from "@dataplan/pg";
import {
  PgResource,
  pgSelectFromRecords,
  pgSelectSingleFromRecord,
} from "@dataplan/pg";
import type { GrafastFieldConfig, SetterStep } from "grafast";
import { each } from "grafast";
import { EXPORTABLE } from "graphile-build";
import type { GraphQLFieldConfigMap, GraphQLOutputType } from "graphql";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
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

// TODO: get rid of this! Determine the resources at build time
const getResource = EXPORTABLE(
  (PgResource) =>
    (
      registry: PgRegistry<any, any, any>,
      baseCodec: PgCodec,
      pgResources: PgResource<any, any, any, any, any>[],
      $record: PgSelectSingleStep,
    ) => {
      const executor = $record.resource.executor;
      const resource =
        pgResources.find(
          (potentialSource) =>
            // These have already been filtered by codec
            potentialSource.executor === executor,
        ) ??
        // HACK: yuck yuck yuck
        // TODO: yuck; we should not be building a PgResource on demand. We
        // should be able to detect this is necessary and add it to the
        // registry preemptively.
        new PgResource(
          registry,
          PgResource.configFromCodec(executor, baseCodec),
        );
      return resource;
    },
  [PgResource],
);

function processAttribute(
  fields: GraphQLFieldConfigMap<any, any>,
  build: GraphileBuild.Build,
  context:
    | GraphileBuild.ContextObjectFields
    | GraphileBuild.ContextInterfaceFields,
  attributeName: string,
  overrideName?: string,
): void {
  const {
    extend,
    inflection,
    input: { pgRegistry: registry },
  } = build;

  const {
    scope: { pgCodec: rawPgCodec },
  } = context;
  if (!rawPgCodec || !rawPgCodec.attributes) {
    return;
  }
  const pgCodec = rawPgCodec as PgCodecWithAttributes;

  const isInterface = context.type === "GraphQLInterfaceType";

  const attribute = pgCodec.attributes[attributeName];

  if (
    !build.behavior.pgCodecAttributeMatches(
      [pgCodec, attribute],
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
  const resolveResult = resolveOutputType(
    build,
    attribute.codec,
    attribute.notNull,
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

  if (!type) {
    // Could not determine the type, skip this field
    console.warn(
      `Could not determine the type for attribute '${attributeName}' of ${pgCodec.name}`,
    );
    return;
  }
  const fieldSpec: GrafastFieldConfig<any, any, any, any, any> = {
    description: attribute.description,
    type: type as GraphQLOutputType,
  };
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
        const pgResources = Object.values(registry.pgResources).filter(
          (potentialSource) =>
            potentialSource.codec === baseCodec && !potentialSource.parameters,
        );
        // TODO: this is pretty horrible in the export; we should fix that.
        if (!attribute.codec.arrayOfCodec) {
          const notNull = attribute.notNull || attribute.codec.notNull;
          // Single record from resource
          /*
           * TODO: if we refactor `PgSelectSingleStep` we can probably
           * optimise this to do inline selection and still join against
           * the base table using e.g. `(table.column).attribute =
           * joined_thing.column`
           */
          return EXPORTABLE(
            (
                attributeName,
                baseCodec,
                getResource,
                notNull,
                pgResources,
                pgSelectSingleFromRecord,
                registry,
              ) =>
              ($record: PgSelectSingleStep<any>) => {
                const $plan = $record.get(attributeName);
                const $select = pgSelectSingleFromRecord(
                  getResource(registry, baseCodec, pgResources, $record),
                  $plan,
                );
                if (notNull) {
                  $select.coalesceToEmptyObject();
                }
                $select.getClassStep().setTrusted();
                return $select;
              },
            [
              attributeName,
              baseCodec,
              getResource,
              notNull,
              pgResources,
              pgSelectSingleFromRecord,
              registry,
            ],
          );
        } else if (attribute.codec.arrayOfCodec.arrayOfCodec?.arrayOfCodec) {
          throw new Error(
            "Triple nested arrays are currently unsupported... Feel free to send a PR that refactors this whole section!",
          );
        } else if (attribute.codec.arrayOfCodec.arrayOfCodec) {
          return EXPORTABLE(
            (
                attributeName,
                baseCodec,
                each,
                getResource,
                pgResources,
                pgSelectFromRecords,
                registry,
              ) =>
              ($record: PgSelectSingleStep<any>) => {
                const $val = $record.get(
                  attributeName,
                ) as PgClassExpressionStep<PgCodecList<PgCodecList>, any>;
                return each($val, ($list) => {
                  const $select = pgSelectFromRecords(
                    getResource(registry, baseCodec, pgResources, $record),
                    $list,
                  );
                  $select.setTrusted();
                  return $select;
                });
              },
            [
              attributeName,
              baseCodec,
              each,
              getResource,
              pgResources,
              pgSelectFromRecords,
              registry,
            ],
          );
        } else {
          // atrribute.codec.arrayOfCodec is set
          // Many records from resource
          return EXPORTABLE(
            (
                attributeName,
                baseCodec,
                getResource,
                pgResources,
                pgSelectFromRecords,
                registry,
              ) =>
              ($record: PgSelectSingleStep<any>) => {
                const $val = $record.get(
                  attributeName,
                ) as PgClassExpressionStep<PgCodecList, any>;
                const $select = pgSelectFromRecords(
                  getResource(registry, baseCodec, pgResources, $record),
                  $val,
                );
                $select.setTrusted();
                return $select;
              },
            [
              attributeName,
              baseCodec,
              getResource,
              pgResources,
              pgSelectFromRecords,
              registry,
            ],
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
    `Adding '${attributeName}' attribute field to PgCodec '${pgCodec.name}'`,
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
    entityBehavior: {
      pgCodecAttribute: "select base update insert",
    },
    hooks: {
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
          processAttribute(fields, build, context, attributeName, overrideName);
        }
        return fields;
      },
      GraphQLInputObjectType_fields(fields, build, context) {
        const { extend, inflection } = build;
        const {
          scope: {
            isPgRowType,
            isPgCompoundType,
            isPgPatch,
            isPgBaseInput,
            pgCodec: rawPgCodec,
          },
          fieldWithHooks,
        } = context;
        if (
          !(isPgRowType || isPgCompoundType) ||
          !rawPgCodec ||
          !rawPgCodec.attributes ||
          rawPgCodec.isAnonymous
        ) {
          return fields;
        }
        const pgCodec = rawPgCodec as PgCodecWithAttributes;

        return Object.entries(pgCodec.attributes as PgCodecAttributes).reduce(
          (memo, [attributeName, attribute]) =>
            build.recoverable(memo, () => {
              const action = isPgBaseInput
                ? "base"
                : isPgPatch
                ? "update"
                : "insert";

              const fieldBehaviorScope = `attribute:${action}`;
              if (
                !build.behavior.pgCodecAttributeMatches(
                  [pgCodec, attribute],
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
                    },
                    {
                      description: attribute.description,
                      type: build.nullableIf(
                        isPgBaseInput ||
                          isPgPatch ||
                          (!attribute.notNull &&
                            !attribute.extensions?.tags?.notNull) ||
                          attribute.hasDefault ||
                          Boolean(attribute.extensions?.tags?.hasDefault),
                        attributeType,
                      ),
                      autoApplyAfterParentInputPlan: true,
                      autoApplyAfterParentApplyPlan: true,
                      applyPlan: EXPORTABLE(
                        (attributeName) =>
                          function plan($insert: SetterStep<any, any>, val) {
                            $insert.set(attributeName, val.get());
                          },
                        [attributeName],
                      ),
                    },
                  ),
                },
                `Adding input object field for ${pgCodec.name}.`,
                // TODO:
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
