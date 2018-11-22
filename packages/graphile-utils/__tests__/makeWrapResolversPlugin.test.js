import { gql, makeWrapResolversPlugin, makeExtendSchemaPlugin } from "../";
import {
  buildSchema,
  // defaultPlugins,
  StandardTypesPlugin,
  QueryPlugin,
  MutationPlugin,
  SubscriptionPlugin,
  MutationPayloadQueryPlugin,
} from "graphile-build";
import { graphql } from "graphql";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const makeSchemaWithSpyAndPlugins = (spy, plugins) =>
  buildSchema(
    [
      StandardTypesPlugin,
      QueryPlugin,
      MutationPlugin,
      SubscriptionPlugin,
      MutationPayloadQueryPlugin,
      makeExtendSchemaPlugin(_build => ({
        typeDefs: gql`
          extend type Query {
            echo(message: String!): String
          }
        `,
        resolvers: {
          Query: {
            echo: spy,
          },
        },
      })),
      ...plugins,
    ],
    {
      optionKey: "optionValue",
    }
  );

const makeEchoSpy = fn =>
  jest.fn(
    fn ||
      ((parent, args, _context, _resolveInfo) => {
        return args.message;
      })
  );

it("passes args by default", async () => {
  const wrappers = [
    resolve => resolve(),
    (resolve, parent) => resolve(parent),
    (resolve, parent, args) => resolve(parent, args),
    (resolve, parent, args, context) => resolve(parent, args, context),
    (resolve, parent, args, context, resolveInfo) =>
      resolve(parent, args, context, resolveInfo),
  ];

  for (const wrapper of wrappers) {
    const spy = makeEchoSpy();
    const schema = await makeSchemaWithSpyAndPlugins(spy, [
      makeWrapResolversPlugin({
        Query: {
          echo: wrapper,
        },
      }),
    ]);
    const rootValue = { root: true };
    const result = await graphql(
      schema,
      `
        {
          echo(message: "Hello")
        }
      `,
      rootValue,
      { test: true }
    );
    expect(result.errors).toBeFalsy();
    expect(result.data.echo).toEqual("Hello");
    expect(spy).toHaveBeenCalledTimes(1);
    const spyArgs = spy.mock.calls[0];
    const [parent, args, context, resolveInfo] = spyArgs;
    expect(parent).toBe(rootValue);
    expect(args).toEqual({ message: "Hello" });
    expect(context).toEqual({ test: true });
    expect(resolveInfo).toBeTruthy();
  }
});

it("can override args", async () => {
  const wrapper = (resolve, parent, args, context) =>
    resolve(
      { ...parent, rideover: true },
      { message: args.message.toUpperCase() },
      { ...context, override: true }
    );

  const spy = makeEchoSpy();
  const schema = await makeSchemaWithSpyAndPlugins(spy, [
    makeWrapResolversPlugin({
      Query: {
        echo: wrapper,
      },
    }),
  ]);
  const rootValue = { root: true };
  const result = await graphql(
    schema,
    `
      {
        echo(message: "Hello")
      }
    `,
    rootValue,
    { test: true }
  );
  expect(result.errors).toBeFalsy();
  expect(result.data.echo).toEqual("HELLO");
  expect(spy).toHaveBeenCalledTimes(1);
  const spyArgs = spy.mock.calls[0];
  const [parent, args, context, resolveInfo] = spyArgs;
  expect(parent).toEqual({ ...rootValue, rideover: true });
  expect(args).toEqual({ message: "HELLO" });
  expect(context).toEqual({ test: true, override: true });
  expect(resolveInfo).toBeTruthy();
});

it("can asynchronously abort resolver before", async () => {
  const wrapper = async () => {
    await delay(10);
    throw new Error("Abort");
  };
  let called = false;
  const spy = makeEchoSpy(() => {
    called = true;
  });
  const schema = await makeSchemaWithSpyAndPlugins(spy, [
    makeWrapResolversPlugin({
      Query: {
        echo: wrapper,
      },
    }),
  ]);
  const rootValue = { root: true };
  const result = await graphql(
    schema,
    `
      {
        echo(message: "Hello")
      }
    `,
    rootValue,
    { test: true }
  );
  expect(result.errors).toBeTruthy();
  expect(result.data.echo).toBe(null);
  expect(spy).not.toHaveBeenCalled();
  expect(result.errors).toHaveLength(1);
  expect(called).toBe(false);
  expect(result.errors[0]).toMatchInlineSnapshot(`[GraphQLError: Abort]`);
});

it("can asynchronously abort resolver after", async () => {
  const wrapper = async resolve => {
    const result = await resolve();
    // eslint-disable-next-line no-constant-condition
    if (true) {
      await delay(10);
      throw new Error("Abort");
    }
    return result;
  };
  let called = false;
  const spy = makeEchoSpy(() => {
    called = true;
  });
  const schema = await makeSchemaWithSpyAndPlugins(spy, [
    makeWrapResolversPlugin({
      Query: {
        echo: wrapper,
      },
    }),
  ]);
  const rootValue = { root: true };
  const result = await graphql(
    schema,
    `
      {
        echo(message: "Hello")
      }
    `,
    rootValue,
    { test: true }
  );
  expect(result.errors).toBeTruthy();
  expect(result.data.echo).toBe(null);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(result.errors).toHaveLength(1);
  expect(called).toBe(true);
  expect(result.errors[0]).toMatchInlineSnapshot(`[GraphQLError: Abort]`);
});

it("can modify result of resolver", async () => {
  const wrapper = async resolve => {
    const result = await resolve();
    return result.toLowerCase();
  };
  const spy = makeEchoSpy();
  const schema = await makeSchemaWithSpyAndPlugins(spy, [
    makeWrapResolversPlugin({
      Query: {
        echo: wrapper,
      },
    }),
  ]);
  const rootValue = { root: true };
  const result = await graphql(
    schema,
    `
      {
        echo(message: "Hello")
      }
    `,
    rootValue,
    { test: true }
  );
  expect(result.errors).toBeFalsy();
  expect(result.data.echo).toBe("hello");
  expect(spy).toHaveBeenCalledTimes(1);
  const spyArgs = spy.mock.calls[0];
  const [parent, args, context, resolveInfo] = spyArgs;
  expect(parent).toBe(rootValue);
  expect(args).toEqual({ message: "Hello" });
  expect(context).toEqual({ test: true });
  expect(resolveInfo).toBeTruthy();
});

it("can supports options modify result of resolver", async () => {
  const wrapper = async resolve => {
    const result = await resolve();
    return result.toLowerCase();
  };
  const spy = makeEchoSpy();
  let options;
  const schema = await makeSchemaWithSpyAndPlugins(spy, [
    makeWrapResolversPlugin(_options => {
      options = _options;
      return {
        Query: {
          echo: {
            resolve: wrapper,
          },
        },
      };
    }),
  ]);
  const rootValue = { root: true };
  const result = await graphql(
    schema,
    `
      {
        echo(message: "Hello")
      }
    `,
    rootValue,
    { test: true }
  );
  expect(options).toBeTruthy();
  expect(options.optionKey).toEqual("optionValue");
  expect(result.errors).toBeFalsy();
  expect(result.data.echo).toBe("hello");
  expect(spy).toHaveBeenCalledTimes(1);
  const spyArgs = spy.mock.calls[0];
  const [parent, args, context, resolveInfo] = spyArgs;
  expect(parent).toBe(rootValue);
  expect(args).toEqual({ message: "Hello" });
  expect(context).toEqual({ test: true });
  expect(resolveInfo).toBeTruthy();
});
