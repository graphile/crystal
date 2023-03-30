import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgSelectParsedCursorStep,
  PgSelectSingleStep,
  PgSelectStep,
} from "@dataplan/pg";
import type { ConnectionStep, GraphileFieldConfigArgumentMap } from "grafast";
import { EXPORTABLE } from "graphile-export";

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

// TODO: rename this, it's not just for connections
export const PgConnectionArgFirstLastBeforeAfterPlugin: GraphileConfig.Plugin =
  {
    name: "PgConnectionArgFirstLastBeforeAfterPlugin",
    description:
      "Adds the 'first', 'last', 'before' and 'after' arguments to connection fields",
    version: version,

    schema: {
      hooks: {
        GraphQLObjectType_fields_field_args: commonFn,
        GraphQLInterfaceType_fields_field_args: commonFn,
      },
    },
  };

function commonFn(
  args: GraphileFieldConfigArgumentMap<any, any, any, any>,
  build: GraphileBuild.Build,
  context:
    | GraphileBuild.ContextObjectFieldsFieldArgs
    | GraphileBuild.ContextInterfaceFieldsFieldArgs,
) {
  const {
    extend,
    getTypeByName,
    graphql: { GraphQLInt },
  } = build;
  const { scope, Self } = context;

  const {
    fieldName,
    isPgFieldConnection,
    isPgFieldSimpleCollection,
    pgResource,
    pgFieldCodec,
  } = scope;

  if (!(isPgFieldConnection || isPgFieldSimpleCollection)) {
    return args;
  }

  const codec = pgFieldCodec ?? pgResource?.codec;
  const isSuitableSource = pgResource && !pgResource.isUnique;
  const isSuitableCodec =
    codec &&
    (isSuitableSource ||
      (!pgResource && codec?.polymorphism?.mode === "union"));

  if (!isSuitableCodec) {
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
                PgSelectSingleStep<any>,
                PgSelectParsedCursorStep,
                PgSelectStep<any>
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
                      PgSelectSingleStep<any>,
                      PgSelectParsedCursorStep,
                      PgSelectStep<any>
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
                PgSelectSingleStep<any>,
                PgSelectParsedCursorStep,
                PgSelectStep<any>
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
                      PgSelectSingleStep<any>,
                      PgSelectParsedCursorStep,
                      PgSelectStep<any>
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
                      PgSelectSingleStep<any>,
                      PgSelectParsedCursorStep,
                      PgSelectStep<any>
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
}
