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

describe("wrapping named resolvers", () => {
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
});

describe("wrapping resolvers matching a filter", () => {
  it("filters correctly", async () => {
    const filter = context => {
      if (context.scope.isRootMutation && context.scope.fieldName !== "c") {
        return { scope: context.scope };
      }
      return null;
    };
    const before = [];
    const after = [];
    const rule = ({ scope }) => async (
      resolver,
      user,
      args,
      _context,
      _resolveInfo
    ) => {
      before.push([
        `Mutation '${scope.fieldName}' starting with arguments:`,
        args,
      ]);
      const result = await resolver();
      after.push([`Mutation '${scope.fieldName}' result:`, result]);
      return result;
    };
    const schema = await makeSchemaWithSpyAndPlugins(null, [
      makeExtendSchemaPlugin({
        typeDefs: gql`
          extend type Mutation {
            a(arg1: Int = 1, arg2: Int = 2): Int
            b(arg1: String = "1", arg2: String = "2"): String
            c(arg1: String = "1", arg2: String = "2"): String
          }
        `,
        resolvers: {
          Mutation: {
            a: (_, { arg1, arg2 }) => arg1 + arg2,
            b: (_, { arg1, arg2 }) => arg1 + arg2,
            c: (_, { arg1, arg2 }) => arg1 + arg2,
          },
        },
      }),
      makeWrapResolversPlugin(filter, rule),
    ]);
    const rootValue = { root: true };
    const result = await graphql(
      schema,
      `
        mutation {
          a(arg2: 7)
          b(arg2: "ARG2")
          c(arg2: "NOWRAP")
        }
      `,
      rootValue,
      { test: true }
    );
    expect(result.errors).toBeFalsy();
    expect(result.data.a).toBe(8);
    expect(result.data.b).toBe("1ARG2");
    expect(result.data.c).toBe("1NOWRAP");
    expect(before.length).toEqual(2);
    expect(after.length).toEqual(2);
    expect(before).toMatchInlineSnapshot(`
Array [
  Array [
    "Mutation 'a' starting with arguments:",
    Object {
      "arg1": 1,
      "arg2": 7,
    },
  ],
  Array [
    "Mutation 'b' starting with arguments:",
    Object {
      "arg1": "1",
      "arg2": "ARG2",
    },
  ],
]
`);
    expect(after).toMatchInlineSnapshot(`
Array [
  Array [
    "Mutation 'a' result:",
    8,
  ],
  Array [
    "Mutation 'b' result:",
    "1ARG2",
  ],
]
`);
  });
});
