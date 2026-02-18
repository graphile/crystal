import "./PgTablesPlugin.ts";
import "graphile-config";

import type { PgSelectSingleStep, PgSelectStep } from "@dataplan/pg";
import type {
  ConnectionStep,
  FieldArg,
  GrafastFieldConfigArgumentMap,
} from "grafast";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.ts";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgFirstLastBeforeAfterArgsPlugin: true;
    }
  }

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

export const PgFirstLastBeforeAfterArgsPlugin: GraphileConfig.Plugin = {
  name: "PgFirstLastBeforeAfterArgsPlugin",
  description:
    "Adds the 'first', 'last', 'before' and 'after' arguments to connection and list fields",
  version: version,

  schema: {
    entityBehavior: {
      pgResource: "resource:connection:backwards",
    },
    hooks: {
      GraphQLObjectType_fields_field_args: commonFn,
      GraphQLInterfaceType_fields_field_args: commonFn,
    },
  },
};

const applyFirstArg = EXPORTABLE(
  () =>
    function applyFirstPlan(
      _: any,
      $connection: ConnectionStep<
        any,
        PgSelectSingleStep,
        any,
        any,
        null | readonly any[],
        PgSelectStep
      >,
      arg: FieldArg,
    ) {
      $connection.setFirst(arg.getRaw());
    },
  [],
);

const applyLastArg = EXPORTABLE(
  () =>
    function plan(
      _: any,
      $connection: ConnectionStep<
        any,
        PgSelectSingleStep,
        any,
        any,
        null | readonly any[],
        PgSelectStep
      >,
      val: FieldArg,
    ) {
      $connection.setLast(val.getRaw());
    },
  [],
);

const applyOffsetArg = EXPORTABLE(
  () =>
    function plan(
      _: any,
      $connection: ConnectionStep<
        any,
        PgSelectSingleStep,
        any,
        any,
        null | readonly any[],
        PgSelectStep
      >,
      val: FieldArg,
    ) {
      $connection.setOffset(val.getRaw());
    },
  [],
);

const applyBeforeArg = EXPORTABLE(
  () =>
    function plan(
      _: any,
      $connection: ConnectionStep<
        any,
        PgSelectSingleStep,
        any,
        any,
        null | readonly any[],
        PgSelectStep
      >,
      val: FieldArg,
    ) {
      $connection.setBefore(val.getRaw());
    },
  [],
);

const applyAfterArg = EXPORTABLE(
  () =>
    function plan(
      _: any,
      $connection: ConnectionStep<
        any,
        PgSelectSingleStep,
        any,
        any,
        null | readonly any[],
        PgSelectStep
      >,
      val: FieldArg,
    ) {
      $connection.setAfter(val.getRaw());
    },
  [],
);

function commonFn(
  args: GrafastFieldConfigArgumentMap,
  build: GraphileBuild.Build,
  context:
    | GraphileBuild.ContextObjectFieldsFieldArgs
    | GraphileBuild.ContextInterfaceFieldsFieldArgs,
) {
  const {
    extend,
    getTypeByName,
    inflection,
    graphql: { GraphQLInt },
  } = build;
  const { scope, Self } = context;

  const {
    fieldName,
    isPgFieldConnection,
    isPgFieldSimpleCollection,
    pgFieldResource: pgResource,
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

  const Cursor = getTypeByName(inflection.builtin("Cursor"));

  const canPaginateBackwards =
    isPgFieldConnection &&
    (!pgResource ||
      build.behavior.pgResourceMatches(
        pgResource,
        "resource:connection:backwards",
      ));

  return extend(
    args,
    {
      first: {
        description: build.wrapDescription(
          "Only read the first `n` values of the set.",
          "arg",
        ),
        type: GraphQLInt,
        applyPlan: applyFirstArg,
      },
      ...(canPaginateBackwards
        ? {
            last: {
              description: build.wrapDescription(
                "Only read the last `n` values of the set.",
                "arg",
              ),
              type: GraphQLInt,
              applyPlan: applyLastArg,
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
        applyPlan: applyOffsetArg,
      },
      ...(canPaginateBackwards
        ? {
            before: {
              description: build.wrapDescription(
                "Read all values in the set before (above) this cursor.",
                "arg",
              ),
              type: Cursor,
              applyPlan: applyBeforeArg,
            },
          }
        : null),
      ...(isPgFieldConnection
        ? {
            after: {
              description: build.wrapDescription(
                "Read all values in the set after (below) this cursor.",
                "arg",
              ),
              type: Cursor,
              applyPlan: applyAfterArg,
            },
          }
        : null),
    } as GrafastFieldConfigArgumentMap,
    isPgFieldConnection
      ? `Adding connection pagination args to field '${fieldName}' of '${Self.name}'`
      : `Adding simple collection args to field '${fieldName}' of '${Self.name}'`,
  );
}
