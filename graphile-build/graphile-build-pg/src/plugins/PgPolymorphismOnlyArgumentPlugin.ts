import type {
  PgCodec,
  PgCodecPolymorphismRelationalTypeSpec,
  PgUnionAllQueryBuilderCallback,
  PgUnionAllStep,
} from "@dataplan/pg";
import type {
  ConnectionStep,
  FieldArgs,
  GrafastFieldConfigArgumentMap,
  Maybe,
} from "grafast";
import { EXPORTABLE } from "graphile-build";
import type { GraphileConfig } from "graphile-config";
import type { GraphQLEnumType, GraphQLFieldConfigArgumentMap } from "graphql";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgPolymorphismOnlyArgumentPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface Inflection {
      pgPolymorphismEnumType(pgCodec: PgCodec): string;
      pgPolymorphismOnlyArgument(pgCodec: PgCodec): string;
    }
    interface ScopeEnum {
      pgPolymorphismEnumForInterfaceSpec?: Build["pgResourcesByPolymorphicTypeName"] extends Record<
        any,
        infer U
      >
        ? U
        : never;
      pgPolymorphismEnumForRelationalTypes?: {
        [typeKey: string]: PgCodecPolymorphismRelationalTypeSpec;
      };
    }
  }
}

export const PgPolymorphismOnlyArgumentPlugin: GraphileConfig.Plugin = {
  name: "PgPolymorphismOnlyArgumentPlugin",
  description:
    "Adds the 'only' argument to polymorphic relations to limit to only the given types",
  version,

  inflection: {
    add: {
      pgPolymorphismEnumType(options, pgCodec) {
        return this.upperCamelCase(`${this._codecName(pgCodec)}-type`);
      },
      pgPolymorphismOnlyArgument(_options, _pgCodec) {
        return "only";
      },
    },
  },

  schema: {
    hooks: {
      init(_, build) {
        const {
          inflection,
          pgResourcesByPolymorphicTypeName,
          pgCodecByPolymorphicUnionModeTypeName,
        } = build;
        // Register the types
        for (const [polymorphicTypeName, spec] of Object.entries(
          pgResourcesByPolymorphicTypeName,
        )) {
          if (spec.type === "interface") {
            const codec =
              pgCodecByPolymorphicUnionModeTypeName[polymorphicTypeName];
            const enumTypeName = inflection.pgPolymorphismEnumType(codec);
            build.registerEnumType(
              enumTypeName,
              {
                pgCodec: codec,
                pgPolymorphismEnumForInterfaceSpec: spec,
              },
              () => ({ values: Object.create(null) }),
              'Adding enum type for union-mode interface type "' +
                codec.name +
                '" in PgPolymorphismOnlyArgumentPlugin',
            );
          }
        }
        for (const codec of build.allPgCodecs) {
          if (codec.polymorphism) {
            const enumTypeName = inflection.pgPolymorphismEnumType(codec);
            switch (codec.polymorphism.mode) {
              case "single": {
                break;
              }
              case "relational": {
                const { types } = codec.polymorphism;
                build.registerEnumType(
                  enumTypeName,
                  {
                    pgCodec: codec,
                    pgPolymorphismEnumForRelationalTypes: types,
                  },
                  () => ({ values: Object.create(null) }),
                  'Adding enum type for relational polymorphic type "' +
                    codec.name +
                    '" in PgPolymorphismOnlyArgumentPlugin',
                );
                break;
              }
              case "union": {
                break;
              }
              default: {
                break;
              }
            }
          }
        }
        return _;
      },

      GraphQLEnumType_values(values, build, context) {
        const { inflection } = build;
        const {
          scope: {
            pgPolymorphismEnumForInterfaceSpec: spec,
            pgPolymorphismEnumForRelationalTypes: types,
          },
        } = context;

        // ENHANCE: Currently GraphQL.js doesn't allow `values` to be a callback,
        // so we can't be sure that we only add types that will exist at runtime.
        if (spec) {
          for (const resource of spec.resources) {
            const typeName = inflection.tableType(resource.codec);
            const type = true; // getTypeByName(typeName);
            if (type) {
              values[typeName] = { value: typeName };
            }
          }
        }
        if (types) {
          for (const { name: typeName } of Object.values(types)) {
            const type = true; // getTypeByName(typeName);
            if (type) {
              values[typeName] = { value: typeName };
            }
          }
        }
        return values;
      },

      GraphQLObjectType_fields_field_args: makeFieldsHook(false),
      GraphQLInterfaceType_fields_field_args: makeFieldsHook(true),
    },
  },
};
function makeFieldsHook(isInterface: boolean) {
  return (
    args: GrafastFieldConfigArgumentMap | GraphQLFieldConfigArgumentMap,

    build: GraphileBuild.Build,
    context:
      | GraphileBuild.ContextObjectFieldsFieldArgs
      | GraphileBuild.ContextInterfaceFieldsFieldArgs,
  ) => {
    const {
      getTypeByName,
      graphql: { GraphQLList, GraphQLNonNull },
      grafast: { lambda },
      inflection,
    } = build;
    const {
      scope: {
        pgFieldResource,
        pgFieldCodec,
        isPgFieldConnection,
        isPgFieldSimpleCollection,
      },
    } = context;
    if (!(isPgFieldConnection || isPgFieldSimpleCollection)) {
      return args;
    }
    const codec: PgCodec | undefined = pgFieldCodec ?? pgFieldResource?.codec;
    if (!codec || !codec.polymorphism) {
      return args;
    }
    const enumTypeName = inflection.pgPolymorphismEnumType(codec);
    const enumType = getTypeByName(enumTypeName) as GraphQLEnumType;
    if (!enumType) {
      return args;
    }
    const argName = inflection.pgPolymorphismOnlyArgument(codec);
    if (codec.polymorphism.mode === "union") {
      args = build.extend(
        args,
        {
          [argName]: {
            type: new GraphQLList(new GraphQLNonNull(enumType)),
            description: "Filter results to only those of the given types",
            deprecationReason: "EXPERIMENTAL",
            ...(isInterface
              ? null
              : {
                  applyPlan: isPgFieldConnection
                    ? EXPORTABLE(
                        (lambda, limitToTypes) =>
                          (
                            $parent: any,
                            $connection: ConnectionStep<
                              any,
                              any,
                              PgUnionAllStep,
                              any
                            >,
                            fieldArgs: FieldArgs,
                          ) => {
                            const $union = $connection.getSubplan();
                            const $ltt = fieldArgs.getRaw();
                            $union.apply(lambda($ltt, limitToTypes));
                          },
                        [lambda, limitToTypes],
                      )
                    : EXPORTABLE(
                        (lambda, limitToTypes) =>
                          (
                            $parent: any,
                            $union: PgUnionAllStep,
                            fieldArgs: FieldArgs,
                          ) => {
                            const $ltt = fieldArgs.getRaw();
                            $union.apply(lambda($ltt, limitToTypes));
                          },
                        [lambda, limitToTypes],
                      ),
                }),
          },
        },
        `Adding "only" argument to union interface polymorphic connection/list field ${context.Self.name}.${context.scope.fieldName}`,
      );
    }

    return args;
  };
}

function limitToTypes(ltt: Maybe<string[]>): PgUnionAllQueryBuilderCallback {
  if (ltt) {
    return (qb) => qb.limitToTypes(ltt);
  } else {
    return () => {};
  }
}
