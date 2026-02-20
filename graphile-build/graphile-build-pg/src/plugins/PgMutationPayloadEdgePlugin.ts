import "graphile-config";

import type {
  PgClassSingleStep,
  PgCodecWithAttributes,
  PgResourceUnique,
} from "@dataplan/pg";
import { PgDeleteSingleStep, pgSelectFromRecord } from "@dataplan/pg";
import type { FieldArgs, ObjectStep } from "grafast";
import { connection, constant, EdgeStep, first } from "grafast";
import type { GraphQLEnumType, GraphQLObjectType } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";

import { tagToString } from "../utils.ts";
import { version } from "../version.ts";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgMutationPayloadEdgePlugin: true;
    }
  }

  namespace GraphileBuild {
    interface Inflection {
      tableEdgeField(this: Inflection, codec: PgCodecWithAttributes): string;
    }

    interface ScopeObjectFieldsField {
      isPgMutationPayloadEdgeField?: boolean;
    }
  }
}

export const PgMutationPayloadEdgePlugin: GraphileConfig.Plugin = {
  name: "PgMutationPayloadEdgePlugin",
  description:
    "Adds 'edge' field to mutation payloads to aid with Relay pagination",
  version: version,

  inflection: {
    add: {
      tableEdgeField(options, codec) {
        return this.camelCase(this.tableEdgeType(codec));
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          extend,
          getTypeByName,
          graphql: { GraphQLList, GraphQLNonNull },
          inflection,
        } = build;
        const {
          scope: { isMutationPayload, pgTypeResource, pgCodec: _pgCodec },
          fieldWithHooks,
          Self,
        } = context;

        const pgCodec = pgTypeResource?.codec ?? _pgCodec;

        if (
          !isMutationPayload ||
          !pgCodec ||
          !pgCodec.attributes ||
          pgCodec.isAnonymous
        ) {
          return fields;
        }

        if (pgTypeResource?.parameters && !pgTypeResource.isUnique) {
          return fields;
        }

        if (
          pgTypeResource
            ? !build.behavior.pgResourceMatches(pgTypeResource, "connection")
            : !build.behavior.pgCodecMatches(pgCodec, "connection")
        ) {
          return fields;
        }

        const resource = build.pgTableResource(pgCodec);
        if (!resource) {
          return fields;
        }

        const pk = (resource.uniques as PgResourceUnique[])?.find(
          (u) => u.isPrimary,
        );
        if (!pk) {
          return fields;
        }
        const pkAttributes = pk.attributes;

        const TableType = build.getGraphQLTypeByPgCodec(pgCodec, "output") as
          | GraphQLObjectType<any, any>
          | undefined;
        if (!TableType) {
          return fields;
        }

        const tableTypeName = TableType.name;
        const tableOrderByTypeName = inflection.orderByType(tableTypeName);
        const TableOrderByType = getTypeByName(tableOrderByTypeName) as
          | GraphQLEnumType
          | undefined;
        if (!TableOrderByType) {
          return fields;
        }
        const TableEdgeType = getTypeByName(
          inflection.tableEdgeType(resource.codec),
        ) as GraphQLObjectType | undefined;
        if (!TableEdgeType) {
          return fields;
        }

        const fieldName = inflection.tableEdgeField(resource.codec);
        const primaryKeyAsc = inflection.builtin("PRIMARY_KEY_ASC");
        const defaultValueEnum =
          TableOrderByType.getValues().find((v) => v.name === primaryKeyAsc) ||
          TableOrderByType.getValues()[0];

        const deprecationReason = tagToString(
          resource.extensions?.tags?.deprecated,
        );
        return extend(
          fields,
          {
            [fieldName]: fieldWithHooks(
              {
                fieldName,
                isPgMutationPayloadEdgeField: true,
                pgCodec: pgCodec,
              },
              () => ({
                description: build.wrapDescription(
                  `An edge for our \`${tableTypeName}\`. May be used by Relay 1.`,
                  "field",
                ),
                type: TableEdgeType,
                args: {
                  orderBy: {
                    description: build.wrapDescription(
                      `The method to use when ordering \`${tableTypeName}\`.`,
                      "arg",
                    ),
                    type: new GraphQLNonNull(
                      new GraphQLList(new GraphQLNonNull(TableOrderByType)),
                    ),
                    defaultValue: defaultValueEnum
                      ? [defaultValueEnum.value]
                      : null,
                  },
                },
                plan: EXPORTABLE(
                  (pgMutationPayloadEdge, pkAttributes, resource) =>
                    (
                      $mutation: ObjectStep<{
                        result: PgClassSingleStep;
                      }>,
                      fieldArgs: FieldArgs,
                    ) =>
                      pgMutationPayloadEdge(
                        resource,
                        pkAttributes,
                        $mutation,
                        fieldArgs,
                      ),
                  [pgMutationPayloadEdge, pkAttributes, resource],
                ),
                ...(deprecationReason ? { deprecationReason } : null),
              }),
            ),
          },
          `Adding edge field for table ${pgCodec.name} to mutation payload '${Self.name}'`,
        );
      },
    },
  },
};

const getPgSelectSingleFromMutationResult = EXPORTABLE(
  (PgDeleteSingleStep, pgSelectFromRecord) =>
    (
      resource: Exclude<
        ReturnType<GraphileBuild.Build["pgTableResource"]>,
        null | undefined
      >,
      pkAttributes: readonly string[],
      $mutation: ObjectStep<{
        result: PgClassSingleStep;
      }>,
    ) => {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) return null;
      if ($result instanceof PgDeleteSingleStep) {
        return pgSelectFromRecord($result.resource, $result.record());
      } else {
        const spec = pkAttributes.reduce((memo, attributeName) => {
          memo[attributeName] = $result.get(attributeName);
          return memo;
        }, Object.create(null));
        return resource.find(spec);
      }
    },
  [PgDeleteSingleStep, pgSelectFromRecord],
  "getPgSelectSingleFromMutationResult",
);

// ENHANCE: review this plan, it feels overly complex and somewhat hacky.
const pgMutationPayloadEdge = EXPORTABLE(
  (
    EdgeStep,
    connection,
    constant,
    first,
    getPgSelectSingleFromMutationResult,
  ) =>
    (
      resource: Exclude<
        ReturnType<GraphileBuild.Build["pgTableResource"]>,
        null | undefined
      >,
      pkAttributes: readonly string[],
      $mutation: ObjectStep<{
        result: PgClassSingleStep;
      }>,
      fieldArgs: FieldArgs,
    ) => {
      const $select = getPgSelectSingleFromMutationResult(
        resource,
        pkAttributes,
        $mutation,
      );
      if (!$select) return constant(null);
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      return new EdgeStep($connection, first($connection));
    },
  [EdgeStep, connection, constant, first, getPgSelectSingleFromMutationResult],
  "pgMutationPayloadEdge",
);
