/* eslint-disable graphile-export/export-methods  */
import type { ExecutableStep, FieldPlanResolver } from "grafast";
import {
  __TrackedValueStep,
  constant,
  grafast,
  lambda,
  LambdaStep,
  proxy,
  sideEffect,
} from "grafast";
import type { ExecutionResult } from "grafast/graphql";
import {
  buildSchema,
  // defaultPlugins,
  CommonTypesPlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  QueryPlugin,
  SubscriptionPlugin,
} from "graphile-build";

import type {
  PlanWrapperFilter,
  PlanWrapperFilterRule,
  PlanWrapperFn,
} from "../src/index.js";
import {
  gql,
  makeExtendSchemaPlugin,
  makeWrapPlansPlugin,
} from "../src/index.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const makeSchemaWithSpyAndPlugins = (
  spy: FieldPlanResolver<any, any, any>,
  plugins: GraphileConfig.Plugin[],
) =>
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
      schema: {
        optionKey: "optionValue",
      },
    },
    {},
    {},
  );

const makeEchoSpy = (fn?: FieldPlanResolver<any, any, any>) =>
  jest.fn(
    fn ||
      (($parent, args) => {
        return args.getRaw("message");
      }),
  );

describe("wrapping named plans", () => {
  const wrappers: Array<[number, PlanWrapperFn]> = [
    [0, (plan) => plan()],
    [1, (plan, $parent) => plan($parent)],
    [2, (plan, $parent, args) => plan($parent, args)],
    [3, (plan, $parent, args, info) => plan($parent, args, info)],
  ];
  it.each(wrappers)(
    "passes args by default when passed %i arguments",
    async (nargs, wrapper) => {
      const spy = makeEchoSpy();
      const schema = makeSchemaWithSpyAndPlugins(spy, [
        makeWrapPlansPlugin({
          Query: {
            echo: wrapper,
          },
        }),
      ]);
      const result = (await grafast({
        schema,
        source: `
          {
            echo(message: "Hello")
          }
        `,
        contextValue: { test: true },
      })) as ExecutionResult;
      expect(result.errors).toBeFalsy();
      expect(result.data.echo).toEqual("Hello");
      expect(spy).toHaveBeenCalledTimes(1);
      const spyArgs = spy.mock.calls[0];
      const [$parent, args, info] = spyArgs;
      expect($parent).toBeInstanceOf(__TrackedValueStep);
      expect(args).toBeTruthy();
      expect(info).toBeTruthy();
    },
  );

  it("can override parent", async () => {
    const wrapper: PlanWrapperFn = (plan, $parent, args, info) =>
      plan(lambda($parent, (parent) => ({ ...parent, rideover: true })));

    const spy = makeEchoSpy();
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin({
        Query: {
          echo: wrapper,
        },
      }),
    ]);
    const result = (await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      contextValue: { test: true },
    })) as ExecutionResult;
    expect(result.errors).toBeFalsy();
    expect(result.data.echo).toEqual("Hello");
    expect(spy).toHaveBeenCalledTimes(1);
    const spyArgs = spy.mock.calls[0];
    const [$parent, args, info] = spyArgs;
    expect($parent).toBeInstanceOf(LambdaStep);
    expect(args).toBeTruthy();
    expect(info).toBeTruthy();
  });

  it("can abort plan before", async () => {
    const wrapper: PlanWrapperFn = (plan) => {
      sideEffect(null, async () => {
        await delay(10);
        throw new Error("Abort");
      });

      return plan();
    };
    let called = false;
    const spy2 = jest.fn((a) => {
      called = true;
      return a;
    });
    const spy = makeEchoSpy(() => {
      return lambda(constant`hi`, spy2);
    });
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin({
        Query: {
          echo: wrapper,
        },
      }),
    ]);
    const result = (await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      contextValue: { test: true },
    })) as ExecutionResult;
    expect(result.errors).toBeTruthy();
    expect(result.data.echo).toBe(null);
    expect(spy).toHaveBeenCalled();
    // But should NOT have called the lambda
    expect(spy2).not.toHaveBeenCalled();
    expect(result.errors).toHaveLength(1);
    expect(called).toBe(false);
    expect(result.errors[0]).toMatchInlineSnapshot(`[GraphQLError: Abort]`);
  });

  it("can abort plan after", async () => {
    const wrapper: PlanWrapperFn = (plan) => {
      const $result = plan();
      // eslint-disable-next-line no-constant-condition
      const $postCheck = lambda($result, async () => {
        await delay(10);
        throw new Error("Abort");
      });
      const $proxy = proxy($result);
      $proxy.addDependency($postCheck);
      return $proxy;
    };
    let called = false;
    const spy2 = jest.fn((a) => {
      called = true;
      return a;
    });
    const spy = makeEchoSpy(() => {
      called = true;
      return lambda(constant`hi`, spy2);
    });
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin({
        Query: {
          echo: wrapper,
        },
      }),
    ]);
    const result = (await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      contextValue: { test: true },
    })) as ExecutionResult;
    expect(result.errors).toBeTruthy();
    expect(result.data.echo).toBe(null);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(result.errors).toHaveLength(1);
    expect(called).toBe(true);
    expect(result.errors[0]).toMatchInlineSnapshot(`[GraphQLError: Abort]`);
  });

  it("can modify result of plan", async () => {
    const wrapper: PlanWrapperFn = (plan) => {
      const $result = plan() as ExecutableStep<string>;
      return lambda($result, (str) => str.toLowerCase());
    };
    const spy = makeEchoSpy();
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin({
        Query: {
          echo: wrapper,
        },
      }),
    ]);
    const result = (await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      contextValue: { test: true },
    })) as ExecutionResult;
    expect(result.errors).toBeFalsy();
    expect(result.data.echo).toBe("hello");
    expect(spy).toHaveBeenCalledTimes(1);
    const spyArgs = spy.mock.calls[0];
    const [$parent, args, info] = spyArgs;
    expect($parent).toBeInstanceOf(__TrackedValueStep);
    expect(args).toBeTruthy();
    expect(info).toBeTruthy();
  });

  it("can supports options modify result of plan", async () => {
    const wrapper: PlanWrapperFn = (plan) => {
      const result = plan() as ExecutableStep<string>;
      return lambda(result, (str) => str.toLowerCase());
    };
    const spy = makeEchoSpy();
    let options: GraphileBuild.SchemaOptions;
    const schema = makeSchemaWithSpyAndPlugins(spy, [
      makeWrapPlansPlugin((build) => {
        options = build.options;
        return {
          Query: {
            echo: {
              plan: wrapper,
            },
          },
        };
      }),
    ]);
    const result = (await grafast({
      schema,
      source: `
        {
          echo(message: "Hello")
        }
      `,
      contextValue: { test: true },
    })) as ExecutionResult;
    expect(options).toBeTruthy();
    expect(options.optionKey).toEqual("optionValue");
    expect(result.errors).toBeFalsy();
    expect(result.data.echo).toBe("hello");
    expect(spy).toHaveBeenCalledTimes(1);
    const spyArgs = spy.mock.calls[0];
    const [$parent, args, info] = spyArgs;
    expect($parent).toBeInstanceOf(__TrackedValueStep);
    expect(args).toBeTruthy();
    expect(info).toBeTruthy();
  });
});

