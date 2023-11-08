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

const loadThingByIds: LoadOneCallback<number, Thing, {}> = (
  ids,
  { attributes },
) => {
  return ids
    .map((id) => THINGS.find((t) => t.id === id))
    .map((t) => (t && attributes ? pick(t, attributes) : t));
};

const makeSchema = (useStreamableStep = false) => {
  return makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Thing {
        id: Int
        name: String
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

it("streams with non-streamable step", async () => {
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
    }
  `;
  const schema = makeSchema(false);

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
    },
  });
});
