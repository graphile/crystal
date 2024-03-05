/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import {
  constant,
  each,
  grafast,
  makeGrafastSchema,
  polymorphicBranch,
} from "../dist/index.js";

const makeSchema = () =>
  makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface UserNotification {
        id: ID!
      }

      type UserNotificationReady implements UserNotification {
        id: ID!
        isReady: Boolean!
      }

      type Query {
        notifications: [UserNotification!]!
      }
    `,
    plans: {
      Query: {
        notifications() {
          return each(
            constant([
              { type: "ready", isReady: true, id: "1" },
              { type: "ready", isReady: false, id: "2" },
            ]),
            ($obj) =>
              polymorphicBranch($obj, {
                UserNotificationReady: {
                  match(obj: any) {
                    return obj.type === "ready";
                  },
                  plan($obj) {
                    return $obj;
                  },
                },
              }),
          );
        },
      },
    },
  });

it(`works with plans`, async () => {
  const schema = makeSchema();
  const result = (await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        notifications {
          id
        }
      }
    `,
  })) as ExecutionResult;
  expect(result.errors).to.be.undefined;
  expect(result.data).to.deep.equal({
    notifications: [
      {
        id: "1",
      },
      {
        id: "2",
      },
    ],
  });
});

it(`works with plans and __typename`, async () => {
  const schema = makeSchema();
  const result = (await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        notifications {
          __typename
          id
          ... on UserNotificationReady {
            isReady
          }
        }
      }
    `,
  })) as ExecutionResult;
  expect(result.errors).to.be.undefined;
  expect(result.data).to.deep.equal({
    notifications: [
      {
        __typename: "UserNotificationReady",
        id: "1",
        isReady: true,
      },
      {
        __typename: "UserNotificationReady",
        id: "2",
        isReady: false,
      },
    ],
  });
});

const makeSchemaWithNoImplementations = () =>
  makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface UserNotification {
        id: ID!
      }

      type Query {
        notifications: [UserNotification!]!
      }
    `,
    plans: {
      Query: {
        notifications() {
          return constant([]);
        },
      },
    },
  });

it(`works with no implementations`, async () => {
  const schema = makeSchemaWithNoImplementations();
  const result = (await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        notifications {
          id
        }
      }
    `,
  })) as ExecutionResult;
  expect(result.errors).to.be.undefined;
  expect(result.data).to.deep.equal({
    notifications: [],
  });
});
