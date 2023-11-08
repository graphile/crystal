import { expect } from "chai";
import { ExecutionResult } from "graphql";
import { it } from "mocha";

import type { LoadOneCallback } from "../dist/index.js";
import { grafast, loadOne, makeGrafastSchema } from "../dist/index.js";

interface Thing {
  id: number;
  name: string;
  reallyLongBio: string;
}
const THINGS: Thing[] = [
  {
    id: 1,
    name: "Eyedee Won",
    reallyLongBio: "Really long bio. ".repeat(1000),
  },
  {
    id: 2,
    name: "Idee Too",
    reallyLongBio: "Super long bio. ".repeat(1000),
  },
];

function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key as any)),
  ) as Pick<T, K>;
}

let CALLS: {
  ids: readonly number[];
  result: object;
  attributes: readonly (keyof Thing)[] | null;
  params: object;
}[] = [];

const loadThingByIds: LoadOneCallback<number, Thing, {}> = (
  ids,
  { attributes, params },
) => {
  const result = ids
    .map((id) => THINGS.find((t) => t.id === id))
    .map((t) => (t && attributes ? pick(t, attributes) : t));
  CALLS.push({ ids, result, attributes, params });
  return result;
};

const makeSchema = (useStreamableStep = false) => {
  return makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Thing {
        id: Int!
        name: String!
        reallyLongBio: String!
      }
      type Query {
        thingById(id: Int!): Thing
      }
    `,
    plans: {
      Query: {
        thingById(_, { $id }) {
          return loadOne($id, loadThingByIds);
        },
      },
    },
    enableDeferStream: true,
  });
};

it("batches across parallel trees with identical selection sets", async () => {
  const source = /* GraphQL */ `
    {
      t1: thingById(id: 1) {
        id
        name
      }
      t2: thingById(id: 2) {
        id
        name
      }
      t3: thingById(id: 3) {
        id
        name
      }
    }
  `;
  const schema = makeSchema(false);

  CALLS = [];
  const result = (await grafast(
    {
      schema,
      source,
    },
    {},
    {},
  )) as ExecutionResult;
  expect(result).to.deep.equal({
    data: {
      t1: {
        id: 1,
        name: "Eyedee Won",
      },
      t2: {
        id: 2,
        name: "Idee Too",
      },
      t3: null,
    },
  });
  expect(CALLS).to.have.length(1);
  expect(CALLS[0].attributes).to.deep.equal(["id", "name"]);
});
it("batches across parallel trees with non-identical selection sets", async () => {
  const source = /* GraphQL */ `
    {
      t1: thingById(id: 1) {
        id
        name
      }
      t2: thingById(id: 2) {
        id
      }
      t3: thingById(id: 3) {
        id
        reallyLongBio
      }
    }
  `;
  const schema = makeSchema(false);

  CALLS = [];
  const result = (await grafast(
    {
      schema,
      source,
    },
    {},
    {},
  )) as ExecutionResult;
  expect(result).to.deep.equal({
    data: {
      t1: {
        id: 1,
        name: "Eyedee Won",
      },
      t2: {
        id: 2,
      },
      t3: null,
    },
  });
  expect(CALLS).to.have.length(1);
  expect(CALLS[0].attributes).to.deep.equal(["id", "name", "reallyLongBio"]);
});
