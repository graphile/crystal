/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import { grafast } from "../../dist/index.js";
import { makeBaseArgs } from "./dcc-schema.js";

it("test", async () => {
  const baseArgs = makeBaseArgs();
  const source = /* GraphQL */ `
    {
      crawler(id: 101) {
        id
        name
        ... on ActiveCrawler {
          species
          friends {
            id
            name
          }
        }
      }
    }
  `;
  const result = (await grafast({
    ...baseArgs,
    source,
  })) as ExecutionResult;
  if (result.errors) {
    console.dir(result.errors);
  }
  expect(result.errors).not.to.exist;
  expect(result.data).to.deep.equal({ a: 42 });
});
