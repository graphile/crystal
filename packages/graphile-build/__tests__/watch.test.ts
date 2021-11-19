import { EventEmitter } from "events";
import { lambda, object } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { ExecutionResult, GraphQLSchema } from "graphql";
import {
  graphql,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  printSchema,
} from "graphql";

import {
  defaultPlugins as allDefaultPlugins,
  getBuilder,
  MutationPlugin,
} from "../src";

function isAsyncIterable(
  t: ExecutionResult<any> | AsyncIterable<any>,
): t is AsyncIterable<any> {
  return Symbol.asyncIterator in t;
}

const options = {};

const defaultPlugins = allDefaultPlugins.filter(
  (plugin) => plugin !== MutationPlugin,
);

declare global {
  namespace GraphileEngine {
    interface Build {
      dummyCounter: number;
    }
    interface ScopeGraphQLObjectTypeFieldsField {
      isDummyField?: boolean;
    }
  }
}

const makePluginEtc = (defaultCounter = 0) => {
  let counter = defaultCounter;

  const eventEmitter = new EventEmitter();

  const DummyWatchPlugin: GraphileEngine.Plugin = async (builder) => {
    builder.registerWatcher(
      (triggerRebuild) => {
        eventEmitter.on("change", triggerRebuild);
      },
      (triggerRebuild) => {
        eventEmitter.removeListener("change", triggerRebuild);
      },
    );

    builder.hook("build", (build) => {
      return build.extend(
        build,
        {
          dummyCounter: counter,
        },
        "TEST",
      );
    });

    builder.hook("init", (_, build) => {
      const { dummyCounter } = build;
      build.registerObjectType(
        `Dummy${dummyCounter}`,
        {},
        null,
        () => ({
          fields: () => {
            return {
              n: {
                type: new GraphQLNonNull(GraphQLInt),
                plan: EXPORTABLE(
                  (dummyCounter, lambda) => () =>
                    lambda(null, () => dummyCounter),
                  [dummyCounter, lambda],
                ),
              },
            };
          },
        }),
        "watch.test.ts",
      );
      return _;
    });

    builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
      const { dummyCounter, extend, getTypeByName } = build;
      const {
        scope: { isRootQuery },
        fieldWithHooks,
      } = context;
      if (!isRootQuery) return fields;
      const Dummy = getTypeByName(`Dummy${dummyCounter}`);
      return extend(
        fields,
        {
          dummy: fieldWithHooks(
            { fieldName: "dummy", isDummyField: true },
            () => {
              return {
                type: Dummy,
                plan: EXPORTABLE(
                  (object) =>
                    function plan() {
                      return object({});
                    },
                  [object],
                ),
              };
            },
          ),
        },
        "TEST",
      );
    });
  };

  return {
    plugin: DummyWatchPlugin,
    eventEmitter,
    setN(n: number) {
      counter = n;
    },
  };
};

test("generated schema n = 0, n = 3", async () => {
  const schema0 = (
    await getBuilder([...defaultPlugins, makePluginEtc(0).plugin])
  ).buildSchema();
  expect(schema0).toMatchSnapshot();
  const schema3 = (
    await getBuilder([...defaultPlugins, makePluginEtc(3).plugin])
  ).buildSchema();
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

  const getNFrom = async (schema: GraphQLSchema) => {
    const result = await graphql({
      schema,
      source: `
        query {
          dummy {
            n
          }
        }
      `,
    });
    if (isAsyncIterable(result)) {
      throw new Error("Did not expect an async iterator here");
    }
    if ("errors" in result && result.errors) {
      // eslint-disable-next-line no-console
      console.log(result.errors.map((e) => e.originalError));
    }
    expect(result.errors).toBeFalsy();
    return (result.data as any)?.dummy.n;
  };

  expect(await getNFrom(schema0)).toEqual(0);
  expect(await getNFrom(schema1)).toEqual(70);

  await builder.unwatchSchema();
});
