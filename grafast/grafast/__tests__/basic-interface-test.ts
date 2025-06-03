/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { ExecutionResult, GraphQLObjectType } from "graphql";
import { GraphQLInterfaceType } from "graphql";
import { it } from "mocha";

import { constant, grafast, makeGrafastSchema } from "../dist/index.js";

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

      type UserNotificationLogout implements UserNotification {
        id: ID!
        username: String!
      }

      type Query {
        notifications: [UserNotification!]!
      }
    `,
    interfaces: {
      UserNotification: {
        resolveType(obj: any) {
          if (obj.type === "ready") return "UserNotificationReady";
          if (obj.type === "logout") return "UserNotificationLogout";
        },
      },
    },
    objects: {
      Query: {
        plans: {
          notifications() {
            return constant([
              { type: "ready", isReady: true, id: "1" },
              { type: "ready", isReady: false, id: "2" },
              { type: "logout", username: "benjie", id: "3" },
            ]);
          },
        },
      },
    },
  });

it(`sets the relevant properties on the schema`, async () => {
  const schema = makeSchema();
  const UserNotification = schema.getType(
    "UserNotification",
  ) as GraphQLInterfaceType;
  expect(UserNotification).to.be.instanceof(GraphQLInterfaceType);
  expect(UserNotification.resolveType, "resolveType").to.exist;
  //expect(UserNotification.extensions?.grafast?.planType, "planType")
  //  .to.exist;
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
      {
        id: "3",
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
          ... on UserNotificationLogout {
            username
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
      {
        __typename: "UserNotificationLogout",
        id: "3",
        username: "benjie",
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
    objects: {
      Query: {
        plans: {
          notifications() {
            return constant([]);
          },
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
