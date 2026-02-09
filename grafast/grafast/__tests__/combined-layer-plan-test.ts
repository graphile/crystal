/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import { grafast, lambda, makeGrafastSchema } from "../dist/index.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Notification =
  | { type: "ready"; id: string; ready: boolean }
  | { type: "logout"; id: string; username: string };

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
        first: [Notification!]!
        second: [Notification!]!
      }
    `,
    interfaces: {
      Notification: {
        resolveType(obj: Notification) {
          if (obj.type === "ready") return "NotificationReady";
          if (obj.type === "logout") return "NotificationLogout";
        },
      },
    },
    objects: {
      Query: {
        plans: {
          first() {
            return lambda(null, async () => {
              if (options.firstDelay > 0) {
                await sleep(options.firstDelay);
              }
              return options.first;
            });
          },
          second() {
            return lambda(null, async () => {
              if (options.secondDelay > 0) {
                await sleep(options.secondDelay);
              }
              return options.second;
            });
          },
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
