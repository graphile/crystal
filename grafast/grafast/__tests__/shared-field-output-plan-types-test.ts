/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";
import { parse } from "graphql";
import { it } from "mocha";

import {
  constant,
  execute,
  get,
  grafast,
  lambda,
  makeGrafastSchema,
  object,
} from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

const items = [
  { kind: "book", id: "b1", code: "ISBN-1", owner: { id: "p1", name: "Ann" } },
  { kind: "car", id: "c1", code: 42, owner: { id: "o1", title: "Acme" } },
];

// Each item type is planned in its own polymorphic partition, but both plan
// `owner` and `code` from the shared item, so each field ends up on one step
// that both partitions share. Only their GraphQL types differ.
const makeSchema = () =>
  makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      interface Owner {
        id: ID!
      }
      type Person implements Owner {
        id: ID!
        name: String!
      }
      type Company implements Owner {
        id: ID!
        title: String!
      }
      interface Item {
        id: ID!
        owner: Owner!
      }
      type Book implements Item {
        id: ID!
        owner: Person!
        code: String!
      }
      type Car implements Item {
        id: ID!
        owner: Company!
        code: Int!
      }
      type Query {
        items: [Item!]!
      }
    `,
    interfaces: {
      Item: {
        planType($specifier) {
          const $__typename = lambda(
            $specifier,
            (item: any) =>
              item.kind === "book" ? "Book" : item.kind === "car" ? "Car" : null,
            true,
          );
          return {
            $__typename,
            // A step of its own for each type, so each type is planned in its
            // own polymorphic partition, but every type still reads the shared
            // item.
            planForType: (t) => object({ item: $specifier, kind: constant(t.name) }),
          };
        },
      },
    },
    objects: {
      Query: {
        plans: {
          items: () => constant(items),
        },
      },
      Book: {
        plans: {
          id: ($book: any) => get($book.get("item"), "id"),
          owner: ($book: any) => get($book.get("item"), "owner"),
          code: ($book: any) => get($book.get("item"), "code"),
        },
      },
      Car: {
        plans: {
          id: ($car: any) => get($car.get("item"), "id"),
          owner: ($car: any) => get($car.get("item"), "owner"),
          code: ($car: any) => get($car.get("item"), "code"),
        },
      },
    },
  });

it("keeps the output plans of a shared field apart when its type differs per implementation", async () => {
  const schema = makeSchema();
  const result = (await grafast({
    schema,
    resolvedPreset,
    requestContext,
    source: /* GraphQL */ `
      {
        items {
          id
          owner {
            __typename
            id
            ... on Person {
              name
            }
            ... on Company {
              title
            }
          }
        }
      }
    `,
  })) as ExecutionResult;
  expect(result.errors).to.be.undefined;
  expect(JSON.stringify(result.data)).to.equal(
    JSON.stringify({
      items: [
        { id: "b1", owner: { __typename: "Person", id: "p1", name: "Ann" } },
        { id: "c1", owner: { __typename: "Company", id: "o1", title: "Acme" } },
      ],
    }),
  );
});

it("keeps fields with the same response key but conflicting types apart (validation bypassed)", async () => {
  const schema = makeSchema();
  // `code` is `String!` on Book and `Int!` on Car; GraphQL validation
  // (OverlappingFieldsCanBeMerged) currently rejects this, so we skip
  // validation to make sure planning would cope if that rule were relaxed.
  const result = (await execute({
    schema,
    resolvedPreset,
    contextValue: requestContext,
    document: parse(/* GraphQL */ `
      {
        items {
          id
          ... on Book {
            code
            owner {
              name
            }
          }
          ... on Car {
            code
            owner {
              title
            }
          }
        }
      }
    `),
  })) as ExecutionResult;
  expect(result.errors).to.be.undefined;
  expect(JSON.stringify(result.data)).to.equal(
    JSON.stringify({
      items: [
        { id: "b1", code: "ISBN-1", owner: { name: "Ann" } },
        { id: "c1", code: 42, owner: { title: "Acme" } },
      ],
    }),
  );
});
