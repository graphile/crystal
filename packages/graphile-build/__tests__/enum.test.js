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
const { buildSchema, defaultPlugins, MutationPlugin } = require("../");

const base64 = str => new Buffer(String(str)).toString("base64");
const base64Decode = str => new Buffer(String(str), "base64").toString("utf8");

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

function EnumPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, { extend, newWithHooks }, { scope: { isRootQuery } }) => {
      if (!isRootQuery) {
        return fields;
      }
      const MyEnum = newWithHooks(
        GraphQLEnumType,
        {
          name: "MyEnum",
          values: {
            ONE: { value: 1 },
            TWO: { value: 2 },
            THREE: { value: 3 },
          },
        },
        {
          isMyEnum: true,
        }
      );
      return extend(fields, {
        enum: {
          type: MyEnum,
        },
      });
    }
  );
  builder.hook(
    "GraphQLEnumType:values",
    (values, { extend }, { scope: { isMyEnum } }) => {
      if (!isMyEnum) {
        return values;
      }
      return extend(values, {
        FOUR: { value: 4 },
      });
    }
  );
  builder.hook(
    "GraphQLEnumType:values:value",
    (value, { extend }, { scope: { isMyEnum } }) => {
      if (isMyEnum && value.value < 4) {
        return extend(value, {
          deprecationReason: "We no longer support numbers smaller than PI",
        });
      } else {
        return value;
      }
    }
  );
}

test("generated schema", async () => {
  const schema = await buildSchema([...defaultPlugins, EnumPlugin]);
  expect(printSchema(schema)).toMatchSnapshot();
});
