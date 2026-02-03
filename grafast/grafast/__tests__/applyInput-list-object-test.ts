/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import {
  ConstantStep,
  grafast,
  makeGrafastSchema,
  Modifier,
  UnbatchedStep,
} from "../dist/index.js";

type FilterEntry = { field: string; value: number };

class FilterCollector {
  filters: FilterEntry[] = [];
}

class FilterModifier extends Modifier<FilterCollector> {
  private field?: string;
  private value?: number;

  setField(field: string) {
    this.field = field;
  }

  setValue(value: number) {
    this.value = value;
  }

  apply(): void {
    if (this.field == null || this.value == null) {
      throw new Error("FilterModifier missing field or value");
    }
    this.parent.filters.push({ field: this.field, value: this.value });
  }
}

class FilterCollectorStep extends UnbatchedStep<string[]> {
  private constantApplies: Array<(collector: FilterCollector) => void> = [];

  apply($apply: UnbatchedStep<(collector: FilterCollector) => void>) {
    if ($apply instanceof ConstantStep) {
      this.constantApplies.push($apply.data);
    } else {
      this.addUnaryDependency($apply);
    }
  }

  unbatchedExecute(
    _extra: unknown,
    ...applyFns: Array<(collector: FilterCollector) => void>
  ) {
    const collector = new FilterCollector();
    for (const fn of this.constantApplies) {
      fn(collector);
    }
    for (const fn of applyFns) {
      fn(collector);
    }
    return collector.filters.map((filter) => `${filter.field}=${filter.value}`);
  }
}

const resolvedPreset = resolvePreset({});
const requestContext = {};

const makeSchema = () =>
  makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      input FilterInput {
        field: String!
        value: Int!
      }

      input FilterSetInput {
        filters: [FilterInput!]!
      }

      type Query {
        applyFilters(input: FilterSetInput): [String!]!
      }
    `,
    inputObjects: {
      FilterSetInput: {
        plans: {
          filters(target: FilterCollector) {
            return () => new FilterModifier(target);
          },
        },
      },
      FilterInput: {
        plans: {
          field(target: FilterModifier, value: string) {
            target.setField(value);
          },
          value(target: FilterModifier, value: number) {
            target.setValue(value);
          },
        },
      },
    },
    objects: {
      Query: {
        plans: {
          applyFilters(_parent, fieldArgs) {
            const $collector = new FilterCollectorStep();
            fieldArgs.apply($collector, "input");
            return $collector;
          },
        },
      },
    },
    enableDeferStream: false,
  });

it("applies object fields inside list inputs", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query {
      applyFilters(
        input: {
          filters: [{ field: "name", value: 1 }, { field: "email", value: 2 }]
        }
      )
    }
  `;
  const result = (await grafast({
    schema,
    source,
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  expect(result.errors).not.to.exist;
  expect(result.data).to.deep.equal({
    applyFilters: ["name=1", "email=2"],
  });
});
