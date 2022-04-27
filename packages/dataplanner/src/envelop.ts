import type { Plugin as EnvelopPlugin } from "@envelop/core";

import { execute as dataplannerExecute } from "./execute.js";
import { stripAnsi } from "./stripAnsi.js";

/**
 * An Envelop plugin that uses DataPlanner to prepare and execute the GraphQL
 * query.
 */
export const useDataPlanner = (): EnvelopPlugin => ({
  async onExecute(opts) {
    opts.setExecuteFn(dataplannerExecute);
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
