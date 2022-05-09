import "./PgTablesPlugin";

import type { PgSelectPlan, PgSelectSinglePlan } from "@dataplan/pg";
import type { ConnectionPlan, InputPlan } from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import "graphile-plugin";

import { version } from "../index";

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

// TODO: rename this, it's not just for connections
export const PgConnectionArgFirstLastBeforeAfterPlugin: GraphilePlugin.Plugin =
  {
    name: "PgConnectionArgFirstLastBeforeAfterPlugin",
    description:
      "Adds the 'first', 'last', 'before' and 'after' arguments to connection fields",
    version: version,

    schema: {
      hooks: {
        GraphQLObjectType_fields_field_args(args, build, context) {
          const {
            extend,
            getTypeByName,
            graphql: { GraphQLInt },
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

          if (
            !(isPgFieldConnection || isPgFieldSimpleCollection) ||
            !pgSource ||
            pgSource.isUnique
          ) {
            return args;
          }
          const Cursor = getTypeByName("Cursor");

          return extend(
            args,
            {
              first: {
                description: build.wrapDescription(
                  "Only read the first `n` values of the set.",
                  "arg",
                ),
                type: GraphQLInt,
                plan: EXPORTABLE(
                  () =>
                    function plan(
                      _: any,
                      $connection: ConnectionPlan<
                        PgSelectSinglePlan<any, any, any, any>,
                        PgSelectPlan<any, any, any, any>
                      >,
                      $value: InputPlan,
                    ) {
                      $connection.setFirst($value);
                    },
                  [],
                ),
              },
              ...(isPgFieldConnection
                ? {
                    last: {
                      description: build.wrapDescription(
                        "Only read the last `n` values of the set.",
                        "arg",
                      ),
                      type: GraphQLInt,
                      plan: EXPORTABLE(
                        () =>
                          function plan(
                            _: any,
                            $connection: ConnectionPlan<
                              PgSelectSinglePlan<any, any, any, any>,
                              PgSelectPlan<any, any, any, any>
                            >,
                            $value: InputPlan,
                          ) {
                            $connection.setLast($value);
                          },
                        [],
                      ),
                    },
                  }
                : null),
              offset: {
                description: build.wrapDescription(
                  isPgFieldConnection
                    ? "Skip the first `n` values from our `after` cursor, an alternative to cursor based pagination. May not be used with `last`."
                    : "Skip the first `n` values.",
                  "arg",
                ),
                type: GraphQLInt,
                plan: EXPORTABLE(
                  () =>
                    function plan(
                      _: any,
                      $connection: ConnectionPlan<
                        PgSelectSinglePlan<any, any, any, any>,
                        PgSelectPlan<any, any, any, any>
                      >,
                      $value: InputPlan,
                    ) {
                      $connection.setOffset($value);
                    },
                  [],
                ),
              },
              ...(isPgFieldConnection
                ? {
                    before: {
                      description: build.wrapDescription(
                        "Read all values in the set before (above) this cursor.",
                        "arg",
                      ),
                      type: Cursor,
                      plan: EXPORTABLE(
                        () =>
                          function plan(
                            _: any,
                            $connection: ConnectionPlan<
                              PgSelectSinglePlan<any, any, any, any>,
                              PgSelectPlan<any, any, any, any>
                            >,
                            $value: InputPlan,
                          ) {
                            $connection.setBefore($value);
                          },
                        [],
                      ),
                    },
                    after: {
                      description: build.wrapDescription(
                        "Read all values in the set after (below) this cursor.",
                        "arg",
                      ),
                      type: Cursor,
                      plan: EXPORTABLE(
                        () =>
                          function plan(
                            _: any,
                            $connection: ConnectionPlan<
                              PgSelectSinglePlan<any, any, any, any>,
                              PgSelectPlan<any, any, any, any>
                            >,
                            $value: InputPlan,
                          ) {
                            $connection.setAfter($value);
                          },
                        [],
                      ),
                    },
                  }
                : null),
            },
            isPgFieldConnection
              ? `Adding connection pagination args to field '${fieldName}' of '${Self.name}'`
              : `Adding simple collection args to field '${fieldName}' of '${Self.name}'`,
          );
        },
      },
    },
  };
