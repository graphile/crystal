const {
  graphql,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
  printSchema,
} = require("graphql");
const {
  getBuilder,
  defaultPlugins: allDefaultPlugins,
  MutationPlugin,
} = require("../");

const options = {};

const EventEmitter = require("events");

const defaultPlugins = allDefaultPlugins.filter(
  plugin => plugin !== MutationPlugin
);

const makePluginEtc = (defaultCounter = 0) => {
  let counter = defaultCounter;

  const eventEmitter = new EventEmitter();

  const DummyWatchPlugin = async builder => {
    builder.registerWatcher(
      triggerRebuild => {
        eventEmitter.on("change", triggerRebuild);
      },
      triggerRebuild => {
        eventEmitter.removeListener("change", triggerRebuild);
      }
    );
    builder.hook("build", build => {
      return build.extend(build, {
        dummyCounter: counter,
      });
    });
    builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
      const { dummyCounter, extend, newWithHooks } = build;
      const {
        scope: { isRootQuery },
        fieldWithHooks,
      } = context;
      if (!isRootQuery) return fields;
      const Dummy = newWithHooks(
        GraphQLObjectType,
        {
          name: `Dummy${dummyCounter}`,
          fields: () => {
            return {
              n: {
                type: new GraphQLNonNull(GraphQLInt),
                resolve: () => dummyCounter,
              },
            };
          },
        },
        {}
      );
      return extend(fields, {
        dummy: fieldWithHooks(
          "dummy",
          () => {
            return {
              type: Dummy,
              resolve() {
                return {};
              },
            };
          },
          { isDummyField: true }
        ),
      });
    });
  };

  return {
    plugin: DummyWatchPlugin,
    eventEmitter,
    setN(n) {
      counter = n;
    },
  };
};

test("generated schema n = 0, n = 3", async () => {
  const schema0 = (await getBuilder([
    ...defaultPlugins,
    makePluginEtc(0).plugin,
  ])).buildSchema();
  expect(schema0).toMatchSnapshot();
  const schema3 = (await getBuilder([
    ...defaultPlugins,
    makePluginEtc(3).plugin,
  ])).buildSchema();
  expect(schema3).toMatchSnapshot();
});

test("schema is cached if no watcher fires", async () => {
  const { plugin, setN } = makePluginEtc();
  const builder = await getBuilder([...defaultPlugins, plugin], options);
  await builder.watchSchema();

  const schema0 = builder.buildSchema();
  const schema0_2 = builder.buildSchema();
  setN(70);
  const schema0_3 = builder.buildSchema();
  expect(schema0).toBe(schema0_2);
  expect(schema0).toBe(schema0_3);

  await builder.unwatchSchema();
});

test("schema is equivalent (but not identical) if rebuild fires but no changes occur", async () => {
  const { plugin, eventEmitter } = makePluginEtc();
  const builder = await getBuilder([...defaultPlugins, plugin], options);
  await builder.watchSchema();

  const schema0 = builder.buildSchema();
  eventEmitter.emit("change");
  const schema0_2 = builder.buildSchema();

  expect(schema0).not.toBe(schema0_2);
  expect(printSchema(schema0)).toEqual(printSchema(schema0_2));

  await builder.unwatchSchema();
});

test("schema is updated when rebuild triggered", async () => {
  const { plugin, setN, eventEmitter } = makePluginEtc();
  const builder = await getBuilder([...defaultPlugins, plugin], options);
  await builder.watchSchema();

  const schema0 = builder.buildSchema();
  setN(70);
  eventEmitter.emit("change");
  const schema1 = builder.buildSchema();

  expect(schema0).not.toEqual(schema1);
  expect(printSchema(schema0)).not.toEqual(printSchema(schema1));

  const getNFrom = async schema => {
    const result = await graphql(
      schema,
      `
        query {
          dummy {
            n
          }
        }
      `
    );
    if (result.errors) {
      // eslint-disable-next-line no-console
      console.log(result.errors.map(e => e.originalError));
    }
    expect(result.errors).toBeFalsy();
    return result.data.dummy.n;
  };

  expect(await getNFrom(schema0)).toEqual(0);
  expect(await getNFrom(schema1)).toEqual(70);

  await builder.unwatchSchema();
});
