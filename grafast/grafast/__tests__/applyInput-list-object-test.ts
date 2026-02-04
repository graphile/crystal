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
  Step,
  UnbatchedStep,
} from "../dist/index.js";

type FilterEntry = { field: string; value: number };
type FilterCollector = { filters: FilterEntry[] };
type ApplyCallback = (collector: FilterCollector) => void;

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
  private baseCollector: FilterCollector = { filters: [] };
  applyDepIds: number[] = [];

  apply($apply: Step<ApplyCallback>) {
    if ($apply instanceof ConstantStep) {
      // Apply constant work at plan-time.
      const fn = $apply.data as ApplyCallback;
      fn(this.baseCollector);
    } else {
      // Dynamic - must handle at execution time.
      this.applyDepIds.push(this.addUnaryDependency($apply));
    }
  }

  unbatchedExecute(_extra: unknown, ...deps: Array<ApplyCallback>) {
    // Clone the plan-time base collector for execution-time so each execution
    // starts from the same optimized base state.
    const collector: FilterCollector = {
      filters: [...this.baseCollector.filters],
    };
    for (const idx of this.applyDepIds) {
      const applyFn = deps[idx];
      applyFn(collector);
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
            // This is a list; create new modifier for each list item
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

it("applies list inputs when input is a variable", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query ($input: FilterSetInput) {
      applyFilters(input: $input)
    }
  `;
  const result = (await grafast({
    schema,
    source,
    variableValues: {
      input: {
        filters: [
          { field: "name", value: 1 },
          { field: "email", value: 2 },
        ],
      },
    },
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  expect(result.errors).not.to.exist;
  expect(result.data).to.deep.equal({
    applyFilters: ["name=1", "email=2"],
  });
});

it("applies list inputs when input.filters is a variable", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query ($filters: [FilterInput!]!) {
      applyFilters(input: { filters: $filters })
    }
  `;
  const result = (await grafast({
    schema,
    source,
    variableValues: {
      filters: [
        { field: "name", value: 1 },
        { field: "email", value: 2 },
      ],
    },
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  expect(result.errors).not.to.exist;
  expect(result.data).to.deep.equal({
    applyFilters: ["name=1", "email=2"],
  });
});

it("applies list inputs when input.filters[1] is a variable", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query ($filter: FilterInput!) {
      applyFilters(input: { filters: [{ field: "name", value: 1 }, $filter] })
    }
  `;
  const result = (await grafast({
    schema,
    source,
    variableValues: {
      filter: { field: "email", value: 2 },
    },
    resolvedPreset,
    requestContext,
  })) as ExecutionResult;
  expect(result.errors).not.to.exist;
  expect(result.data).to.deep.equal({
    applyFilters: ["name=1", "email=2"],
  });
});
