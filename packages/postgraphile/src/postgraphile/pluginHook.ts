import * as assert from "assert";
import type chalk from "chalk";
import * as graphql from "graphql";
import type { IncomingMessage, Server, ServerResponse } from "http";
import type httpError from "http-errors";
import type { Pool } from "pg";
import type { ExecutionParams } from "subscriptions-transport-ws";
import type * as WebSocket from "ws";

// @ts-ignore
import { version } from "../../package.json";
import type {
  CreateRequestHandlerOptions,
  HttpRequestHandler,
} from "../interfaces";
import type { AddFlagFn } from "./cli";
import type { WithPostGraphileContextFn } from "./withPostGraphileContext";

// tslint:disable-next-line no-any
interface PostGraphileHooks {
  init: [
    null,
    {
      version: string;
      graphql: typeof import("graphql");
    },
  ];

  pluginHook: [PluginHookFn, null];

  "cli:flags:add:standard": [AddFlagFn, null];
  "cli:flags:add:schema": [AddFlagFn, null];
  "cli:flags:add:errorHandling": [AddFlagFn, null];
  "cli:flags:add:plugins": [AddFlagFn, null];
  "cli:flags:add:noServer": [AddFlagFn, null];
  "cli:flags:add:webserver": [AddFlagFn, null];
  "cli:flags:add:jwt": [AddFlagFn, null];
  "cli:flags:add": [AddFlagFn, null];
  "cli:flags:add:deprecated": [AddFlagFn, null];
  "cli:flags:add:workarounds": [AddFlagFn, null];
  // tslint:disable-next-line no-any
  "cli:library:options": [
    GraphileEngine.PostGraphileOptions<any, any>,
    { config: any; cliOptions: any },
  ];
  "cli:server:created": [
    Server,
    {
      options: GraphileEngine.PostGraphileOptions<any, any>;
      middleware: HttpRequestHandler<IncomingMessage, ServerResponse>;
    },
  ];
  "cli:greeting": [
    Array<string | null | void>,
    {
      options: GraphileEngine.PostGraphileOptions<any, any>;
      middleware: HttpRequestHandler<IncomingMessage, ServerResponse>;
      port: any;
      chalk: typeof chalk;
    },
  ];

  "postgraphile:options": [
    GraphileEngine.PostGraphileOptions<any, any>,
    { pgPool: Pool; schema: string | string[] },
  ];
  "postgraphile:validationRules:static": [
    typeof graphql.specifiedRules,
    {
      options: GraphileEngine.PostGraphileOptions<any, any>;
    },
  ];
  "postgraphile:graphiql:html": [
    string,
    {
      options: GraphileEngine.PostGraphileOptions<any, any>;
    },
  ];
  "postgraphile:http:handler": [
    IncomingMessage,
    {
      options: CreateRequestHandlerOptions;
      res: ServerResponse;
      next: (err?: Error | undefined) => void;
    },
  ];
  "postgraphile:http:result": [
    PostGraphileHTTPResult,
    {
      options: CreateRequestHandlerOptions;
      returnArray: boolean;
      queryDocumentAst: graphql.DocumentNode | null;
      req: IncomingMessage;
      pgRole: string | undefined;
    },
  ];
  "postgraphile:http:end": [
    PostGraphileHTTPEnd,
    {
      options: CreateRequestHandlerOptions;
      returnArray: boolean;
      req: IncomingMessage;
      res: ServerResponse;
    },
  ];
  "postgraphile:httpParamsList": [
    Array<object>,
    {
      options: CreateRequestHandlerOptions;
      req: IncomingMessage;
      res: ServerResponse;
      returnArray: boolean;
      httpError: typeof httpError;
    },
  ];

  /** AVOID THIS where possible; use 'postgraphile:validationRules:static' instead. */
  "postgraphile:validationRules": [
    typeof graphql.specifiedRules,
    {
      options: CreateRequestHandlerOptions;
      req: IncomingMessage;
      res: ServerResponse;
      variables: { [key: string]: any };
      operationName: string;
      meta: {};
    },
  ];
  "postgraphile:middleware": [
    HttpRequestHandler,
    {
      options: GraphileEngine.PostGraphileOptions<any, any>;
    },
  ];
  "postgraphile:ws:onOperation": [
    ExecutionParams,
    {
      message: any;
      params: ExecutionParams<any>;
      socket: WebSocket;
      options: CreateRequestHandlerOptions;
    },
  ];

  withPostGraphileContext: [
    WithPostGraphileContextFn<any>,
    {
      options: GraphileEngine.PostGraphileOptions<any, any>;
    },
  ];
}

