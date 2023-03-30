import "graphile-build";
import "graphile-config";

import type {
  PgClassSingleStep,
  PgCodec,
  PgResourceUnique,
} from "@dataplan/pg";
import { PgDeleteStep, pgSelectFromRecord } from "@dataplan/pg";
import type { FieldArgs, FieldInfo, ObjectStep } from "grafast";
import { connection, constant, EdgeStep } from "grafast";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLEnumType, GraphQLObjectType } from "graphql";

import { getBehavior } from "../behavior.js";
import { tagToString } from "../utils.js";
import { version } from "../version.js";
import { applyOrderToPlan } from "./PgConnectionArgOrderByPlugin.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      // TODO: move this somewhere more shared
      tableEdgeField(
        this: Inflection,
        codec: PgCodec<any, any, any, any, any, any, any>,
      ): string;
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
          options: { simpleCollections },
        } = build;
        const {
          scope: { isMutationPayload, pgTypeSource, pgCodec: _pgCodec },
          fieldWithHooks,
          Self,
        } = context;

        const pgCodec = pgTypeSource?.codec ?? _pgCodec;

        if (
          !isMutationPayload ||
          !pgCodec ||
          !pgCodec.columns ||
          pgCodec.isAnonymous
        ) {
          return fields;
        }

        if (pgTypeSource?.parameters && !pgTypeSource.isUnique) {
          return fields;
        }

        const behavior = getBehavior(pgCodec.extensions);
        const defaultBehavior =
          simpleCollections === "both"
            ? "connection list"
            : simpleCollections === "only"
            ? "list"
            : "connection";

        // TODO: this is a rule on the codec; we must ensure that everywhere
        // that uses 'list'/'connection' respects the codec behaviors
        if (
          !build.behavior.matches(behavior, "*:connection", defaultBehavior)
        ) {
          return fields;
        }

        const sources = Object.values(build.input.pgRegistry.pgResources).filter(
          (source) => {
            if (source.codec !== pgCodec) return false;
            if (source.parameters) return false;
            return true;
          },
        );

        if (sources.length !== 1) {
          return fields;
        }

        const source = sources[0];

        const pk = (source.uniques as PgResourceUnique[])?.find(
          (u) => u.isPrimary,
        );
        if (!pk) {
          return fields;
        }
        const pkColumns = pk.columns;

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
          inflection.tableEdgeType(source.codec),
        ) as GraphQLObjectType | undefined;
        if (!TableEdgeType) {
          return fields;
        }

        const fieldName = inflection.tableEdgeField(source.codec);
        const primaryKeyAsc = inflection.builtin("PRIMARY_KEY_ASC");
        const defaultValueEnum =
          TableOrderByType.getValues().find((v) => v.name === primaryKeyAsc) ||
          TableOrderByType.getValues()[0];

        return extend(
          fields,
          {
            [fieldName]: fieldWithHooks(
              {
                fieldName,
                // TODO: fieldBehaviorScope: `...`,
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
                deprecationReason: tagToString(
                  source.extensions?.tags?.deprecated,
                ),
                // TODO: review this plan, it feels overly complex and somewhat hacky.
                plan: EXPORTABLE(
                  (
                    EdgeStep,
                    PgDeleteStep,
                    applyOrderToPlan,
                    connection,
                    constant,
                    pgSelectFromRecord,
                    pkColumns,
                    source,
                    tableOrderByTypeName,
                  ) =>
                    function plan(
                      $mutation: ObjectStep<{
                        result: PgClassSingleStep<any>;
                      }>,
                      args: FieldArgs,
                      info: FieldInfo,
                    ) {
                      const $result = $mutation.getStepForKey("result", true);
                      if (!$result) {
                        return constant(null);
                      }

                      const $select = (() => {
                        if ($result instanceof PgDeleteStep) {
                          return pgSelectFromRecord(
                            $result.source,
                            $result.record(),
                          );
                        } else {
                          const spec = pkColumns.reduce((memo, columnName) => {
                            memo[columnName] = $result.get(columnName);
                            return memo;
                          }, Object.create(null));
                          return source.find(spec);
                        }
                      })();

                      // Perform ordering
                      const $value = args.getRaw("orderBy");
                      applyOrderToPlan(
                        $select,
                        $value,
                        info.schema.getType(
                          tableOrderByTypeName,
                        ) as GraphQLEnumType,
                      );

                      const $connection = connection($select) as any;
                      const $single = $select.single();
                      return new EdgeStep($connection, $single);
                    },
                  [
                    EdgeStep,
                    PgDeleteStep,
                    applyOrderToPlan,
                    connection,
                    constant,
                    pgSelectFromRecord,
                    pkColumns,
                    source,
                    tableOrderByTypeName,
                  ],
                ),
              }),
            ),
          },
          `Adding edge field for table ${pgCodec.name} to mutation payload '${Self.name}'`,
        );
      },
    },
  },
};
