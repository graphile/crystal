/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { setTimeout as sleep } from "node:timers/promises";

import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import {
  constant,
  flagError,
  grafast,
  InterfacePlan,
  lambda,
  makeGrafastSchema,
  Step,
} from "../dist/index.js";
import { resolveStreamDefer, streamToArray } from "./incrementalUtils.ts";

type Notification =
  | { type: "ready"; id: string; ready: boolean }
  | { type: "logout"; id: string; username: string };
type ReadyNotification = Extract<Notification, { type: "ready" }>;
type LogoutNotification = Extract<Notification, { type: "logout" }>;

const resolvedPreset = resolvePreset({});
const requestContext = {};

interface DelayOptions<T> {
  value: T;
  delay: number;
}
/** Runtime delay function */
function _delay<T>({ value, delay }: DelayOptions<T>) {
  return delay >= 0 ? sleep(delay).then(() => value) : value;
}
/** Plan-time delay function */
function delay<T>(value: T, delay: number) {
  return lambda(constant({ value, delay }), _delay);
}

function notificationInterface(options?: {
  seen?: unknown[];
}): InterfacePlan<Notification> {
  const determineType = (obj: Notification) => {
    options?.seen?.push(obj);
    switch (obj?.type) {
      case "ready":
        return "NotificationReady";
      case "logout":
        return "NotificationLogout";
      default: {
        if ((obj as any) instanceof Error) {
          throw new Error("Saw error in planType");
        }
        if (obj == null) {
          throw new Error(`Saw ${obj} in planType`);
        }
        return null;
      }
    }
  };
  return {
    planType($specifier) {
      const $__typename = lambda($specifier, determineType, true);
      return { $__typename, planForType: () => $specifier };
    },
  };
}

function notificationPartitionInterface(): InterfacePlan<Notification> {
  return {
    planType($specifier) {
      const $__typename = lambda(
        $specifier,
        (obj: Notification) =>
          obj.type === "ready"
            ? "NotificationReady"
            : obj.type === "logout"
              ? "NotificationLogout"
              : null,
        true,
      );
      return {
        $__typename,
        planForType(t) {
          if (t.name === "NotificationReady") {
            return lambda(
              $specifier,
              (obj: Notification) => obj as ReadyNotification,
              true,
            );
          }
          if (t.name === "NotificationLogout") {
            return lambda(
              $specifier,
              (obj: Notification) => obj as LogoutNotification,
              true,
            );
          }
          return null;
        },
      };
    },
  };
}

type SpecifiedNotification = {
  kind: "ready" | "logout";
  id: string;
  ready?: boolean;
  username?: string;
};

function notificationToSpecifierInterface(): InterfacePlan<
  SpecifiedNotification,
  Step<Notification>
> {
  return {
    toSpecifier($step) {
      return lambda(
        $step,
        (obj) => ({
          kind: obj.type,
          id: obj.id,
          ready: obj.type === "ready" ? obj.ready : undefined,
          username: obj.type === "logout" ? obj.username : undefined,
        }),
        true,
      );
    },
    planType($specifier) {
      const $__typename = lambda(
        $specifier,
        (obj: SpecifiedNotification) =>
          obj.kind === "ready"
            ? "NotificationReady"
            : obj.kind === "logout"
              ? "NotificationLogout"
              : null,
        true,
      );
      return { $__typename };
    },
  };
}

const makeSchema = (options: {
  firstDelay: number;
  secondDelay: number;
  first: Notification[];
  second: Notification[];
}) =>
  makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        first: [Notification]
        second: [Notification]
      }
    `,
    interfaces: {
      Notification: notificationInterface(),
    },
    objects: {
      Query: {
        plans: {
          first: () => delay(options.first, options.firstDelay),
          second: () => delay(options.second, options.secondDelay),
        },
      },
    },
  });

const source = /* GraphQL */ `
  query {
    first {
      __typename
      id
      ... on NotificationReady {
        ready
      }
      ... on NotificationLogout {
        username
      }
    }
    second {
      __typename
      id
      ... on NotificationReady {
        ready
      }
      ... on NotificationLogout {
        username
      }
    }
  }