export type HookName = keyof PostGraphileHooks;
export type HookType<
  THookName extends HookName
> = PostGraphileHooks[THookName][0];
export type HookContext<
  THookName extends HookName
> = PostGraphileHooks[THookName][1];

export type PluginHookFn = <THookName extends HookName>(
  hookName: THookName,
  argument: HookType<THookName>,
  context: HookContext<THookName>,
) => HookType<THookName>;
export type HookFn<THookName extends HookName> = (
  argument: HookType<THookName>,
  context: HookContext<THookName>,
) => HookType<THookName>;

export interface PostGraphileHTTPResult {
  statusCode?: number;
  result?: object;
  errors?: Array<object>;
  meta?: object;
}
export interface PostGraphileHTTPEnd {
  statusCode?: number;
  result: object | Array<object>;
}
export type PostGraphilePlugin = {
  [k in HookName]?: HookFn<k>;
};

const identityHook = <T>(input: T): T => input;
const identityPluginHook: PluginHookFn = (_hookName, input, _options) => input;

function contextIsSame(context1: {} | null, context2: {} | null): boolean {
  // Shortcut if obvious
  if (context1 === context2) {
    return true;
  }
  if (!context1 || !context2) {
    return false;
  }
  // Blacklist approach from now on
  const keys1 = Object.keys(context1);
  const keys2 = Object.keys(context2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  // tslint:disable-next-line one-variable-per-declaration
  for (let i = 0, l = keys1.length; i < l; i++) {
    const key = keys1[i];
    if (context1[key] !== context2[key]) {
      return false;
    }
    if (!keys2.includes(key)) {
      return false;
    }
  }

  return true;
}

// Caches the last value of the hook, in case it's called with exactly the same
// arguments again.
function memoizeHook<THookName extends HookName>(
  hook: HookFn<THookName>,
): HookFn<THookName> {
  let lastCall: {
    argument: HookType<THookName>;
    context: HookContext<THookName>;
    result: HookType<THookName>;
  } | null = null;
  return (
    argument: HookType<THookName>,
    context: HookContext<THookName>,
  ): HookType<THookName> => {
    if (
      lastCall &&
      lastCall.argument === argument &&
      contextIsSame(lastCall.context, context)
    ) {
      return lastCall.result;
    } else {
      const result = hook(argument, context);
      lastCall = {
        argument,
        context,
        result,
      };
      return result;
    }
  };
}

function shouldMemoizeHook(hookName: HookName): boolean {
  return hookName === "withPostGraphileContext";
}

function makeHook<THookName extends HookName>(
  plugins: Array<PostGraphilePlugin>,
  hookName: THookName,
): HookFn<THookName> {
  const combinedHook = plugins.reduce(
    (previousHook: HookFn<THookName>, plugin) => {
      const p = plugin[hookName] as HookFn<THookName> | undefined;
      if (typeof p === "function") {
        const hook: HookFn<THookName> = (
          argument: HookType<THookName>,
          context: HookContext<THookName>,
        ) => {
          return p(previousHook(argument, context), context);
        };
        return hook;
      } else {
        return previousHook;
      }
    },
    identityHook,
  );
  if (combinedHook === identityHook) {
    return identityHook;
  } else if (shouldMemoizeHook(hookName)) {
    return memoizeHook<THookName>(combinedHook);
  } else {
    return combinedHook;
  }
}

export function makePluginHook(
  plugins: Array<PostGraphilePlugin>,
): PluginHookFn {
  const hooks: {
    [k in HookName]?: HookFn<k>;
  } = {};
  const rawPluginHook: PluginHookFn = <THookName extends HookName>(
    hookName: THookName,
    argument: HookType<THookName>,
    context: HookContext<THookName>,
  ) => {
    if (!hooks[hookName]) {
      hooks[hookName] = makeHook(plugins, hookName) as any;
    }
    const hook = hooks[hookName] as HookFn<THookName> | undefined;
    assert.ok(hook);
    return hook(argument, context);
  };

  const pluginHook: PluginHookFn = rawPluginHook(
    "pluginHook",
    rawPluginHook,
    null,
  );
  // Use this hook to check your hook is compatible with this version of
  // PostGraphile, also to get a reference to shared graphql instance.
  pluginHook("init", null, { version, graphql });
  return pluginHook;
}

export function pluginHookFromOptions<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
>(
  options: GraphileEngine.PostGraphileOptions<Request, Response>,
): PluginHookFn {
  if (typeof options.pluginHook === "function") {
    return options.pluginHook;
  } else {
    return identityPluginHook;
  }
}
