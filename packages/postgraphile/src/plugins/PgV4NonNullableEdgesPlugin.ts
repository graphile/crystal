export const PgV4NonNullableEdgesPlugin: GraphileConfig.Plugin = {
  name: "PgV4NonNullableEdgesPlugin",
  version: "0.0.0",

  schema: {
    hooks: {
      GraphQLObjectType_fields_field(field, build, context) {
        const {
          getNullableType,
          GraphQLList,
          GraphQLNonNull,
          isListType,
          isNonNullType,
        } = build.graphql;
        const {
          scope: { isConnectionType, fieldName },
        } = context;
        if (!isConnectionType || fieldName !== "edges") {
          return field;
        }

        const t = field.type;
        const nt = getNullableType(t);
        if (!isListType(nt)) {
          throw new Error("Expected a list of edges");
        }
        const li = nt.ofType;
        if (isNonNullType(li)) {
          // No change
          return field;
        }
        const newType = new GraphQLList(new GraphQLNonNull(li));
        field.type = t === nt ? newType : new GraphQLNonNull(newType);
        return field;
      },
    },
  },
};
