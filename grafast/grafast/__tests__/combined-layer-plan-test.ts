/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { setTimeout as sleep } from "node:timers/promises";

import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import {
  constant,
  grafast,
  InterfacePlan,
  lambda,
  makeGrafastSchema,
} from "../dist/index.js";

type Notification =
  | { type: "ready"; id: string; ready: boolean }
  | { type: "logout"; id: string; username: string };

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
    switch (obj.type) {
      case "ready":
        return "NotificationReady";
      case "logout":
        return "NotificationLogout";
      default: {
        if ((obj as any) instanceof Error) {
          throw new Error("Saw error in planType");
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
  expect(result.errors).to.be.undefined;
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
  expect(result.errors).to.be.undefined;
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
  expect(result.errors).to.be.undefined;
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
  expect(result.errors).to.be.undefined;
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
              Promise.reject(new Error("List item failed")),
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
