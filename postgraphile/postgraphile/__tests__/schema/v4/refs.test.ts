import * as core from "./core.js";

const NonNullRefsPlugin: GraphileConfig.Plugin = {
  name: "NonNullRefsPlugin",
  version: "0.0.0",
  schema: {
    hooks: {
      GraphQLObjectType_fields_field(field, build, context) {
        const {
          graphql: { GraphQLNonNull, getNullableType },
          input: { pgRegistry },
        } = build;
        const { pgRefDetails } = context.scope;
        if (!pgRefDetails) return field;
        const { codec, ref } = pgRefDetails;
        if (ref.paths.length !== 1) return field;
        const path = ref.paths[0];
        let current = codec;
        for (let i = 0, l = path.length; i < l; i++) {
          const { relationName } = path[i];
          const relation = pgRegistry.pgRelations[current.name][relationName];
          if (!relation) return field;
          for (const attrName of relation.localAttributes) {
            const attr = codec.attributes[attrName];
            const notNull = attr.notNull || attr.extensions?.tags?.notNull;
            if (!notNull) {
              return field;
            }
          }
        }
        field.type = new GraphQLNonNull(getNullableType(field.type));
        return field;
      },
    },
  },
};

test(
  "prints a schema from refs schema",
  core.test(__filename, ["refs"], {
    disableDefaultMutations: true,
    appendPlugins: [NonNullRefsPlugin],
  }),
);