describe("wrapping plans matching a filter", () => {
  it("filters correctly", async () => {
    const filter: PlanWrapperFilter<{
      scope: GraphileBuild.ScopeObjectFieldsField;
    }> = (context) => {
      if (context.scope.isRootMutation && context.scope.fieldName !== "c") {
        return { scope: context.scope };
      }
      return null;
    };
    const before: any[] = [];
    const after: any[] = [];
    const rule: PlanWrapperFilterRule<{
      scope: GraphileBuild.ScopeObjectFieldsField;
    }> =
      ({ scope }) =>
      (plan, user, args, _info) => {
        function beforeFn(argValues: any) {
          before.push([
            `Mutation '${scope.fieldName}' starting with arguments:`,
            argValues,
          ]);
        }
        sideEffect(args.getRaw(), beforeFn);

        const $result = plan();

        function afterFn(result: any) {
          after.push([`Mutation '${scope.fieldName}' result:`, result]);
        }
        sideEffect($result, afterFn);

        return $result;
      };
    const add: FieldPlanResolver<any, any, any> = (_, args) =>
      lambda(
        [
          args.getRaw("arg1") as ExecutableStep<number>,
          args.getRaw("arg2") as ExecutableStep<number>,
        ],
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
    const result = (await grafast({
      schema,
      source: `
        mutation {
          a(arg2: 7)
          b(arg2: "ARG2")
          c(arg2: "NOWRAP")
        }
      `,
      contextValue: { test: true },
    })) as ExecutionResult;
    if (result.errors) {
      const firstError = result.errors[0];
      console.error(firstError.originalError ?? firstError);
    }
    expect(result.errors).toBeFalsy();
    expect(result.data.a).toBe(8);
    expect(result.data.b).toBe("1ARG2");
    expect(result.data.c).toBe("1NOWRAP");
    expect(before.length).toEqual(2);
    expect(after.length).toEqual(2);
    expect(before).toMatchInlineSnapshot(`
      [
        [
          "Mutation 'a' starting with arguments:",
          {
            "arg1": 1,
            "arg2": 7,
          },
        ],
        [
          "Mutation 'b' starting with arguments:",
          {
            "arg1": "1",
            "arg2": "ARG2",
          },
        ],
      ]
    `);
    expect(after).toMatchInlineSnapshot(`
      [
        [
          "Mutation 'a' result:",
          8,
        ],
        [
          "Mutation 'b' result:",
          "1ARG2",
        ],
      ]
    `);
  });
});
