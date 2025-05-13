/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { resolvePreset } from "graphile-config";

import { constant, makeGrafastSchema } from "../../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

export const makeBaseArgs = () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        a: Int
      }
    `,
    plans: {
      Query: {
        a() {
          return constant(42);
        },
      },
    },
  });
  return {
    schema,
    resolvedPreset,
    requestContext,
    variableValues: {},
    contextValue: {},
  };
};
