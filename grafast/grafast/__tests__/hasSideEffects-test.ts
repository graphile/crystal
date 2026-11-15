/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { it } from "mocha";

import {
  constant,
  grafast,
  makeGrafastSchema,
  sideEffect,
  Step,
} from "../dist/index.js";

it("keeps hasSideEffects on Step.prototype so every step keeps fast properties", async () => {
  const steps: Step[] = [];

  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        normal: Int
        effect: Int
        flagged: Int
        guarded: Int
      }
    `,
    objects: {
      Query: {
        plans: {
          normal() {
            const $value = constant(1);
            steps.push($value);
            return $value;
          },
          effect() {
            const $value = sideEffect(null, () => 2);
            steps.push($value);
            return $value;
          },
          flagged() {
            const $value = constant(3);
            $value.hasSideEffects = true;
            // Setting the same value again must be a no-op.
            $value.hasSideEffects = true;
            expect($value.hasSideEffects).to.equal(true);
            steps.push($value);
            return $value;
          },
          guarded() {
            const $first = constant(1);
            // A later step that does not depend on `$first` makes it unsafe to
            // mark `$first` as having side effects.
            const $second = constant(2);
            expect(() => {
              $first.hasSideEffects = true;
            }).to.throw(
              /Attempted to mark .* as having side effects, but other non-dependent steps/,
            );
            expect($first.hasSideEffects).to.equal(false);
            return $second;
          },
        },
      },
    },
  });

  const result = await grafast({
    schema,
    source: /* GraphQL */ `
      {
        normal
        effect
        flagged
        guarded
      }
    `,
    requestContext: {},
  });
  if ("next" in result) {
    throw new Error("Iterator not expected");
  }
  expect(result.errors).to.be.undefined;
  expect(result.data).to.deep.equal({
    normal: 1,
    effect: 2,
    flagged: 3,
    guarded: 2,
  });

  const [normal, effect, flagged] = steps;
  expect(normal.hasSideEffects).to.equal(false);
  expect(effect.hasSideEffects).to.equal(true);
  expect(flagged.hasSideEffects).to.equal(true);

  // A per-instance `Object.defineProperty(step, "hasSideEffects", ...)` adds a
  // differently-shaped property to every step and drops the whole object into
  // V8 dictionary mode; the accessor is defined once on the prototype instead.
  for (const step of steps) {
    expect(Object.getOwnPropertyDescriptor(step, "hasSideEffects")).to.be
      .undefined;
    expect(Object.keys(step)).not.to.include("hasSideEffects");
  }
  const descriptor = Object.getOwnPropertyDescriptor(
    Step.prototype,
    "hasSideEffects",
  );
  expect(descriptor?.get).to.be.a("function");
  expect(descriptor?.set).to.be.a("function");
});
