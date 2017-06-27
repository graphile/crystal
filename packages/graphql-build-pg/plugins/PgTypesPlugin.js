const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLEnumType,
  isInputType,
} = require("graphql");

const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
} = require("graphql-iso-date");

const upperFirst = require("lodash/upperFirst");
const camelcase = require("lodash/camelcase");

module.exports = function PgTypesPlugin(builder, { pgExtendedTypes = true }) {
  builder.hook("build", build => {
    const GraphQLJSON = build.getTypeByName("JSON");
    const GraphQLUUID = build.getTypeByName("UUID");
    const gqlTypeByTypeId = Object.assign({}, build.pgGqlTypeByTypeId);
    const gqlInputTypeByTypeId = Object.assign(
      {},
      build.pgGqlInputTypeByTypeId
    );
    const pg2GqlMapper = {};
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
    const pgTypeById = build.pgIntrospectionResultsByKind.type.reduce(
      (memo, type) => {
        memo[type.id] = type;
        return memo;
      },
      {}
    );
    const categoryLookup = {
      B: () => GraphQLBoolean,
      N: () => GraphQLFloat,
      A: type =>
        new GraphQLList(
          new GraphQLNonNull(
            enforceGqlTypeByPgType(pgTypeById[type.arrayItemTypeId])
          )
        ),
    };
    /*
        Determined by running:

          select oid, typname, typarray, typcategory, typtype from pg_catalog.pg_type where typtype = 'b' order by oid;

        We only need to add oidLookups for types that don't have the correct fallback
      */
    const oidLookup = Object.assign(
      {
        20: GraphQLString, // Even though this is int8, it's too big for JS int, so cast to string.
        21: GraphQLInt,
        23: GraphQLInt,
      },
      pgExtendedTypes && {
        114: GraphQLJSON,
        3802: GraphQLJSON,
        2950: GraphQLUUID,
        1082: GraphQLDate, // date
        1114: GraphQLDateTime, // timestamp
        1184: GraphQLDateTime, // timestamptz
        1083: GraphQLTime, // time
        1266: GraphQLTime, // timetz
        // 1186 interval
      }
    );
    const identity = _ => _;
    const jsonStringify = o => JSON.stringify(o);
    pg2GqlMapper[114] = {
      map: identity,
      unmap: jsonStringify,
    };
    pg2GqlMapper[3802] = pg2GqlMapper[114];
    const enforceGqlTypeByPgType = type => {
      // Explicit overrides
      if (!gqlTypeByTypeId[type.id]) {
        const gqlType = oidLookup[type.id];
        if (gqlType) {
          gqlTypeByTypeId[type.id] = gqlType;
        }
      }
      // Enums
      if (!gqlTypeByTypeId[type.id] && type.typtype === "e") {
        gqlTypeByTypeId[type.id] = new GraphQLEnumType({
          // XXX: use inflection
          name: upperFirst(camelcase(`${type.name}-enum`)),
          values: type.enumVariants,
          description: type.description,
        });
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

    build.pgIntrospectionResultsByKind.type.forEach(enforceGqlTypeByPgType);

    return build.extend(build, {
      pgGqlTypeByTypeId: gqlTypeByTypeId,
      pgGqlInputTypeByTypeId: gqlInputTypeByTypeId,
      pg2GqlMapper,
      pg2gql(val, type) {
        if (val == null) {
          return val;
        }
        if (pg2GqlMapper[type.id]) {
          return pg2GqlMapper[type.id].map(val);
        } else {
          return val;
        }
      },
      gql2pg(val, type) {
        if (val == null) {
          return val;
        }
        if (pg2GqlMapper[type.id]) {
          return pg2GqlMapper[type.id].unmap(val);
        } else {
          return val;
        }
      },
    });
  });
};
