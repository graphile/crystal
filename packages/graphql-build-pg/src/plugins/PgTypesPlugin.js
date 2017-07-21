import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLScalarType,
  isInputType,
} from "graphql";
import { Kind } from "graphql/language";
import { types as pgTypes } from "pg";
const stringType = (name, description) =>
  new GraphQLScalarType({
    name,
    description,
    serialize: value => String(value),
    parseValue: value => String(value),
    parseLiteral: ast => {
      if (ast.kind !== Kind.STRING) {
        throw new Error("Can only parse string values");
      }
      return ast.value;
    },
  });
import rawParseInterval from "postgres-interval";
import LRU from "lru-cache";
/*
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
} = require("graphql-iso-date");
*/

const parseCache = LRU(500);
function parseInterval(str) {
  let result = parseCache.get(str);
  if (!result) {
    result = rawParseInterval(str);
    Object.freeze(result);
    parseCache.set(str, result);
  }
  return result;
}

const pgRangeParser = {
  parse(str) {
    const parts = str.split(",");
    if (parts.length !== 2) {
      throw new Error("Invalid daterange");
    }

    return {
      start:
        parts[0].length > 1
          ? {
              inclusive: parts[0][0] === "[",
              value: parts[0].slice(1),
            }
          : null,
      end:
        parts[1].length > 1
          ? {
              inclusive: parts[1][parts[1].length - 1] === "]",
              value: parts[1].slice(0, -1),
            }
          : null,
    };
  },

  serialize({ start, end }) {
    const inclusivity = {
      true: "[]",
      false: "()",
    };

    return [
      start ? inclusivity[start.inclusive][0] + start.value : "[",
      end ? end.value + inclusivity[end.inclusive][1] : "]",
    ].join(",");
  },
};

