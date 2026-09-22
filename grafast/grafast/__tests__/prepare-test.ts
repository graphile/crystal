/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/no-nested */
import { expect } from "chai";
import { parse } from "graphql";
import { it } from "mocha";

import {
  execute,
  makeGrafastSchema,
  prepare,
  sideEffect,
} from "../dist/index.js";

it("prepares an operation without executing it", async () => {
  let executions = 0;
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
      }
    `,
    objects: {
      Query: {
        plans: {
          hello() {
            return sideEffect(null, () => {
              executions++;
              return "world";
            });
          },
        },
      },
    },
    enableDeferStream: false,
  });
  const args = { schema, document: parse("query { hello }") };

  const prepared = prepare(args);
  if (prepared.errors) throw prepared.errors[0];
  expect(executions).to.equal(0);

  const result = await execute(args);
  expect(result).to.deep.equal({ data: { hello: "world" } });
  expect(executions).to.equal(1);

  const preparedAgain = prepare(args);
  if (preparedAgain.errors) throw preparedAgain.errors[0];
  expect(preparedAgain.operationPlan).to.equal(prepared.operationPlan);
});
