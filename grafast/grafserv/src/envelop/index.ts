import {
  envelop,
  type GetEnvelopedFn,
  useEngine,
  useEnvelop,
  useSchema,
} from "@envelop/core";
import type { GraphileConfig } from "graphile-config";
import * as graphql from "graphql";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface GrafservOptions {
      getEnveloped?: GetEnvelopedFn<any>;
    }
  }
}

export const GrafservEnvelopPlugin: GraphileConfig.Plugin = {
  name: "GrafservEnvelopPlugin",
  version,

  grafserv: {
    middleware: {
      setPreset(next, event) {
        const { resolvedPreset } = event;
        const userGetEnveloped = resolvedPreset.grafserv?.getEnveloped;
        if (!userGetEnveloped) {
          throw new Error(
            `GrafservEnvelopPlugin is enabled, but there is no 'preset.grafserv.getEnveloped' method to call`,
          );
        }
        const originalGetExecutionConfig = event.getExecutionConfig;
        event.getExecutionConfig = async function getExecutionConfig(ctx) {
          const config = await originalGetExecutionConfig.call(this, ctx);
          const getEnveloped = envelop({
            plugins: [
              // PERF: memoize argument if it makes any difference
              useEngine({
                ...graphql,
                execute: config.execute,
                subscribe: config.subscribe,
                specifiedRules: event.validationRules,
              }),
              useSchema(config.schema),
              useEnvelop(userGetEnveloped),
            ],
          });
          const {
            schema,
            execute,
            subscribe,
            contextFactory,
            parse: envelopedParse,
            validate: envelopedValidate,
          } = getEnveloped(ctx);
          const parseAndValidate = (query: string) => {
            const source = new graphql.Source(query, "GraphQL HTTP Request");
            let document;
            try {
              document = envelopedParse(source);
            } catch (e) {
              return { errors: [e] };
            }
            const errors = envelopedValidate(schema, document);
            return errors.length ? { errors } : { document };
          };

          return {
            ...config,
            contextValue: contextFactory(ctx),
            schema,
            execute,
            subscribe,
            parseAndValidate,
          };
        };
        return next();
      },
    },
  },
};

export const GrafservEnvelopPreset: GraphileConfig.Preset = {
  plugins: [GrafservEnvelopPlugin],
  grafserv: {
    // Let Envelop handle error masking
    maskError(e) {
      return e;
    },
  },
};
