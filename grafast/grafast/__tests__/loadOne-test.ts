import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import type {
  ExecutableStep,
  LoadedRecordStep,
  LoadOneCallback,
} from "../dist/index.js";
import { context, grafast, loadOne, makeGrafastSchema } from "../dist/index.js";

interface Thing {
  id: number;
  orgId: number;
  orgRegNo: number;
  name: string;
  reallyLongBio: string;
}
const THINGS: Thing[] = [
  {
    id: 1,
    orgId: 27,
    orgRegNo: 93,
    name: "Eyedee Won",
    reallyLongBio: "Really long bio. ".repeat(1000),
  },
  {
    id: 2,
    orgId: 42,
    orgRegNo: 120,
    name: "Idee Too",
    reallyLongBio: "Super long bio. ".repeat(1000),
  },
  {
    id: 2003,
    orgId: 27,
    orgRegNo: 987,
    name: "Eye D. Tree",
    reallyLongBio: "Somewhat long bio. ".repeat(1000),
  },
  {
    id: 2004,
    orgId: 42,
    orgRegNo: 987,
    name: "I.D. Phwoar",
    reallyLongBio: "Quite long bio. ".repeat(1000),
  },
];

interface Org {
  id: number;
}
const ORGS: Org[] = [
  {
    id: 27,
  },
  {
    id: 42,
  },
];

declare global {
  namespace Grafast {
    interface Context {
      orgId: number;
    }
  }
}

function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key as any)),
  ) as Pick<T, K>;
}

let CALLS: {
  specs: ReadonlyArray<
    | number
    | { identifier: number }
    | readonly [identifier: number]
    | { orgId: number; regNo: number }
    | readonly [orgId: number, regNo: number]
  >;
  result: object;
  attributes: readonly (keyof Thing)[] | null;
  params: object;
}[] = [];

const loadThingByIds: LoadOneCallback<number, Thing, Record<string, never>> = (
  specs,
  { attributes, params },
) => {
  const result = specs
    .map((id) => THINGS.find((t) => t.id === id))
    .map((t) => (t && attributes ? pick(t, attributes) : t));
  CALLS.push({ specs, result, attributes, params });
  return result;
};

const loadThingByIdentifierObjs: LoadOneCallback<
  { identifier: number },
  Thing,
  Record<string, never>
> = (specs, { attributes, params }) => {
  const result = specs
    .map((spec) => THINGS.find((t) => t.id === spec.identifier))
    .map((t) => (t && attributes ? pick(t, attributes) : t));
  CALLS.push({ specs, result, attributes, params });
  return result;
};

const loadThingByIdentifierLists: LoadOneCallback<
  readonly [identifier: number],
  Thing,
  Record<string, never>
> = (specs, { attributes, params }) => {
  const result = specs
    .map((spec) => THINGS.find((t) => t.id === spec[0]))
    .map((t) => (t && attributes ? pick(t, attributes) : t));
  CALLS.push({ specs, result, attributes, params });
  return result;
};

const loadThingByOrgIdRegNoObjs: LoadOneCallback<
  { orgId: number; regNo: number },
  Thing,
  Record<string, never>
> = (specs, { attributes, params }) => {
  const result = specs
    .map((spec) =>
      THINGS.find((t) => t.orgId === spec.orgId && t.orgRegNo === spec.regNo),
    )
    .map((t) => (t && attributes ? pick(t, attributes) : t));
  CALLS.push({ specs, result, attributes, params });
  return result;
};

const loadThingByOrgIdRegNoTuples: LoadOneCallback<
  readonly [orgId: number, regNo: number],
  Thing,
  Record<string, never>
> = (specs, { attributes, params }) => {
  const result = specs
    .map((spec) =>
      THINGS.find((t) => t.orgId === spec[0] && t.orgRegNo === spec[1]),
    )
    .map((t) => (t && attributes ? pick(t, attributes) : t));
  CALLS.push({ specs, result, attributes, params });
  return result;
};

const loadOrgByIds: LoadOneCallback<number, Org, Record<string, never>> = (
  specs,
  { attributes, params },
) => {
  const result = specs
    .map((id) => ORGS.find((t) => t.id === id))
    .map((t) => (t && attributes ? pick(t, attributes) : t));
  // CALLS.push({ specs, result, attributes, params });
  return result;
};

