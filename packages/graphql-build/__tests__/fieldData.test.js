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
  if (a === b) return 0;
  if (ascending) {
    return a > b ? 1 : -1;
  } else {
    return a < b ? 1 : -1;
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
              if (after) {
                if (sorts.length) {
                  let filter = () => false;
                  // a > b || (a == b && (next))
                  for (let i = sorts.length - 1; i >= 0; i--) {
                    const [field, ascending] = sorts[i];
                    const oldFilter = filter;
                    filter = obj => {
                      if (!after[i]) return true;
                      const comparison = compare(
                        after[i],
                        obj[field],
                        ascending
                      );
                      return (
                        comparison > 0 || (comparison === 0 && oldFilter(obj))
                      );
                    };
                  }
                  return {
                    filter: [filter],
                  };
                } else {
                  return {
                    filter: [(val, idx) => idx > after],
                  };
                }
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
                const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
                const resolveData = getDataFromParsedResolveInfoFragment(
                  parsedResolveInfoFragment
                );
                let result = dummyData;
                for (const filter of resolveData.filter || []) {
                  result = result.filter(filter);
                }
                const sorts = resolveData.sort || [];
                if (sorts.length) {
                  for (let i = sorts.length - 1; i >= 0; i--) {
                    const [field, ascending] = sorts[i];
                    result.sort((a, b) =>
                      compare(a[field], b[field], ascending)
                    );
                  }
                }
                return result;
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

test("sort", async () => {
  const schema = await buildSchema([...defaultPlugins, DummyConnectionPlugin]);
  const result = await graphql(
    schema,
    `query {
      dummyConnection(sortBy: ID_ASC) {
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
    "bar",
    "baz",
    "foo",
    "qux",
  ]);
  expect(result).toMatchSnapshot();
});
