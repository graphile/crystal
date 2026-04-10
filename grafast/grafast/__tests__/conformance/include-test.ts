/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { describe, it } from "mocha";

import { assertConformance, makeConformanceSchema } from "./utils";

const schema = makeConformanceSchema(/* GraphQL */ `
  type Query implements SomeInterface {
    int: Int
    abstract: SomeInterface
  }

  interface SomeInterface {
    int: Int
  }
`);

describe("handles @include within abstract position fragment spreads", () => {
  const source = /* GraphQL */ `
    query ($include: Boolean!) {
      abstract {
        ... @include(if: $include) {
          int
        }
      }
    }
  `;
  it("handles $include: true", async () => {
    await assertConformance(schema, source, { include: true });
  });
  it("handles $include: false", async () => {
    await assertConformance(schema, source, { include: false });
  });
});

describe("handles @skip within abstract position fragment spreads", () => {
  const source = /* GraphQL */ `
    query ($exclude: Boolean!) {
      abstract {
        ... @skip(if: $exclude) {
          int
        }
      }
    }
  `;
  it("handles $exclude: true", async () => {
    await assertConformance(schema, source, { exclude: true });
  });
  it("handles $exclude: false", async () => {
    await assertConformance(schema, source, { exclude: false });
  });
});
