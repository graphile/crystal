/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans */
import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import { constant, grafast, makeGrafastSchema } from "../dist/index.js";

async function execute(
  schema: ReturnType<typeof makeGrafastSchema>,
  source: string,
) {
  const result = await grafast({ schema, source });
  if ("next" in result) throw new Error("Iterator not expected");
  return result as ExecutionResult;
}

it("currently warns and silently nulls a non-array list result", async () => {
  const schema = makeGrafastSchema({
    typeDefs: "type Query { values: [String] }",
    objects: {
      Query: {
        plans: { values: () => constant("not-an-array") },
      },
    },
  });

  const warnings: unknown[][] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => warnings.push(args);
  try {
    const result = await execute(schema, "{ values }");
    expect(result.data).to.deep.equal({ values: null });
    expect(result.errors).to.equal(undefined);
    expect(warnings).to.have.length(1);
  } finally {
    console.warn = originalWarn;
  }
});