export default function PgTypesPlugin(
  builder,
  { pgExtendedTypes = true, pgInflection: inflection }
) {
  // XXX: most of this should be in an "init" hook, not a "build" hook
  builder.hook("build", build => {
    const {
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      getTypeByName,
      addType,
      pgSql: sql,
    } = build;

    const GraphQLJSON = getTypeByName("JSON");
    const GraphQLUUID = getTypeByName("UUID");
    const gqlTypeByTypeId = Object.assign({}, build.pgGqlTypeByTypeId);
    const gqlInputTypeByTypeId = Object.assign(
      {},
      build.pgGqlInputTypeByTypeId
    );
    const pg2GqlMapper = {};
    const pg2gql = (val, type) => {
      if (val == null) {
        return val;
      }
      if (pg2GqlMapper[type.id]) {
        return pg2GqlMapper[type.id].map(val);
      } else if (type.domainBaseType) {
        return pg2gql(val, type.domainBaseType);
      } else {
        return val;
      }
    };
    const gql2pg = (val, type) => {
      if (val == null) {
        return sql.null;
      }
      if (pg2GqlMapper[type.id]) {
        return pg2GqlMapper[type.id].unmap(val);
      } else if (type.domainBaseType) {
        return gql2pg(val, type.domainBaseType);
      } else {
        return sql.value(val);
      }
    };
    /*
      type =
        { kind: 'type',
          id: '1021',
          name: '_float4',
          description: null,
          namespaceId: '11',
          namespaceName: 'pg_catalog',
          type: 'b',
          category: 'A',
          domainIsNotNull: false,
          arrayItemTypeId: '700',
          classId: null,
          domainBaseTypeId: null,
          enumVariants: null,
          rangeSubTypeId: null }
      */

    const makeIntervalFields = () => {
      return {
        seconds: {
          description:
            "A quantity of seconds. This is the only non-integer field, as all the other fields will dump their overflow into a smaller unit of time. Intervals don’t have a smaller unit than seconds.",
          type: GraphQLFloat,
        },
        minutes: {
          description: "A quantity of minutes.",
          type: GraphQLInt,
        },
        hours: {
          description: "A quantity of hours.",
          type: GraphQLInt,
        },
        days: {
          description: "A quantity of days.",
          type: GraphQLInt,
        },
        months: {
          description: "A quantity of months.",
          type: GraphQLInt,
        },
        years: {
          description: "A quantity of years.",
          type: GraphQLInt,
        },
      };
    };
    const GQLInterval = new GraphQLObjectType({
      name: "Interval",
      description:
        "An interval of time that has passed where the smallest distinct unit is a second.",
      fields: makeIntervalFields(),
    });
    addType(GQLInterval);

    const GQLIntervalInput = new GraphQLInputObjectType({
      name: "IntervalInput",
      description:
        "An interval of time that has passed where the smallest distinct unit is a second.",
      fields: makeIntervalFields(),
    });
    addType(GQLIntervalInput);

    const pgTypeById = introspectionResultsByKind.type.reduce((memo, type) => {
      memo[type.id] = type;
      return memo;
    }, {});
    const categoryLookup = {
      B: () => GraphQLBoolean,
      N: () => GraphQLFloat,
      A: type =>
        new GraphQLList(
          enforceGqlTypeByPgType(pgTypeById[type.arrayItemTypeId])
        ),
    };
    const rawTypes = [
      1186, // interval
      1082, // date
      1114, // timestamp
      1184, // timestamptz
      1083, // time
      1266, // timetz
    ];

    const tweakToJson = fragment => sql.fragment`to_json(${fragment})`;
    const tweakToText = fragment => sql.fragment`(${fragment})::text`;
    const pgTweaksByTypeId = Object.assign(
      // ::text rawTypes
      rawTypes.reduce((memo, typeId) => {
        memo[typeId] = tweakToText;
        return memo;
      }, {}),
      {
        // to_json all dates to make them ISO (overrides rawTypes above)
        1082: tweakToJson,
        1114: tweakToJson,
        1184: tweakToJson,
        1083: tweakToJson,
        1266: tweakToJson,
      }
    );
    const pgTweakFragmentForType = (fragment, type) => {
      const tweaker = pgTweaksByTypeId[type.id];
      if (tweaker) {
        return tweaker(fragment);
      } else if (type.domainBaseType) {
        return pgTweakFragmentForType(fragment, type.domainBaseType);
      } else {
        return fragment;
      }
    };
    /*
        Determined by running:

          select oid, typname, typarray, typcategory, typtype from pg_catalog.pg_type where typtype = 'b' order by oid;

        We only need to add oidLookups for types that don't have the correct fallback
      */
    const SimpleDate = stringType("Date", "The day, does not include a time.");
    const SimpleDatetime = stringType(
      "Datetime",
      "A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone."
    );
    const SimpleTime = stringType(
      "Time",
      "The exact time of day, does not include the date. May or may not have a timezone offset."
    );
    const SimpleJSON = stringType(
      "JSON",
      "A JavaScript object encoded in the JSON format as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf)."
    );
    const SimpleUUID = stringType(
      "UUID",
      "A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122)."
    );
    const oidLookup = Object.assign(
      {
        20: stringType(
          "BigInt",
          "A signed eight-byte integer. The upper big integer values are greater then the max value for a JavaScript number. Therefore all big integers will be output as strings and not numbers."
        ), // bitint - even though this is int8, it's too big for JS int, so cast to string.
        21: GraphQLInt, // int2
        23: GraphQLInt, // int4
        790: GraphQLFloat, // money
        1186: GQLInterval, // interval
        1082: SimpleDate, // date
        1114: SimpleDatetime, // timestamp
        1184: SimpleDatetime, // timestamptz
        1083: SimpleTime, // time
        1266: SimpleTime, // timetz
        114: SimpleJSON, // json
        3802: SimpleJSON, // jsonb
        2950: SimpleUUID, // uuid
      },
      pgExtendedTypes && {
        114: GraphQLJSON,
        3802: GraphQLJSON,
        2950: GraphQLUUID,
        /*
        1082: GraphQLDate, // date
        1114: GraphQLDateTime, // timestamp
        1184: GraphQLDateTime, // timestamptz
        1083: GraphQLTime, // time
        1266: GraphQLTime, // timetz
        */
      }
    );
    const oidInputLookup = {
      1186: GQLIntervalInput, // interval
    };
    const identity = _ => _;
    const jsonStringify = o => JSON.stringify(o);
    if (pgExtendedTypes) {
      pg2GqlMapper[114] = {
        map: identity,
        unmap: o => sql.value(jsonStringify(o)),
      };
    } else {
      pg2GqlMapper[114] = {
        map: jsonStringify,
        unmap: str => sql.value(str),
      };
    }
    pg2GqlMapper[3802] = pg2GqlMapper[114]; // jsonb

    // interval
    pg2GqlMapper[1186] = {
      map: str => parseInterval(str),
      unmap: o => {
        const keys = ["seconds", "minutes", "hours", "days", "months", "years"];
        const parts = [];
        for (const key of keys) {
          if (o[key]) {
            parts.push(`${o[key]} ${key}`);
          }
        }
        return sql.value(parts.join(" ") || "0 seconds");
      },
    };

    const parseMoney = str => {
      const numerical = str.replace(/[^0-9.,]/g, "");
      const lastCommaIndex = numerical.lastIndexOf(",");
      if (lastCommaIndex >= 0 && lastCommaIndex === numerical.length - 3) {
        // Assume string is of the form '123.456,78'
        return parseFloat(numerical.replace(/\./g, "").replace(",", "."));
      } else {
        // Assume string is of the form '123,456.78'
        return parseFloat(numerical.replace(/,/g, ""));
      }
    };
    pg2GqlMapper[790] = {
      map: parseMoney,
      unmap: val => sql.fragment`(${sql.value(val)})::money`,
    };

    const enforceGqlTypeByPgType = type => {
      // Explicit overrides
      if (!gqlTypeByTypeId[type.id]) {
        const gqlType = oidLookup[type.id];
        if (gqlType) {
          gqlTypeByTypeId[type.id] = gqlType;
        }
      }
      if (!gqlInputTypeByTypeId[type.id]) {
        const gqlInputType = oidInputLookup[type.id];
        if (gqlInputType) {
          gqlInputTypeByTypeId[type.id] = gqlInputType;
        }
      }
      // Enums
      if (!gqlTypeByTypeId[type.id] && type.type === "e") {
        gqlTypeByTypeId[type.id] = new GraphQLEnumType({
          name: inflection.enumType(type.name),
          description: type.description,
          values: type.enumVariants.reduce((memo, value) => {
            memo[inflection.enumName(value)] = {
              value: value,
            };
            return memo;
          }, {}),
        });
      }
      // Ranges
      if (!gqlTypeByTypeId[type.id] && type.type === "r") {
        const subtype =
          introspectionResultsByKind.typeById[type.rangeSubTypeId];
        const gqlRangeSubType = enforceGqlTypeByPgType(subtype);
        if (!gqlRangeSubType) {
          throw new Error("Range of unsupported");
        }
        let Range = getTypeByName(inflection.rangeType(gqlRangeSubType.name));
        let RangeInput;
        if (!Range) {
          const RangeBound = new GraphQLObjectType({
            name: inflection.rangeBoundType(gqlRangeSubType.name),
            description:
              "The value at one end of a range. A range can either include this value, or not.",
            fields: {
              value: {
                description: "The value at one end of our range.",
                type: new GraphQLNonNull(gqlRangeSubType),
              },
              inclusive: {
                description:
                  "Whether or not the value of this bound is included in the range.",
                type: new GraphQLNonNull(GraphQLBoolean),
              },
            },
          });
          const RangeBoundInput = new GraphQLInputObjectType({
            name: inflection.inputType(RangeBound.name),
            description:
              "The value at one end of a range. A range can either include this value, or not.",
            fields: {
              value: {
                description: "The value at one end of our range.",
                type: new GraphQLNonNull(gqlRangeSubType),
              },
              inclusive: {
                description:
                  "Whether or not the value of this bound is included in the range.",
                type: new GraphQLNonNull(GraphQLBoolean),
              },
            },
          });
          Range = new GraphQLObjectType({
            name: inflection.rangeType(gqlRangeSubType.name),
            description: `A range of \`${gqlRangeSubType.name}\`.`,
            fields: {
              start: {
                description: "The starting bound of our range.",
                type: RangeBound,
              },
              end: {
                description: "The ending bound of our range.",
                type: RangeBound,
              },
            },
          });
          RangeInput = new GraphQLInputObjectType({
            name: inflection.inputType(Range.name),
            description: `A range of \`${gqlRangeSubType.name}\`.`,
            fields: {
              start: {
                description: "The starting bound of our range.",
                type: RangeBoundInput,
              },
              end: {
                description: "The ending bound of our range.",
                type: RangeBoundInput,
              },
            },
          });
          addType(Range);
          addType(RangeInput);
        } else {
          RangeInput = getTypeByName(inflection.inputType(Range.name));
        }
        gqlTypeByTypeId[type.id] = Range;
        gqlInputTypeByTypeId[type.id] = RangeInput;
        pg2GqlMapper[type.id] = {
          map: pgRange => {
            const parsed = pgRangeParser.parse(pgRange);
            // Since the value we will get from `parsed.(start|end).value` is a
            // string but our code will expect it to be the value after `pg`
            // parsed it, we pass through to `pg-types` for parsing.
            const pgParse =
              rawTypes.indexOf(parseInt(subtype.id, 10)) >= 0
                ? identity
                : pgTypes.getTypeParser(subtype.id);
            return {
              start: parsed.start && {
                value: pg2gql(pgParse(parsed.start.value), subtype),
                inclusive: parsed.start.inclusive,
              },
              end: parsed.end && {
                value: pg2gql(pgParse(parsed.end.value), subtype),
                inclusive: parsed.end.inclusive,
              },
            };
          },
          unmap: ({ start, end }) => {
            // Ref: https://www.postgresql.org/docs/9.6/static/rangetypes.html#RANGETYPES-CONSTRUCT
            const lower = (start && gql2pg(start.value, subtype)) || sql.null;
            const upper = (end && gql2pg(end.value, subtype)) || sql.null;
            const lowerInclusive = start && !start.inclusive ? "(" : "[";
            const upperInclusive = end && !end.inclusive ? ")" : "]";
            return sql.fragment`${sql.identifier(
              type.namespaceName,
              type.name
            )}(${lower}, ${upper}, ${sql.literal(
              lowerInclusive + upperInclusive
            )})`;
          },
        };
      }

      // Domains
      if (
        !gqlTypeByTypeId[type.id] &&
        type.type === "d" &&
        type.domainBaseTypeId
      ) {
        const baseType = enforceGqlTypeByPgType(type.domainBaseType);
        const baseInputType = gqlInputTypeByTypeId[type.domainBaseTypeId];
        // Hack stolen from: https://github.com/postgraphql/postgraphql/blob/ade728ed8f8e3ecdc5fdad7d770c67aa573578eb/src/graphql/schema/type/aliasGqlType.ts#L16
        gqlTypeByTypeId[type.id] = Object.assign(Object.create(baseType), {
          name: inflection.domainType(type.name),
          description: type.description,
        });
        if (baseInputType && baseInputType !== baseType) {
          gqlInputTypeByTypeId[type.id] = Object.assign(
            Object.create(baseInputType),
            {
              name: inflection.inputType(gqlTypeByTypeId[type.id]),
              description: type.description,
            }
          );
        }
      }

      // Fall back to categories
      if (!gqlTypeByTypeId[type.id]) {
        const gen = categoryLookup[type.category];
        if (gen) {
          gqlTypeByTypeId[type.id] = gen(type);
        }
      }

      // Nothing else worked; pass through as string!
      if (!gqlTypeByTypeId[type.id]) {
        // XXX: consider using stringType(upperFirst(camelCase(`fallback_${type.name}`)), type.description)?
        gqlTypeByTypeId[type.id] = GraphQLString;
      }
      // Now for input types, fall back to output types if possible
      if (!gqlInputTypeByTypeId[type.id]) {
        if (isInputType(gqlTypeByTypeId[type.id])) {
          gqlInputTypeByTypeId[type.id] = gqlTypeByTypeId[type.id];
        }
      }
      return gqlTypeByTypeId[type.id];
    };

    introspectionResultsByKind.type.forEach(enforceGqlTypeByPgType);

    return build.extend(build, {
      pgGqlTypeByTypeId: gqlTypeByTypeId,
      pgGqlInputTypeByTypeId: gqlInputTypeByTypeId,
      pg2GqlMapper,
      pg2gql,
      gql2pg,
      pgTweakFragmentForType,
      pgTweaksByTypeId,
    });
  });
}
