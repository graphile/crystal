const { GraphQLEnumType } = require("graphql");
const { printSchema } = require("graphql/utilities");
const { buildSchema, defaultPlugins } = require("../");

function EnumPlugin(builder) {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const { extend, newWithHooks } = build;
    const {
      scope: { isRootQuery },
    } = context;
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
  });
  builder.hook("GraphQLEnumType:values", (values, build, context) => {
    const { extend } = build;
    const {
      scope: { isMyEnum },
    } = context;
    if (!isMyEnum) {
      return values;
    }
    return extend(values, {
      FOUR: { value: 4 },
    });
  });
  builder.hook("GraphQLEnumType:values:value", (value, build, context) => {
    const { extend } = build;
    const {
      scope: { isMyEnum },
    } = context;
    if (isMyEnum && value.value < 4) {
      return extend(value, {
        deprecationReason: "We no longer support numbers smaller than PI",
      });
    } else {
      return value;
    }
  });
}

test("generated schema", async () => {
  const schema = await buildSchema([...defaultPlugins, EnumPlugin]);
  expect(printSchema(schema)).toMatchSnapshot();
});
