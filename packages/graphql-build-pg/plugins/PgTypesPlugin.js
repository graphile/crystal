module.exports = function PgTypesPlugin(listener, { pgExtendedTypes = true }) {
  listener.on(
    "context",
    (
      context,
      { buildObjectWithHooks, inflection, pg: { gqlTypeByTypeId } }
    ) => {
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
      const pgTypeById = context.pg.introspectionResultsByKind.type.reduce(
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
      const oidLookup = {
        20: GraphQLFloat, // Even though this is int8, it's too big for JS int, so cast to float (or string?).
        21: GraphQLInt,
        23: GraphQLInt,
        114: GraphQLJSON,
        3802: GraphQLJSON,
        2950: GraphQLUUID,
        1082: GraphQLDate, // date
        1114: GraphQLDateTime, // timestamp
        1184: GraphQLDateTime, // timestamptz
        1083: GraphQLTime, // time
        1266: GraphQLTime, // timetz
        // 1186 interval
      };
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
        return gqlTypeByTypeId[type.id];
      };

      context.pg.introspectionResultsByKind.type
        .filter(type => true)
        .forEach(enforceGqlTypeByPgType);
    }
  );
};
