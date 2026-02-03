/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import { constant, grafast, makeGrafastSchema } from "../dist/index.js";

const makeSchema = () =>
  makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
      }
    `,
    objects: {
      Query: {
        plans: {
          hello() {
            return constant("world");
          },
        },
      },
    },
    enableDeferStream: false,
  });

it("runs grafast execute middleware in order", async () => {
  const calls: string[] = [];
  const MiddlewarePlugin: GraphileConfig.Plugin = {
    name: "TestExecuteMiddleware",
    grafast: {
      middleware: {
        execute(next, event) {
          calls.push("before");
          return next.callback((error, result) => {
            calls.push("after");
            if (error) {
              throw error;
            }
            return result;
          });
        },
      },
    },
  };
  const resolvedPreset = resolvePreset({ plugins: [MiddlewarePlugin] });
  const schema = makeSchema();
  const result = (await grafast({
    schema,
    source: "{ hello }",
    resolvedPreset,
    requestContext: {},
  })) as ExecutionResult;
  expect(result.errors).not.to.exist;
  expect(result.data).to.deep.equal({ hello: "world" });
  expect(calls).to.deep.equal(["before", "after"]);
});
