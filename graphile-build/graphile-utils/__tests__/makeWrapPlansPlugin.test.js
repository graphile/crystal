/* eslint-disable graphile-export/export-methods  */
import { __ValueStep, constant, grafast, lambda, LambdaStep } from "grafast";
import {
  buildSchema,
  // defaultPlugins,
  CommonTypesPlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  QueryPlugin,
  SubscriptionPlugin,
} from "graphile-build";

import { gql, makeExtendSchemaPlugin, makeWrapPlansPlugin } from "../";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeSchemaWithSpyAndPlugins = (spy, plugins) =>
  buildSchema(
    {
      plugins: [
        CommonTypesPlugin,
        QueryPlugin,
        MutationPlugin,
        SubscriptionPlugin,
        MutationPayloadQueryPlugin,
        makeExtendSchemaPlugin((_build) => ({
          typeDefs: gql`
            extend type Query {
              echo(message: String!): String
            }
          `,
          plans: {
            Query: {
              echo: spy,
            },
          },
        })),
        ...plugins,
      ],
      optionKey: "optionValue",
    },
    {},
    {},
  );

const makeEchoSpy = (fn) =>
  jest.fn(
    fn ||
      (($parent, args) => {
        return args.get("message");
      }),
  );

describe("wrapping named plans", () => {
  it("passes args by default", async () => {
    const wrappers = [
      (plan) => plan(),
      (plan, $parent) => plan($parent),
      (plan, $parent, args) => plan($parent, args),
      (plan, $parent, args, info) => plan($parent, args, info),
    ];

    for (const wrapper of wrappers) {
      const spy = makeEchoSpy();
      const schema = makeSchemaWithSpyAndPlugins(spy, [
        makeWrapPlansPlugin({
          Query: {
            echo: wrapper,
          },
        }),
      ]);
      const rootValue = { root: true };
      const result = await grafast({
        schema,
        source: `
          {
            echo(message: "Hello")
          }
        `,
        rootValue,
        contextValue: { test: true },
      });
      expect(result.errors).toBeFalsy();
      expect(result.data.echo).toEqual("Hello");
      expect(spy).toHaveBeenCalledTimes(1);
      const spyArgs = spy.mock.calls[0];
      const [$parent, args, info] = spyArgs;
      expect($parent).toBeInstanceOf(__ValueStep);
      expect(args).toBeTruthy();
      expect(info).toBeTruthy();
    }
  });

  it("can override parent", async () => {
    const wrapper = (plan, $parent, args, info) =>
      plan(lambda($parent, (parent) => ({ ...parent, rideover: true })));

    const spy = makeEchoSpy();
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin({
        Query: {
          echo: wrapper,
        },
      }),
    ]);
    const rootValue = { root: true };
    const result = await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      rootValue,
      contextValue: { test: true },
    });
    expect(result.errors).toBeFalsy();
    expect(result.data.echo).toEqual("HELLO");
    expect(spy).toHaveBeenCalledTimes(1);
    const spyArgs = spy.mock.calls[0];
    const [$parent, args, info] = spyArgs;
    expect($parent).toBeInstanceOf(LambdaStep);
    expect(args).toBeTruthy();
    expect(info).toBeTruthy();
  });

  it("can abort plan before", async () => {
    const wrapper = (plan) => {
      const $preCheck = lambda(constant(null), async () => {
        await delay(10);
        throw new Error("Abort");
      });
      // Force this plan to run before any others for this field
      $preCheck.hasSideEffects = true;

      return plan();
    };
    let called = false;
    const spy = makeEchoSpy(() => {
      called = true;
    });
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin({
        Query: {
          echo: wrapper,
        },
      }),
    ]);
    const rootValue = { root: true };
    const result = await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      rootValue,
      contextValue: { test: true },
    });
    expect(result.errors).toBeTruthy();
    expect(result.data.echo).toBe(null);
    expect(spy).not.toHaveBeenCalled();
    expect(result.errors).toHaveLength(1);
    expect(called).toBe(false);
    expect(result.errors[0]).toMatchInlineSnapshot(`[GraphQLError: Abort]`);
  });

  it("can abort plan after", async () => {
    const wrapper = (plan) => {
      const $result = plan();
      // eslint-disable-next-line no-constant-condition
      const $postCheck = lambda($result, async () => {
        await delay(10);
        throw new Error("Abort");
      });
      return $result;
    };
    let called = false;
    const spy = makeEchoSpy(() => {
      called = true;
    });
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin({
        Query: {
          echo: wrapper,
        },
      }),
    ]);
    const rootValue = { root: true };
    const result = await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      rootValue,
      contextValue: { test: true },
    });
    expect(result.errors).toBeTruthy();
    expect(result.data.echo).toBe(null);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.errors).toHaveLength(1);
    expect(called).toBe(true);
    expect(result.errors[0]).toMatchInlineSnapshot(`[GraphQLError: Abort]`);
  });

  it("can modify result of plan", async () => {
    const wrapper = (plan) => {
      const result = plan();
      return lambda(result, (str) => str.toLowerCase());
    };
    const spy = makeEchoSpy();
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin({
        Query: {
          echo: wrapper,
        },
      }),
    ]);
    const rootValue = { root: true };
    const result = await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      rootValue,
      contextValue: { test: true },
    });
    expect(result.errors).toBeFalsy();
    expect(result.data.echo).toBe("hello");
    expect(spy).toHaveBeenCalledTimes(1);
    const spyArgs = spy.mock.calls[0];
    const [$parent, args, info] = spyArgs;
    expect($parent).toBeInstanceOf(__ValueStep);
    expect(args).toBeTruthy();
    expect(info).toBeTruthy();
  });

  it("can supports options modify result of plan", async () => {
    const wrapper = (plan) => {
      const result = plan();
      return lambda(result, (str) => str.toLowerCase());
    };
    const spy = makeEchoSpy();
    let options;
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin((_options) => {
        options = _options;
        return {
          Query: {
            echo: {
              plan: wrapper,
            },
          },
        };
      }),
    ]);
    const rootValue = { root: true };
    const result = await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      rootValue,
      contextValue: { test: true },
    });
    expect(options).toBeTruthy();
    expect(options.optionKey).toEqual("optionValue");
    expect(result.errors).toBeFalsy();
    expect(result.data.echo).toBe("hello");
    expect(spy).toHaveBeenCalledTimes(1);
    const spyArgs = spy.mock.calls[0];
    const [$parent, args, info] = spyArgs;
    expect($parent).toBeInstanceOf(__ValueStep);
    expect(args).toBeTruthy();
    expect(info).toBeTruthy();
  });
});

