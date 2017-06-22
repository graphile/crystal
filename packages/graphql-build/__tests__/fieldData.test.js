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

const DummyConnectionPlugin = async builder => {
  builder.hook(
    "objectType:fields",
    (
      fields,
      { extend, getTypeByName, buildObjectWithHooks },
      { scope: { isRootQuery } }
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
        dummyConnection: {
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
        },
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
