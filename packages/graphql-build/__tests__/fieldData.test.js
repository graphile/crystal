const {
  graphql,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");
const { printSchema } = require("graphql/utilities");
const { buildSchema, defaultPlugins } = require("../");

const dummyData = [
  { id: "foo", caps: "FOO" },
  { id: "bar", caps: "BAR" },
  { id: "baz", caps: "BAZ" },
  { id: "qux", caps: "QUX" },
];

const compare = (a, b, ascending) => {
  if (ascending) {
    return a > b;
  } else {
    return a < b;
  }
};

const DummyConnectionPlugin = async builder => {
  builder.hook(
    "objectType:fields",
    (
      fields,
      { extend, getTypeByName, buildObjectWithHooks },
      { scope: { isRootQuery }, buildFieldWithHooks }
    ) => {
      if (!isRootQuery) return fields;
      const Cursor = getTypeByName("Cursor");
      const Dummy = buildObjectWithHooks(GraphQLObjectType, {
        name: "Dummy",
        fields: {
          ID_ASC: {
            type: new GraphQLNonNull(GraphQLString),
            value: ["id", true],
          },
          ID_DESC: {
            type: new GraphQLNonNull(GraphQLString),
            value: ["id", false],
          },
          CAPS_ASC: {
            type: new GraphQLNonNull(GraphQLString),
            value: ["caps", true],
          },
          CAPS_DESC: {
            type: new GraphQLNonNull(GraphQLString),
            value: ["caps", false],
          },
        },
      });
      return extend(fields, {
        dummyConnection: buildFieldWithHooks(
          "dummyConnection",
          ({ addArgDataGenerator }) => {
            addArgDataGenerator(({ first }) => {
              if (first) {
                return { limit: [first] };
              }
            });
            addArgDataGenerator(({ sortBy }) => {
              if (sortBy) {
                return { sort: [sortBy] };
              }
            });
            addArgDataGenerator(({ after }, data) => {
              const sorts = data.sort || [];
              if (sorts.length) {
                let filter = () => false;
                // a > b || (a == b && (next))
                for (let i = sorts.length - 1; i >= 0; i--) {
                  const [field, ascending] = sorts[i];
                  const oldFilter = filter;
                  filter = obj =>
                    after[i] == null ||
                    compare(obj[field], after[i], ascending) ||
                    (obj[field] === after[i] && oldFilter(obj));
                }
                return {
                  filter: [filter],
                };
              }
            });
            return {
              type: buildObjectWithHooks(GraphQLObjectType, {
                name: "DummyConnection",
                fields: {
                  edges: {
                    type: new GraphQLList(
                      new GraphQLNonNull(
                        buildObjectWithHooks(GraphQLObjectType, {
                          name: "DummyEdge",
                          fields: {
                            cursor: {
                              type: Cursor,
                            },
                            node: {
                              type: Dummy,
                              resolve(data) {
                                return data;
                              },
                            },
                          },
                        })
                      )
                    ),
                    resolve(data) {
                      return data;
                    },
                  },
                  nodes: {
                    type: new GraphQLList(new GraphQLNonNull(Dummy)),
                    resolve(data) {
                      return data;
                    },
                  },
                },
              }),
              args: {
                first: {
                  type: GraphQLInt,
                },
                after: {
                  type: Cursor,
                },
                sortBy: {
                  type: new GraphQLEnumType({
                    name: "DummyConnectionSortBy",
                    values: {
                      id: {
                        name: "id",
                      },
                      caps: {
                        name: "caps",
                      },
                    },
                  }),
                },
              },
              resolve(data, args, resolveInfo) {
                return dummyData;
              },
            };
          }
        ),
      });
    }
  );
};

test("generated schema", async () => {
  const schema = await buildSchema([...defaultPlugins, DummyConnectionPlugin]);
  expect(printSchema(schema)).toMatchSnapshot();
});

test("parse data", async () => {
  const schema = await buildSchema([...defaultPlugins, DummyConnectionPlugin]);
  const result = await graphql(
    schema,
    `query {
      dummyConnection {
        edges {
          cursor
          node {
            id
            caps
          }
        }
        nodes {
          id
          caps
        }
      }
    }`
  );
  expect(result).toMatchSnapshot();
});