`;

it("combines layer plans when the slower parent finishes last", async () => {
  const schema = makeSchema({
    firstDelay: 10,
    secondDelay: 0,
    first: [
      { type: "ready", id: "1", ready: true },
      { type: "logout", id: "2", username: "benjie" },
    ],
    second: [{ type: "ready", id: "3", ready: false }],
  });
  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;
  expect(result.data).to.deep.equal({
    first: [
      { __typename: "NotificationReady", id: "1", ready: true },
      { __typename: "NotificationLogout", id: "2", username: "benjie" },
    ],
    second: [{ __typename: "NotificationReady", id: "3", ready: false }],
  });
});

it("combines layer plans when an empty list finishes first", async () => {
  const schema = makeSchema({
    firstDelay: 10,
    secondDelay: 0,
    first: [{ type: "logout", id: "1", username: "later" }],
    second: [],
  });
  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;
  expect(result.data).to.deep.equal({
    first: [{ __typename: "NotificationLogout", id: "1", username: "later" }],
    second: [],
  });
});

it("combines layer plans when an empty list finishes last", async () => {
  const schema = makeSchema({
    firstDelay: 0,
    secondDelay: 10,
    first: [{ type: "ready", id: "1", ready: true }],
    second: [],
  });
  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;
  expect(result.data).to.deep.equal({
    first: [{ __typename: "NotificationReady", id: "1", ready: true }],
    second: [],
  });
});

it("combines layer plans when both lists are empty", async () => {
  const schema = makeSchema({
    firstDelay: 0,
    secondDelay: 0,
    first: [],
    second: [],
  });
  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;
  expect(result.data).to.deep.equal({
    first: [],
    second: [],
  });
});

it("combines layer plans when one parent errors (late)", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        first: [Notification]
        second: [Notification]
      }
    `,
    interfaces: {
      Notification: notificationInterface(),
    },
    objects: {
      Query: {
        plans: {
          first() {
            return lambda(null, async () => {
              await sleep(5);
              throw new Error("First failed");
            });
          },
          second() {
            return lambda(null, async () => [
              { type: "ready", id: "1", ready: true },
              { type: "logout", id: "2", username: "benjie" },
            ]);
          },
        },
      },
    },
  });
  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;
  expect(result.data).to.deep.equal({
    first: null,
    second: [
      { __typename: "NotificationReady", id: "1", ready: true },
      { __typename: "NotificationLogout", id: "2", username: "benjie" },
    ],
  });
  expect(result.errors?.map((error) => error.message)).to.deep.equal([
    "First failed",
  ]);
});

it("combines layer plans when one parent errors (early)", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        first: [Notification]
        second: [Notification]
      }
    `,
    interfaces: {
      Notification: notificationInterface(),
    },
    objects: {
      Query: {
        plans: {
          first() {
            return lambda(null, async () => {
              throw new Error("First failed");
            });
          },
          second() {
            return lambda(null, async () => {
              await sleep(5);
              return [
                { type: "ready", id: "1", ready: true },
                { type: "logout", id: "2", username: "benjie" },
              ];
            });
          },
        },
      },
    },
  });
  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;
  expect(result.data).to.deep.equal({
    first: null,
    second: [
      { __typename: "NotificationReady", id: "1", ready: true },
      { __typename: "NotificationLogout", id: "2", username: "benjie" },
    ],
  });
  expect(result.errors?.map((error) => error.message)).to.deep.equal([
    "First failed",
  ]);
});

it("combines layer plans when both parents error", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        first: [Notification]
        second: [Notification]
      }
    `,
    interfaces: {
      Notification: notificationInterface(),
    },
    objects: {
      Query: {
        plans: {
          first() {
            return lambda(null, async () => {
              return [
                Promise.reject(new Error("First failed")),
                { type: "ready", id: "3", ready: false },
                Promise.reject(new Error("First failed again")),
              ];
            });
          },
          second() {
            return lambda(null, async () => {
              await sleep(5);
              return [
                { type: "ready", id: "1", ready: true },
                Promise.reject(new Error("Second failed")),
                { type: "logout", id: "2", username: "benjie" },
              ];
            });
          },
        },
      },
    },
  });
  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;
  expect(result.data).to.deep.equal({
    first: [
      null,
      { __typename: "NotificationReady", id: "3", ready: false },
      null,
    ],
    second: [
      { __typename: "NotificationReady", id: "1", ready: true },
      null,
      { __typename: "NotificationLogout", id: "2", username: "benjie" },
    ],
  });
  expect(result.errors?.map((error) => error.message)).to.deep.equal([
    "First failed",
    "First failed again",
    "Second failed",
  ]);
});