describe("wrapping plans matching a filter", () => {
  it("filters correctly", async () => {
    const filter = (context) => {
      if (context.scope.isRootMutation && context.scope.fieldName !== "c") {
        return { scope: context.scope };
      }
      return null;
    };
    const before = [];
    const after = [];
    const rule =
      ({ scope }) =>
      (plan, user, args, _info) => {
        const $before = lambda(args.get(), (argValues) => {
          before.push([
            `Mutation '${scope.fieldName}' starting with arguments:`,
            argValues,
          ]);
        });
        $before.hasSideEffects = true;

        const $result = plan();

        const $after = lambda($result, (result) => {
          after.push([`Mutation '${scope.fieldName}' result:`, result]);
        });
        $after.hasSideEffects = true;

        return $result;
      };
    const add = (_, args) =>
      lambda(
        [args.get("arg1"), args.get("arg2")],
        ([arg1, arg2]) => arg1 + arg2,
      );
    const schema = makeSchemaWithSpyAndPlugins(null, [
      makeExtendSchemaPlugin({
        typeDefs: gql`
          extend type Mutation {
            a(arg1: Int = 1, arg2: Int = 2): Int
            b(arg1: String = "1", arg2: String = "2"): String
            c(arg1: String = "1", arg2: String = "2"): String
          }
        `,
        plans: {
          Mutation: {
            a: add,
            b: add,
            c: add,
          },
        },
      }),
      makeWrapPlansPlugin(filter, rule),
    ]);
    const rootValue = { root: true };
    const result = await grafast({
      schema,
      source: `
        mutation {
          a(arg2: 7)
          b(arg2: "ARG2")
          c(arg2: "NOWRAP")
        }
      `,
      rootValue,
      contextValue: { test: true },
    });
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
