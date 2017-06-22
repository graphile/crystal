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
      { extend, getTypeByName, buildObjectWithHooks, parseResolveInfo },
      { scope: { isRootQuery }, buildFieldWithHooks }
    ) => {
      if (!isRootQuery) return fields;
      const Cursor = getTypeByName("Cursor");
      const Dummy = buildObjectWithHooks(GraphQLObjectType, {
        name: "Dummy",
        fields: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
          },
          caps: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
      });
      return extend(fields, {
        dummyConnection: buildFieldWithHooks(
          "dummyConnection",
          ({ addArgDataGenerator, getDataFromParsedResolveInfoFragment }) => {
            addArgDataGenerator(function connectionFirst({ first }) {
              if (first) {
                return { limit: [first] };
              }
            });
            addArgDataGenerator(function connectionSortBy({ sortBy }) {
              if (sortBy) {
                return { sort: [sortBy] };
              }
            });
            addArgDataGenerator(function connectionAfter({ after }, data) {
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
                      ID_ASC: {
                        name: "ID_ASC",
                        value: ["id", true],
                      },
                      ID_DESC: {
                        name: "ID_DESC",
                        value: ["id", false],
                      },
                      CAPS_ASC: {
                        name: "CAPS_ASC",
                        value: ["caps", true],
                      },
                      CAPS_DESC: {
                        name: "CAPS_DESC",
                        value: ["caps", false],
                      },
                    },
                  }),
                },
              },
              resolve(data, args, context, resolveInfo) {
                const resolveData = getDataFromParsedResolveInfoFragment(
                  parseResolveInfo(resolveInfo)
                );
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

test("no arguments", async () => {
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
  expect(result.data.dummyConnection.nodes.map(n => n.id)).toEqual([
    "foo",
    "bar",
    "baz",
    "qux",
  ]);
  expect(result).toMatchSnapshot();
});
