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

const base64 = str => Buffer.from(String(str)).toString("base64");
const base64Decode = str => Buffer.from(String(str), "base64").toString("utf8");

const dummyData = [
  { ID: "foo", CAPS: "FOO" },
  { ID: "bar", CAPS: "BAR" },
  { ID: "baz", CAPS: "BAZ" },
  { ID: "qux", CAPS: "QUX" },
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
      {
        extend,
        getTypeByName,
        buildObjectWithHooks,
        parseResolveInfo,
        resolveAlias,
      },
      { scope: { isRootQuery }, buildFieldWithHooks }
    ) => {
      if (!isRootQuery) return fields;
      const Cursor = getTypeByName("Cursor");
      const Dummy = buildObjectWithHooks(GraphQLObjectType, {
        name: "Dummy",
        fields: ({ addDataGeneratorForField }) => {
          addDataGeneratorForField("id", ({ alias }) => {
            return {
              map: obj => ({ [alias]: obj.ID }),
            };
          });
          addDataGeneratorForField("caps", ({ alias }) => {
            return {
              map: obj => ({ [alias]: obj.CAPS }),
            };
          });
          addDataGeneratorForField("random", ({ alias }) => {
            return {
              map: () => ({ [alias]: Math.floor(Math.random() * 10000) }),
            };
          });
          return {
            id: {
              type: new GraphQLNonNull(GraphQLString),
              resolve: resolveAlias,
            },
            caps: {
              type: new GraphQLNonNull(GraphQLString),
              resolve: resolveAlias,
            },
            random: {
              type: new GraphQLNonNull(GraphQLInt),
              resolve: resolveAlias,
            },
          };
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
                fields: ({ recurseDataGeneratorsForField }) => {
                  recurseDataGeneratorsForField("edges");
                  recurseDataGeneratorsForField("nodes");
                  return {
                    edges: {
                      type: new GraphQLList(
                        new GraphQLNonNull(
                          buildObjectWithHooks(GraphQLObjectType, {
                            name: "DummyEdge",
                            fields: ({
                              addDataGeneratorForField,
                              recurseDataGeneratorsForField,
                            }) => {
                              recurseDataGeneratorsForField("node");
                              addDataGeneratorForField(
                                "cursor",
                                (parsedResolveInfoFragment, data) => {
                                  if (data.sort) {
                                    return {
                                      map: obj => ({
                                        __cursor: base64(
                                          JSON.stringify(
                                            data.sort.map(([key]) => obj[key])
                                          )
                                        ),
                                      }),
                                    };
                                  } else {
                                    return {
                                      map: (obj, idx) => ({
                                        __cursor: String(idx),
                                      }),
                                    };
                                  }
                                }
                              );
                              return {
                                cursor: {
                                  type: Cursor,
                                  resolve(data) {
                                    return data.__cursor;
                                  },
                                },
                                node: {
                                  type: Dummy,
                                  resolve(data) {
                                    return data;
                                  },
                                },
                              };
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
                  };
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
                        value: ["ID", true],
                      },
                      ID_DESC: {
                        name: "ID_DESC",
                        value: ["ID", false],
                      },
                      CAPS_ASC: {
                        name: "CAPS_ASC",
                        value: ["CAPS", true],
                      },
                      CAPS_DESC: {
                        name: "CAPS_DESC",
                        value: ["CAPS", false],
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
                const ret = result.map((entry, idx) =>
                  (resolveData.map || [])
                    .reduce(
                      (memo, map) => Object.assign(memo, map(entry, idx)),
                      {}
                    )
                );
                return ret;
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
  expect(
    result.data.dummyConnection.edges.map(({ cursor }) => cursor)
  ).toEqual(["0", "1", "2", "3"]);
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
  expect(
    result.data.dummyConnection.edges
      .map(({ cursor }) => cursor)
      .map(base64Decode)
  ).toEqual(['["bar"]', '["baz"]', '["foo"]', '["qux"]']);
  expect(result).toMatchSnapshot();
});
