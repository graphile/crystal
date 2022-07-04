import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgSelectParsedCursorStep,
  PgSelectStep,
  PgSelectSingleStep,
} from "@dataplan/pg";
import type {
  ConnectionStep,
  GraphileFieldConfigArgumentMap,
} from "dataplanner";
import { EXPORTABLE } from "graphile-export";

import { version } from "../index.js";

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
export const PgConnectionArgFirstLastBeforeAfterPlugin: GraphileConfig.Plugin =
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
                applyPlan: EXPORTABLE(
                  () =>
                    function plan(
                      _: any,
                      $connection: ConnectionStep<
                        PgSelectSingleStep<any, any, any, any>,
                        PgSelectParsedCursorStep,
                        PgSelectStep<any, any, any, any>
                      >,
                      arg,
                    ) {
                      $connection.setFirst(arg.getRaw());
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
                      applyPlan: EXPORTABLE(
                        () =>
                          function plan(
                            _: any,
                            $connection: ConnectionStep<
                              PgSelectSingleStep<any, any, any, any>,
                              PgSelectParsedCursorStep,
                              PgSelectStep<any, any, any, any>
                            >,
                            val,
                          ) {
                            $connection.setLast(val.getRaw());
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
                applyPlan: EXPORTABLE(
                  () =>
                    function plan(
                      _: any,
                      $connection: ConnectionStep<
                        PgSelectSingleStep<any, any, any, any>,
                        PgSelectParsedCursorStep,
                        PgSelectStep<any, any, any, any>
                      >,
                      val,
                    ) {
                      $connection.setOffset(val.getRaw());
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
                      applyPlan: EXPORTABLE(
                        () =>
                          function plan(
                            _: any,
                            $connection: ConnectionStep<
                              PgSelectSingleStep<any, any, any, any>,
                              PgSelectParsedCursorStep,
                              PgSelectStep<any, any, any, any>
                            >,
                            val,
                          ) {
                            $connection.setBefore(val.getRaw());
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
                      applyPlan: EXPORTABLE(
                        () =>
                          function plan(
                            _: any,
                            $connection: ConnectionStep<
                              PgSelectSingleStep<any, any, any, any>,
                              PgSelectParsedCursorStep,
                              PgSelectStep<any, any, any, any>
                            >,
                            val,
                          ) {
                            $connection.setAfter(val.getRaw());
                          },
                        [],
                      ),
                    },
                  }
                : null),
            } as GraphileFieldConfigArgumentMap<any, any, any, any>,
            isPgFieldConnection
              ? `Adding connection pagination args to field '${fieldName}' of '${Self.name}'`
              : `Adding simple collection args to field '${fieldName}' of '${Self.name}'`,
          );
        },
      },
    },
  };
