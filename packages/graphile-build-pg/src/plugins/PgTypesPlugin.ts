import "graphile-build";
import "./PgBasicsPlugin";
import "../interfaces";

import type { PgHStore } from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import type { Plugin } from "graphile-plugin";
import type { GraphQLInputFieldConfigMap, ValueNode } from "graphql";

import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLObjectType {
      isPgIntervalType?: boolean;
      isPgPointType?: boolean;
    }
    interface ScopeGraphQLInputObjectType {
      isPgIntervalInputType?: boolean;
      isPgPointInputType?: boolean;
    }
    interface ScopeGraphQLScalarType {}
    interface GraphileBuildSchemaOptions {
      pgUseCustomNetworkScalars?: boolean;
    }
  }
}

export const PgTypesPlugin: Plugin = {
  name: "PgTypesPlugin",
  description: "Registers some standard types",
  version: version,
  after: ["CommonTypesPlugin", "PgBasicsPlugin"],

  schema: {
    hooks: {
      // Register common types
      init(_, build) {
        const {
          inflection,
          stringTypeSpec,
          options: { pgUseCustomNetworkScalars },
          graphql: {
            GraphQLInt,
            GraphQLFloat,
            GraphQLNonNull,
            GraphQLList,
            GraphQLBoolean,
            Kind,
          },
          getInputTypeByName,
          getOutputTypeByName,
        } = build;

        // Time is a weird type; we only really want it for Postgres (which is
        // why it's not global).
        build.registerScalarType(
          inflection.builtin("Time"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "The exact time of day, does not include the date. May or may not have a timezone offset.",
                "type",
              ),
            ),
          "graphile-build-pg built-in (Time)",
        );

        // A bunch more postgres-specific types
        build.registerScalarType(
          inflection.builtin("BitString"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A string representing a series of binary bits",
                "type",
              ),
            ),
          "graphile-build-pg built-in (BitString)",
        );
        build.registerScalarType(
          inflection.builtin("InternetAddress"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "An IPv4 or IPv6 host address, and optionally its subnet.",
                "type",
              ),
            ),
          "graphile-build-pg built-in (InternetAddress)",
        );
        build.registerScalarType(
          inflection.builtin("RegProc"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a function name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegProc)",
        );
        build.registerScalarType(
          inflection.builtin("RegProcedure"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a function with argument types",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegProcedure)",
        );
        build.registerScalarType(
          inflection.builtin("RegOper"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for an operator",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegOper)",
        );
        build.registerScalarType(
          inflection.builtin("RegOperator"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for an operator with argument types",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegOperator)",
        );
        build.registerScalarType(
          inflection.builtin("RegClass"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a relation name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegClass)",
        );
        build.registerScalarType(
          inflection.builtin("RegType"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a data type name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegType)",
        );
        build.registerScalarType(
          inflection.builtin("RegRole"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a role name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegRole)",
        );
        build.registerScalarType(
          inflection.builtin("RegNamespace"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a namespace name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegNamespace)",
        );
        build.registerScalarType(
          inflection.builtin("RegConfig"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a text search configuration",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegConfig)",
        );
        build.registerScalarType(
          inflection.builtin("RegDictionary"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a text search dictionary",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegDictionary)",
        );
        if (pgUseCustomNetworkScalars) {
          build.registerScalarType(
            inflection.builtin("CidrAddress"),
            {},
            () =>
              stringTypeSpec(
                build.wrapDescription("An IPv4 or IPv6 CIDR address.", "type"),
              ),
            "graphile-build-pg built-in (CidrAddress)",
          );
          build.registerScalarType(
            inflection.builtin("MacAddress"),
            {},
            () =>
              stringTypeSpec(
                build.wrapDescription("A 6-byte MAC address.", "type"),
              ),
            "graphile-build-pg built-in (MacAddress)",
          );
          build.registerScalarType(
            inflection.builtin("MacAddress8"),
            {},
            () =>
              stringTypeSpec(
                build.wrapDescription("An 8-byte MAC address.", "type"),
              ),
            "graphile-build-pg built-in (MacAddress8)",
          );
        }
        const makeIntervalFields = () => {
          return {
            seconds: {
              description: build.wrapDescription(
                "A quantity of seconds. This is the only non-integer field, as all the other fields will dump their overflow into a smaller unit of time. Intervals don’t have a smaller unit than seconds.",
                "field",
              ),
              type: GraphQLFloat,
            },
            minutes: {
              description: build.wrapDescription(
                "A quantity of minutes.",
                "field",
              ),
              type: GraphQLInt,
            },
            hours: {
              description: build.wrapDescription(
                "A quantity of hours.",
                "field",
              ),
              type: GraphQLInt,
            },
            days: {
              description: build.wrapDescription(
                "A quantity of days.",
                "field",
              ),
              type: GraphQLInt,
            },
            months: {
              description: build.wrapDescription(
                "A quantity of months.",
                "field",
              ),
              type: GraphQLInt,
            },
            years: {
              description: build.wrapDescription(
                "A quantity of years.",
                "field",
              ),
              type: GraphQLInt,
            },
          };
        };

        build.registerObjectType(
          inflection.builtin("Interval"),
          { isPgIntervalType: true },
          null, // TODO: does this want a plan?
          () => ({
            description: build.wrapDescription(
              "An interval of time that has passed where the smallest distinct unit is a second.",
              "type",
            ),
            fields: makeIntervalFields(),
          }),
          "graphile-build-pg built-in (Interval)",
        );
        build.registerInputObjectType(
          inflection.inputType(inflection.builtin("Interval")),
          { isPgIntervalInputType: true },
          () => ({
            description: build.wrapDescription(
              "An interval of time that has passed where the smallest distinct unit is a second.",
              "type",
            ),
            fields: makeIntervalFields(),
          }),
          "graphile-build-pg built-in (IntervalInput)",
        );

        function registerGeometry(
          typeName: string,
          description: string,
          fieldGen: () => GraphileEngine.GraphileFieldConfigMap<any, any>,
          inputFieldGen: () => GraphQLInputFieldConfigMap,
        ): void {
          build.registerObjectType(
            inflection.builtin(typeName),
            { [`isPg${typeName}Type`]: true },
            null, // TODO: does this want a plan?
            () => ({
              description: build.wrapDescription(description, "type"),
              fields: fieldGen(),
            }),
            `graphile-build-pg built-in (${typeName})`,
          );
          build.registerInputObjectType(
            inflection.inputType(inflection.builtin(typeName)),
            { [`isPg${typeName}InputType`]: true },
            () => ({
              description: build.wrapDescription(description, "type"),
              fields: inputFieldGen(),
            }),
            `graphile-build-pg built-in (${typeName}Input)`,
          );
        }

        registerGeometry(
          "Point",
          "A cartesian point.",
          () => ({
            x: { type: new GraphQLNonNull(GraphQLFloat) },
            y: { type: new GraphQLNonNull(GraphQLFloat) },
          }),
          () => ({
            x: { type: new GraphQLNonNull(GraphQLFloat) },
            y: { type: new GraphQLNonNull(GraphQLFloat) },
          }),
        );

        registerGeometry(
          "Line",
          "An infinite line that passes through points 'a' and 'b'.",
          () => {
            const Point = getOutputTypeByName(inflection.builtin("Point"));
            return {
              a: { type: new GraphQLNonNull(Point) },
              b: { type: new GraphQLNonNull(Point) },
            };
          },
          () => {
            const PointInput = getInputTypeByName(
              inflection.inputType(inflection.builtin("Point")),
            );
            return {
              a: { type: new GraphQLNonNull(PointInput) },
              b: { type: new GraphQLNonNull(PointInput) },
            };
          },
        );

        registerGeometry(
          "LineSegment",
          "An finite line between points 'a' and 'b'.",
          () => {
            const Point = getOutputTypeByName(inflection.builtin("Point"));
            return {
              a: { type: new GraphQLNonNull(Point) },
              b: { type: new GraphQLNonNull(Point) },
            };
          },
          () => {
            const PointInput = getInputTypeByName(
              inflection.inputType(inflection.builtin("Point")),
            );
            return {
              a: { type: new GraphQLNonNull(PointInput) },
              b: { type: new GraphQLNonNull(PointInput) },
            };
          },
        );

        registerGeometry(
          "Box",
          "A rectangular box defined by two opposite corners 'a' and 'b'",
          () => {
            const Point = getOutputTypeByName(inflection.builtin("Point"));
            return {
              a: { type: new GraphQLNonNull(Point) },
              b: { type: new GraphQLNonNull(Point) },
            };
          },
          () => {
            const PointInput = getInputTypeByName(
              inflection.inputType(inflection.builtin("Point")),
            );
            return {
              a: { type: new GraphQLNonNull(PointInput) },
              b: { type: new GraphQLNonNull(PointInput) },
            };
          },
        );

        registerGeometry(
          "Path",
          "A path (open or closed) made up of points",
          () => {
            const Point = getOutputTypeByName(inflection.builtin("Point"));
            return {
              points: {
                type: new GraphQLNonNull(
                  new GraphQLList(new GraphQLNonNull(Point)),
                ),
              },
              isOpen: {
                description: build.wrapDescription(
                  "True if this is a closed path (similar to a polygon), false otherwise.",
                  "field",
                ),
                type: new GraphQLNonNull(GraphQLBoolean),
              },
            };
          },
          () => {
            const PointInput = getInputTypeByName(
              inflection.inputType(inflection.builtin("Point")),
            );
            return {
              points: {
                type: new GraphQLNonNull(
                  new GraphQLList(new GraphQLNonNull(PointInput)),
                ),
              },
              isOpen: {
                description: build.wrapDescription(
                  "True if this is a closed path (similar to a polygon), false otherwise.",
                  "field",
                ),
                type: GraphQLBoolean,
              },
            };
          },
        );

        registerGeometry(
          "Polygon",
          "A polygon made up of points",
          () => {
            const Point = getOutputTypeByName(inflection.builtin("Point"));
            return {
              points: {
                type: new GraphQLNonNull(
                  new GraphQLList(new GraphQLNonNull(Point)),
                ),
              },
            };
          },
          () => {
            const PointInput = getInputTypeByName(
              inflection.inputType(inflection.builtin("Point")),
            );
            return {
              points: {
                type: new GraphQLNonNull(
                  new GraphQLList(new GraphQLNonNull(PointInput)),
                ),
              },
            };
          },
        );

        registerGeometry(
          "Circle",
          "A circle about the given center point with the given radius",
          () => {
            const Point = getOutputTypeByName(inflection.builtin("Point"));
            return {
              center: { type: new GraphQLNonNull(Point) },
              radius: { type: new GraphQLNonNull(GraphQLFloat) },
            };
          },
          () => {
            const PointInput = getInputTypeByName(
              inflection.inputType(inflection.builtin("Point")),
            );
            return {
              center: { type: new GraphQLNonNull(PointInput) },
              radius: { type: new GraphQLNonNull(GraphQLFloat) },
            };
          },
        );

        // hstore
        const hstoreTypeName = inflection.builtin("KeyValueHash");
        {
          function isValidHstoreObject(obj: unknown): obj is PgHStore {
            if (obj === null) {
              // Null is okay
              return true;
            } else if (typeof obj === "object") {
              // A hash with string/null values is also okay
              const keys = Object.keys(obj);
              for (const key of keys) {
                const val = obj[key];
                if (val === null) {
                  // Null is okay
                } else if (typeof val === "string") {
                  // String is okay
                } else {
                  // Everything else is invalid.
                  return false;
                }
              }
              return true;
            } else {
              // Everything else is invalid.
              return false;
            }
          }

          function parseValueLiteral(
            ast: ValueNode,
            variables: { [key: string]: any } | null | undefined,
          ) {
            switch (ast.kind) {
              case Kind.INT:
              case Kind.FLOAT:
                // Number isn't really okay, but we'll coerce it to a string anyway.
                return String(parseFloat(ast.value));
              case Kind.STRING:
                // String is okay.
                return String(ast.value);
              case Kind.NULL:
                // Null is okay.
                return null;
              case Kind.VARIABLE: {
                // Variable is okay if that variable is either a string or null.
                const name = ast.name.value;
                const value = variables ? variables[name] : undefined;
                if (value === null || typeof value === "string") {
                  return value;
                }
                return undefined;
              }
              default:
                // Everything else is invalid.
                return undefined;
            }
          }

          build.registerScalarType(
            hstoreTypeName,
            {},
            () => ({
              description: build.wrapDescription(
                "A set of key/value pairs, keys are strings, values may be a string or null. Exposed as a JSON object.",
                "type",
              ),
              serialize: (value) => value,
              parseValue(obj) {
                if (isValidHstoreObject(obj)) {
                  return obj;
                }
                throw new TypeError(
                  `This is not a valid ${hstoreTypeName} object, it must be a key/value hash where keys and values are both strings (or null).`,
                );
              },
              parseLiteral(ast, variables) {
                switch (ast.kind) {
                  case Kind.OBJECT: {
                    const value = ast.fields.reduce((memo, field) => {
                      memo[field.name.value] = parseValueLiteral(
                        field.value,
                        variables,
                      );
                      return memo;
                    }, Object.create(null));

                    if (!isValidHstoreObject(value)) {
                      return undefined;
                    }
                    return value;
                  }

                  case Kind.NULL:
                    return null;

                  case Kind.VARIABLE: {
                    const name = ast.name.value;
                    const value = variables ? variables[name] : undefined;

                    if (!isValidHstoreObject(value)) {
                      return undefined;
                    }
                    return value;
                  }

                  default:
                    return undefined;
                }
              },
            }),
            "graphile-build-pg built-in (KeyValueStore)",
          );
        }

        const typeNameByTYPESKey: {
          [key in keyof typeof TYPES]: string | { [variant: string]: string };
        } = {
          boolean: "Boolean",
          int2: "Int",
          int: "Int",
          bigint: inflection.builtin("BigInt"),
          float: "Float",
          float4: "Float",
          money: "Float",
          numeric: "BigFloat",
          citext: "String",
          text: "String",
          char: "String",
          varchar: "String",
          xml: inflection.builtin("XML"),
          json: inflection.builtin("JSON"),
          jsonb: inflection.builtin("JSON"),
          timestamp: inflection.builtin("Datetime"),
          timestamptz: inflection.builtin("Datetime"),
          date: inflection.builtin("Date"),
          time: inflection.builtin("Time"),
          timetz: inflection.builtin("Time"),
          uuid: inflection.builtin("UUID"),
          interval: {
            input: inflection.inputType(inflection.builtin("Interval")),
            output: inflection.builtin("Interval"),
          },
          bit: inflection.builtin("BitString"),
          varbit: inflection.builtin("BitString"),
          box: {
            input: inflection.inputType(inflection.builtin("Box")),
            output: inflection.builtin("Box"),
          },
          circle: {
            input: inflection.inputType(inflection.builtin("Circle")),
            output: inflection.builtin("Circle"),
          },
          line: {
            input: inflection.inputType(inflection.builtin("Line")),
            output: inflection.builtin("Line"),
          },
          lseg: {
            input: inflection.inputType(inflection.builtin("LineSegment")),
            output: inflection.builtin("LineSegment"),
          },
          path: {
            input: inflection.inputType(inflection.builtin("Path")),
            output: inflection.builtin("Path"),
          },
          point: {
            input: inflection.inputType(inflection.builtin("Point")),
            output: inflection.builtin("Point"),
          },
          polygon: {
            input: inflection.inputType(inflection.builtin("Polygon")),
            output: inflection.builtin("Polygon"),
          },
          hstore: hstoreTypeName,
          inet: inflection.builtin("InternetAddress"),
          regproc: inflection.builtin("RegProc"),
          regprocedure: inflection.builtin("RegProcedure"),
          regoper: inflection.builtin("RegOper"),
          regoperator: inflection.builtin("RegOperator"),
          regclass: inflection.builtin("RegClass"),
          regtype: inflection.builtin("RegType"),
          regrole: inflection.builtin("RegRole"),
          regnamespace: inflection.builtin("RegNamespace"),
          regconfig: inflection.builtin("RegConfig"),
          regdictionary: inflection.builtin("RegDictionary"),

          cidr: pgUseCustomNetworkScalars
            ? inflection.builtin("CidrAddress")
            : "String",
          macaddr: pgUseCustomNetworkScalars
            ? inflection.builtin("MacAddress")
            : "String",
          macaddr8: pgUseCustomNetworkScalars
            ? inflection.builtin("MacAddress8")
            : "String",
        };
        for (const key in typeNameByTYPESKey) {
          const typeNameSpec = typeNameByTYPESKey[key];
          if (typeof typeNameSpec === "string") {
            build.setGraphQLTypeForPgCodec(
              TYPES[key],
              ["input", "output"],
              typeNameSpec,
            );
          } else {
            for (const variant in typeNameSpec) {
              build.setGraphQLTypeForPgCodec(
                TYPES[key],
                variant,
                typeNameSpec[variant],
              );
            }
          }
        }

        return _;
      },
    },
  },
};
