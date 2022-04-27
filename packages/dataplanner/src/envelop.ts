import type { Plugin as EnvelopPlugin } from "@envelop/core";
import type { IncomingMessage } from "http";

import { execute as dataplannerExecute } from "./execute.js";
import { stripAnsi } from "./stripAnsi.js";
import { subscribe as dataplannerSubscribe } from "./subscribe.js";

export interface UseDataPlannerOptions {
  /**
   * Set true to enable the GraphQL bypass, false otherwise.
   */
  experimentalGraphQLBypass?: boolean;

  /**
   * Set this to 'true' to allow all explains; set it to a list of the allowed
   * explains to allow only those, set it to false to disable explains.
   */
  explainAllowed?: boolean | string[];
}

function processExplain(
  explainAllowed: boolean | string[] | undefined,
  explainHeaders: string[] | string | undefined,
): string[] | undefined {
  if (
    explainAllowed === false ||
    (Array.isArray(explainAllowed) && explainAllowed.length === 0)
  ) {
    return undefined;
  }
  const explainHeader = Array.isArray(explainHeaders)
    ? explainHeaders.join(",")
    : explainHeaders;
  if (!explainHeader) {
    return undefined;
  }
  const explainParts = explainHeader.split(",");
  if (explainAllowed === true || explainAllowed === undefined) {
    return explainParts;
  }

  // Assumption: explainAllowed is relatively short (and unique).
  // TODO: there's probably a faster way to do this...
  return explainAllowed.filter((p) => explainParts.includes(p));
}

/**
 * An Envelop plugin that uses DataPlanner to prepare and execute the GraphQL
 * query.
 */
export const useDataPlanner = (
  options: UseDataPlannerOptions = {},
): EnvelopPlugin => {
  const { explainAllowed = true } = options;
  return {
    async onExecute(opts) {
      const explainHeaders = (
        (opts.args.contextValue as any)?.req as IncomingMessage | undefined
      )?.headers["x-graphql-explain"];
      const explain = processExplain(explainAllowed, explainHeaders);
      const experimentalGraphQLBypass =
        options.experimentalGraphQLBypass ?? true;
      opts.setExecuteFn((args) =>
        dataplannerExecute(args, { experimentalGraphQLBypass, explain }),
      );
    },
    async onSubscribe(opts) {
      const ctx = opts.args.contextValue as any;
      const explainHeaders = (ctx?.req?.headers ||
        ctx?.request?.headers ||
        ctx?.connectionParams)?.["x-graphql-explain"];
      const explain = processExplain(explainAllowed, explainHeaders);
      const experimentalGraphQLBypass =
        options.experimentalGraphQLBypass ?? true;
      opts.setSubscribeFn(async (args) =>
        dataplannerSubscribe(args, { experimentalGraphQLBypass, explain }),
      );
    },
  };
};

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
