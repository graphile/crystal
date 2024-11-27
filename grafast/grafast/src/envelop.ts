import type { Plugin as EnvelopPlugin } from "@envelop/core";
import { resolvePreset } from "graphile-config";
import type { IncomingMessage } from "http";

import { execute as grafastExecute } from "./execute.js";
import { stripAnsi } from "./stripAnsi.js";
import { subscribe as grafastSubscribe } from "./subscribe.js";

export interface UseGrafastOptions {
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
  // PERF: there's probably a faster way to do this...
  return explainAllowed.filter((p) => explainParts.includes(p));
}

/**
 * An Envelop plugin that uses Grafast to prepare and execute the GraphQL
 * query.
 */
export const useGrafast = (options: UseGrafastOptions = {}): EnvelopPlugin => {
  const { explainAllowed = true } = options;
  return {
    async onExecute(opts) {
      const explainHeaders = (
        (opts.args.contextValue as any)?.req as IncomingMessage | undefined
      )?.headers["x-graphql-explain"];
      const explain = processExplain(explainAllowed, explainHeaders);
      opts.setExecuteFn((args) =>
        grafastExecute(
          args,
          resolvePreset({
            grafast: { explain },
          }),
        ),
      );
    },
    async onSubscribe(opts) {
      const ctx = opts.args.contextValue as any;
      const explainHeaders = (ctx?.req?.headers ||
        ctx?.request?.headers ||
        ctx?.connectionParams)?.["x-graphql-explain"];
      const explain = processExplain(explainAllowed, explainHeaders);
      opts.setSubscribeFn(async (args) =>
        grafastSubscribe(
          args,
          resolvePreset({
            grafast: { explain },
          }),
        ),
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