const makeSchema = (useStreamableStep = false) => {
  return makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Thing {
        id: Int!
        name: String!
        reallyLongBio: String!
        org: Org!
        orgRegNo: Int!
      }
      type Org {
        id: Int!
        thingByTuple(regNo: Int!): Thing
        thingByObj(regNo: Int!): Thing
      }
      type Query {
        thingById(id: Int!): Thing
        thingByIdObj(id: Int!): Thing
        thingByIdList(id: Int!): Thing
        thingByOrgIdRegNoTuple(regNo: Int!): Thing
        thingByOrgIdRegNoObj(regNo: Int!): Thing
      }
    `,
    plans: {
      Query: {
        thingById(_, { $id }) {
          return loadOne($id as ExecutableStep<number>, loadThingByIds);
        },
        thingByIdObj(_, { $id }) {
          return loadOne(
            { identifier: $id as ExecutableStep<number> },
            { identifier: "id" },
            loadThingByIdentifierObjs,
          );
        },
        thingByIdList(_, { $id }) {
          return loadOne(
            [$id as ExecutableStep<number>],
            ["id"],
            loadThingByIdentifierLists,
          );
        },
        thingByOrgIdRegNoTuple(_, { $regNo }) {
          const $orgId = context().get("orgId");
          return loadOne(
            [$orgId, $regNo],
            // Deliberately not using ioEquivalence here to test stable object/tuple creation
            //["orgId", "orgRegNo"],
            loadThingByOrgIdRegNoTuples,
          );
        },
        thingByOrgIdRegNoObj(_, { $regNo }) {
          const $orgId = context().get("orgId");
          return loadOne(
            { orgId: $orgId, regNo: $regNo },
            // Deliberately not using ioEquivalence here to test stable object/tuple creation
            //{ orgId: "orgId", regNo: "orgRegNo" },
            loadThingByOrgIdRegNoObjs,
          );
        },
      },
      Thing: {
        org($thing: LoadedRecordStep<Thing>) {
          return loadOne($thing.get("orgId"), "id", loadOrgByIds);
        },
      },
      Org: {
        thingByTuple($org: LoadedRecordStep<Org>, { $regNo }) {
          const $orgId = $org.get("id");
          return loadOne(
            [$orgId, $regNo],
            ["orgId", "orgRegNo"],
            loadThingByOrgIdRegNoTuples,
          );
        },
        thingByObj($org: LoadedRecordStep<Org>, { $regNo }) {
          const $orgId = $org.get("id");
          return loadOne(
            { orgId: $orgId, regNo: $regNo },
            { orgId: "orgId", regNo: "orgRegNo" },
            loadThingByOrgIdRegNoObjs,
          );
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

it("supports pure ioEquivalence (obj)", async () => {
  const source = /* GraphQL */ `
    {
      t1: thingByIdObj(id: 1) {
        id
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
      },
    },
  });
  expect(CALLS).to.have.length(1);
  expect(CALLS[0].attributes).to.have.length(0);
});

it("supports pure ioEquivalence (list)", async () => {
  const source = /* GraphQL */ `
    {
      t1: thingByIdList(id: 1) {
        id
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
      },
    },
  });
  expect(CALLS).to.have.length(1);
  expect(CALLS[0].attributes).to.have.length(0);
});

it("supports mixed ioEquivalence", async () => {
  const source = /* GraphQL */ `
    {
      t1: thingById(id: 1) {
        id
        name
      }
      t2: thingByIdObj(id: 1) {
        id
        name
      }
      t3: thingByIdList(id: 1) {
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
        id: 1,
        name: "Eyedee Won",
      },
      t3: {
        id: 1,
        name: "Eyedee Won",
      },
    },
  });
  expect(CALLS).to.have.length(3);
  expect(CALLS[0].specs).to.deep.equal([1]);
  expect(CALLS[0].attributes).to.deep.equal(["id", "name"]);
  expect(CALLS[1].specs).to.deep.equal([{ identifier: 1 }]);
  expect(CALLS[1].attributes).to.deep.equal(["name"]);
  expect(CALLS[2].specs).to.deep.equal([[1]]);
  expect(CALLS[2].attributes).to.deep.equal(["name"]);
});

it("supports no ioEquivalence", async () => {
  const source = /* GraphQL */ `
    {
      t1: thingById(id: 1) {
        name
      }
      t2: thingByIdObj(id: 1) {
        name
      }
      t3: thingByIdList(id: 1) {
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
        name: "Eyedee Won",
      },
      t2: {
        name: "Eyedee Won",
      },
      t3: {
        name: "Eyedee Won",
      },
    },
  });
  expect(CALLS).to.have.length(3);
  expect(CALLS[0].specs).to.deep.equal([1]);
  expect(CALLS[0].attributes).to.deep.equal(["name"]);
  expect(CALLS[1].specs).to.deep.equal([{ identifier: 1 }]);
  expect(CALLS[1].attributes).to.deep.equal(["name"]);
  expect(CALLS[2].specs).to.deep.equal([[1]]);
  expect(CALLS[2].attributes).to.deep.equal(["name"]);
});

it("uses stable identifiers to avoid the need for double-fetches (tuple)", async () => {
  const source = /* GraphQL */ `
    {
      t1: thingByOrgIdRegNoTuple(regNo: 987) {
        id
        name
        org {
          id
          t1: thingByTuple(regNo: 987) {
            id
            name
          }
        }
      }
    }
  `;
  const schema = makeSchema(false);

  CALLS = [];
  const result = (await grafast(
    {
      schema,
      source,
      contextValue: {
        orgId: 27,
      },
    },
    {},
    {},
  )) as ExecutionResult;
  expect(result).to.deep.equal({
    data: {
      t1: {
        id: 2003,
        name: "Eye D. Tree",
        org: {
          id: 27,
          t1: {
            id: 2003,
            name: "Eye D. Tree",
          },
        },
      },
    },
  });
  expect(CALLS).to.have.length(1);
  expect(CALLS[0].attributes).to.deep.equal(["id", "name", "orgId"]);
});

it("uses stable identifiers to avoid the need for double-fetches (obj)", async () => {
  const source = /* GraphQL */ `
    {
      t1: thingByOrgIdRegNoObj(regNo: 987) {
        id
        name
        org {
          id
          t1: thingByObj(regNo: 987) {
            id
            name
          }
        }
      }
    }
  `;
  const schema = makeSchema(false);

  CALLS = [];
  const result = (await grafast(
    {
      schema,
      source,
      contextValue: {
        orgId: 27,
      },
    },
    {},
    {},
  )) as ExecutionResult;
  expect(result).to.deep.equal({
    data: {
      t1: {
        id: 2003,
        name: "Eye D. Tree",
        org: {
          id: 27,
          t1: {
            id: 2003,
            name: "Eye D. Tree",
          },
        },
      },
    },
  });
  expect(CALLS).to.have.length(1);
  expect(CALLS[0].attributes).to.deep.equal(["id", "name", "orgId"]);
});
