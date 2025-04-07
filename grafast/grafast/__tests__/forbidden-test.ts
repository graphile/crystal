/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import type { ExecutionDetails } from "../dist/index.js";
import {
  arrayOfLength,
  grafast,
  makeGrafastSchema,
  Step,
} from "../dist/index.js";

if (process.env.NODE_ENV !== "test") {
  throw new Error(`Tests must run with NODE_ENV=test`);
}

class SomeStep extends Step {
  deduplicate(_peers: readonly Step<any>[]): readonly Step<any>[] {
    return _peers;
  }
  deduplicatedWith(replacement: Step<any>): void {}
  optimize() {
    return this;
  }
  finalize(): void {
    super.finalize();
  }
  async execute({ count }: ExecutionDetails) {
    return arrayOfLength(count, 42);
  }
}

class BadOptimizeStep extends Step {
  constructor($parent: Step) {
    super();
    this.addDependency($parent);
  }
  optimize() {
    const $parent = this.getDep(0);
    $parent.optimize?.({ meta: {}, stream: null });
    return this;
  }
  async execute({ count }: ExecutionDetails) {
    return arrayOfLength(count, 42);
  }
}

class BadFinalizeStep extends Step {
  constructor($parent: Step) {
    super();
    this.addDependency($parent);
  }
  finalize() {
    const $parent = this.getDep(0);
    $parent.finalize();
    return this;
  }
  execute({ count }: ExecutionDetails) {
    return arrayOfLength(count, 42);
  }
}

const schema = makeGrafastSchema({
  typeDefs: `
type Query {
badOptimize: Int
badFinalize: Int
}
  `,
  plans: {
    Query: {
      badOptimize() {
        return new BadOptimizeStep(new SomeStep());
      },
      badFinalize() {
        return new BadFinalizeStep(new SomeStep());
      },
    },
  },
});

it("forbids calling another step's optimize method", async () => {
  const result = (await grafast({
    schema,
    source: `{badOptimize}`,
  })) as ExecutionResult;
  expect(result.errors).to.exist;
  expect(result.errors).to.have.length(1);
  expect(result.errors![0].message).to.match(/Only Grafast.*optimize method;/);
});

it("forbids calling another step's finalize method", async () => {
  const result = (await grafast({
    schema,
    source: `{badFinalize}`,
  })) as ExecutionResult;
  expect(result.errors).to.exist;
  expect(result.errors).to.have.length(1);
  expect(result.errors![0].message).to.match(/Only Grafast.*finalize method;/);
});