it("does not attempt polymorphic planning for list item errors", async () => {
  const seen: unknown[] = [];
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        notifications: [Notification]
      }
    `,
    interfaces: {
      Notification: notificationInterface({ seen }),
    },
    objects: {
      Query: {
        plans: {
          notifications() {
            return lambda(null, async () => [
              { type: "ready", id: "1", ready: true },
              flagError(new Error("List item failed")),
              { type: "logout", id: "2", username: "benjie" },
            ]);
          },
        },
      },
    },
  });

  const result = (await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        notifications {
          __typename
          id
        }
      }
    `,
  })) as ExecutionResult;

  expect(result.data).to.deep.equal({
    notifications: [
      { __typename: "NotificationReady", id: "1" },
      null,
      { __typename: "NotificationLogout", id: "2" },
    ],
  });
  expect(result.errors?.map((error) => error.message)).to.deep.equal([
    "List item failed",
  ]);
  expect(seen.some((value) => value instanceof Error)).to.equal(false);
  expect(seen).to.have.length(2);
  expect(seen).to.deep.include({ type: "ready", id: "1", ready: true });
  expect(seen).to.deep.include({ type: "logout", id: "2", username: "benjie" });
});

it("fans out via polymorphic partition when parents finish out of order", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        first: [Notification]
        second: [Notification]
      }
    `,
    interfaces: {
      Notification: notificationPartitionInterface(),
    },
    objects: {
      Query: {
        plans: {
          first() {
            return lambda(null, async () => {
              await sleep(10);
              return [
                { type: "ready", id: "1", ready: true },
                { type: "logout", id: "2", username: "benjie" },
              ];
            });
          },
          second() {
            return lambda(null, async () => [
              { type: "ready", id: "3", ready: false },
            ]);
          },
        },
      },
    },
  });

  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;

  expect(result.data).to.deep.equal({
    first: [
      { __typename: "NotificationReady", id: "1", ready: true },
      { __typename: "NotificationLogout", id: "2", username: "benjie" },
    ],
    second: [{ __typename: "NotificationReady", id: "3", ready: false }],
  });
});

it("respects nullable boundaries before polymorphism", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        first: [Notification!]
        second: [Notification!]
      }
    `,
    interfaces: {
      Notification: notificationInterface(),
    },
    objects: {
      Query: {
        plans: {
          first() {
            return lambda(null, async () => [
              { type: "ready", id: "1", ready: true },
              null,
            ]);
          },
          second() {
            return lambda(null, async () => [
              { type: "logout", id: "2", username: "benjie" },
            ]);
          },
        },
      },
    },
  });

  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;

  expect(result.data).to.deep.equal({
    first: null,
    second: [{ __typename: "NotificationLogout", id: "2", username: "benjie" }],
  });
  expect(result.errors?.map((error) => error.message)).to.deep.equal([
    "Cannot return null for non-nullable field Query.first.",
  ]);
});

