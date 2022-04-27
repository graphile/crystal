import type { Plugin as EnvelopPlugin } from "@envelop/core";
import type { IncomingMessage } from "http";

import { execute as dataplannerExecute } from "./execute.js";
import { stripAnsi } from "./stripAnsi.js";
import { subscribe as dataplannerSubscribe } from "./subscribe.js";

/**
 * An Envelop plugin that uses DataPlanner to prepare and execute the GraphQL
 * query.
 */
export const useDataPlanner = (): EnvelopPlugin => ({
  async onExecute(opts) {
    const explainHeaders = (
      (opts.args.contextValue as any)?.req as IncomingMessage | undefined
    )?.headers["x-graphql-explain"];
    const explainHeader = Array.isArray(explainHeaders)
      ? explainHeaders.join(",")
      : explainHeaders;
    const explain = explainHeader?.split(",");
    opts.setExecuteFn((args) =>
      dataplannerExecute(args, {
        experimentalGraphQLBypass: true,
        explain,
      }),
    );
  },
  async onSubscribe(opts) {
    const ctx = opts.args.contextValue as any;
    const explainHeaders = (ctx?.req?.headers ||
      ctx?.request?.headers ||
      ctx?.connectionParams)?.["x-graphql-explain"];
    const explainHeader = Array.isArray(explainHeaders)
      ? String(explainHeaders.join(","))
      : explainHeaders
      ? String(explainHeaders)
      : undefined;
    const explain = explainHeader?.split(",");
    opts.setSubscribeFn(async (args) =>
      dataplannerSubscribe(args, {
        experimentalGraphQLBypass: true,
        explain,
      }),
    );
  },
});

/**
 * An Envelop plugin that will make any GraphQL errors easier to read from
 * inside of GraphiQL.
 */
export const useMoreDetailedErrors = (): EnvelopPlugin => ({
  onExecute: () => ({
    onExecuteDone({ result }) {
      if ("errors" in result && result.errors) {
        (result.errors as any) = result.errors.map((e) => {
          const obj = e.toJSON();
          return Object.assign(obj, {
            message: stripAnsi(obj.message),
            extensions: { stack: stripAnsi(e.stack ?? "").split("\n") },
          });
        });
      }
    },
  }),
});