it("handles doubly nested polymorphic positions", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Outer {
        id: ID!
        inner: Inner
      }

      type Cat implements Outer {
        id: ID!
        inner: Inner
      }

      type Dog implements Outer {
        id: ID!
        inner: Inner
      }

      interface Inner {
        kind: String!
      }

      type Toy implements Inner {
        kind: String!
        color: String!
      }

      type Treat implements Inner {
        kind: String!
        flavor: String!
      }

      type Query {
        first: [Outer]
        second: [Outer]
      }
    `,
    interfaces: {
      Outer: {
        planType($specifier) {
          const $__typename = lambda(
            $specifier,
            (obj: { type: string }) =>
              obj.type === "cat" ? "Cat" : obj.type === "dog" ? "Dog" : null,
            true,
          );
          return { $__typename, planForType: () => $specifier };
        },
      },
      Inner: {
        planType($specifier) {
          const $__typename = lambda(
            $specifier,
            (obj: { type: string }) =>
              obj.type === "toy"
                ? "Toy"
                : obj.type === "treat"
                  ? "Treat"
                  : null,
            true,
          );
          return { $__typename, planForType: () => $specifier };
        },
      },
    },
    objects: {
      Cat: {
        plans: {
          inner($cat) {
            return lambda($cat, (cat: any) => cat.inner);
          },
        },
      },
      Dog: {
        plans: {
          inner($dog) {
            return lambda($dog, (dog: any) => dog.inner);
          },
        },
      },
      Query: {
        plans: {
          first() {
            return lambda(null, async () => {
              await sleep(10);
              return [
                {
                  type: "cat",
                  id: "1",
                  inner: { type: "toy", kind: "toy", color: "red" },
                },
                {
                  type: "dog",
                  id: "2",
                  inner: null,
                },
                Promise.reject(new Error("Outer failed")),
                {
                  type: "dog",
                  id: "5",
                  inner: { type: "toy", kind: "toy", color: "green" },
                },
              ];
            });
          },
          second() {
            return lambda(null, async () => {
              await sleep(0);
              return [
                {
                  type: "dog",
                  id: "3",
                  inner: { type: "toy", kind: "toy", color: "blue" },
                },
                {
                  type: "cat",
                  id: "4",
                  inner: null,
                },
              ];
            });
          },
        },
      },
    },
  });

  const result = (await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        first {
          __typename
          id
          inner {
            __typename
            kind
            ... on Toy {
              color
            }
            ... on Treat {
              flavor
            }
          }
        }
        second {
          __typename
          id
          inner {
            __typename
            kind
            ... on Toy {
              color
            }
            ... on Treat {
              flavor
            }
          }
        }
      }
    `,
  })) as ExecutionResult;

  expect(result.data).to.deep.equal({
    first: [
      {
        __typename: "Cat",
        id: "1",
        inner: { __typename: "Toy", kind: "toy", color: "red" },
      },
      {
        __typename: "Dog",
        id: "2",
        inner: null,
      },
      null,
      {
        __typename: "Dog",
        id: "5",
        inner: { __typename: "Toy", kind: "toy", color: "green" },
      },
    ],
    second: [
      {
        __typename: "Dog",
        id: "3",
        inner: { __typename: "Toy", kind: "toy", color: "blue" },
      },
      {
        __typename: "Cat",
        id: "4",
        inner: null,
      },
    ],
  });
  expect(result.errors?.map((error) => error.message)).to.deep.equal([
    "Outer failed",
  ]);
});

it("cleans up retained buckets when nested polymorphic recombination has errors", async () => {
  let rootBucket: any = null;
  const bucketCapturePlugin: GraphileConfig.Plugin = {
    name: "BucketCapturePlugin",
    grafast: {
      middleware: {
        executeStep(next, event) {
          const bucket = (event.executeDetails.extra as any)._bucket;
          if (bucket.layerPlan.reason.type === "root") {
            rootBucket = bucket;
          }
          return next();
        },
      },
    },
  };
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Owner {
        id: ID!
      }

      type Human implements Owner {
        id: ID!
      }

      type Business implements Owner {
        id: ID!
      }

      interface Pet {
        id: ID!
      }

      type Cat implements Pet {
        id: ID!
        owner: Owner
      }

      type Dog implements Pet {
        id: ID!
        owner: Owner
      }

      type Query {
        pets: [Pet]!
      }
    `,
    interfaces: {
      Pet: {
        planType($specifier) {
          const $__typename = lambda(
            $specifier,
            (obj: { kind: string }) =>
              obj.kind === "cat" ? "Cat" : obj.kind === "dog" ? "Dog" : null,
            true,
          );
          return { $__typename, planForType: () => $specifier };
        },
      },
      Owner: {
        planType($specifier) {
          const $__typename = lambda(
            $specifier,
            (obj: { kind: string }) =>
              obj.kind === "human"
                ? "Human"
                : obj.kind === "business"
                  ? "Business"
                  : null,
            true,
          );
          return { $__typename, planForType: () => $specifier };
        },
      },
    },
    objects: {
      Query: {
        plans: {
          pets() {
            return lambda(null, async () => [
              { kind: "cat", id: "c1", owner: { kind: "human", id: "h1" } },
              {
                kind: "dog",
                id: "d1",
                owner: { kind: "business", id: "b1" },
              },
            ]);
          },
        },
      },
      Cat: {
        plans: {
          owner($cat) {
            return lambda($cat, async (_cat: any) => {
              await sleep(1);
              throw new Error("Cat owner failed");
            });
          },
        },
      },
      Dog: {
        plans: {
          owner($dog) {
            return lambda($dog, async (dog: any) => {
              await sleep(5);
              return dog.owner;
            });
          },
        },
      },
    },
  });

  const result = (await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        pets {
          ... on Cat {
            owner {
              ... on Human {
                id
              }
              ... on Business {
                id
              }
            }
          }
          ... on Dog {
            owner {
              ... on Human {
                id
              }
              ... on Business {
                id
              }
            }
          }
        }
      }
    `,
    resolvedPreset: resolvePreset({ plugins: [bucketCapturePlugin] }),
  })) as ExecutionResult;

  expect(result.data).to.deep.equal({
    pets: [{ owner: null }, { owner: { id: "b1" } }],
  });
  expect(rootBucket).to.exist;

  const buckets: any[] = [];
  const seen = new Set<any>();
  const queue = [rootBucket];
  while (queue.length > 0) {
    const bucket = queue.pop();
    if (!bucket || seen.has(bucket)) continue;
    seen.add(bucket);
    buckets.push(bucket);
    for (const child of Object.values(bucket.children)) {
      queue.push((child as any).bucket);
    }
  }
  expect(
    buckets.some((bucket) => bucket.layerPlan.reason.type === "combined"),
  ).to.equal(true);
  expect(rootBucket.sharedState._retainedBuckets.size).to.equal(0);
  for (const bucket of buckets) {
    expect(bucket.retainCount).to.equal(0);
  }
});

it("handles list-of-lists polymorphic positions", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        groups: [[Notification]]
      }
    `,
    interfaces: {
      Notification: notificationInterface(),
    },
    objects: {
      Query: {
        plans: {
          groups() {
            return lambda(null, async () => [
              [
                { type: "ready", id: "1", ready: true },
                flagError(new Error("Inner list failed")),
              ],
              null,
              [{ type: "logout", id: "2", username: "benjie" }, null],
            ]);
          },
        },
      },
    },
  });

  const result = (await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        groups {
          __typename
          id
          ... on NotificationReady {
            ready
          }
          ... on NotificationLogout {
            username
          }
        }
      }
    `,
  })) as ExecutionResult;

  expect(result.data).to.deep.equal({
    groups: [
      [{ __typename: "NotificationReady", id: "1", ready: true }, null],
      null,
      [{ __typename: "NotificationLogout", id: "2", username: "benjie" }, null],
    ],
  });
  expect(result.errors?.map((error) => error.message)).to.deep.equal([
    "Inner list failed",
  ]);
});

it("uses toSpecifier when fanning in polymorphic positions", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        first: [Notification]
        second: [Notification]
      }
    `,
    interfaces: {
      Notification: notificationToSpecifierInterface(),
    },
    objects: {
      Query: {
        plans: {
          first() {
            return delay(
              [
                { type: "ready", id: "1", ready: true },
                { type: "logout", id: "2", username: "benjie" },
              ],
              10,
            );
          },
          second() {
            return delay([{ type: "ready", id: "3", ready: false }], 0);
          },
        },
      },
    },
  });

  const result = (await grafast({
    schema,
    source,
  })) as ExecutionResult;

  expect(result.errors).to.be.undefined;
  expect(result.data).to.deep.equal({
    first: [
      { __typename: "NotificationReady", id: "1", ready: true },
      { __typename: "NotificationLogout", id: "2", username: "benjie" },
    ],
    second: [{ __typename: "NotificationReady", id: "3", ready: false }],
  });
});

it("streams combined polymorphic lists", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Notification {
        id: ID!
      }

      type NotificationReady implements Notification {
        id: ID!
        ready: Boolean!
      }

      type NotificationLogout implements Notification {
        id: ID!
        username: String!
      }

      type Query {
        first: [Notification]
        second: [Notification]
      }
    `,
    interfaces: {
      Notification: notificationInterface(),
    },
    objects: {
      Query: {
        plans: {
          first() {
            return delay(
              [
                { type: "ready", id: "1", ready: true },
                { type: "logout", id: "2", username: "benjie" },
              ],
              10,
            );
          },
          second() {
            return delay([{ type: "ready", id: "3", ready: false }], 0);
          },
        },
      },
    },
    enableDeferStream: true,
  });

  const stream = await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        first @stream(initialCount: 1) {
          __typename
          id
          ... on NotificationReady {
            ready
          }
          ... on NotificationLogout {
            username
          }
        }
        second @stream(initialCount: 1) {
          __typename
          id
          ... on NotificationReady {
            ready
          }
          ... on NotificationLogout {
            username
          }
        }
      }
    `,
    resolvedPreset,
    requestContext,
  });

  const payloads = await streamToArray(stream);
  const result = Array.isArray(payloads)
    ? resolveStreamDefer(payloads)
    : payloads;

  expect(result.errors).to.be.undefined;
  expect(result.data).to.deep.equal({
    first: [
      { __typename: "NotificationReady", id: "1", ready: true },
      { __typename: "NotificationLogout", id: "2", username: "benjie" },
    ],
    second: [{ __typename: "NotificationReady", id: "3", ready: false }],
  });
});
