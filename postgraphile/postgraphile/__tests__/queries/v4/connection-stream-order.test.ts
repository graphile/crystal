import { get } from "grafast";
import { planToMermaid } from "grafast/mermaid";
import { EXPORTABLE, extendSchema } from "graphile-utils";

import { runTestQuery } from "../../helpers.ts";

async function runConnectionQuery(document: string) {
  const { errors, payloads, queries, extensions } = await runTestQuery(
    document,
    {},
    { path: __filename },
  );
  expect(errors).toBeFalsy();
  return {
    payloads,
    extensions,
    pgCursorCount: queries.filter(({ text }) => /^declare /im.test(text))
      .length,
  };
}

test.each([
  { first: 3, initialCount: 0, ids: [1, 2, 3], hasNextPage: true },
  { first: 3, initialCount: 1, ids: [1, 2, 3], hasNextPage: true },
  { first: 3, initialCount: 5, ids: [1, 2, 3], hasNextPage: true },
  { first: 6, initialCount: 1, ids: [1, 2, 3, 4, 5, 6], hasNextPage: false },
  { first: 8, initialCount: 8, ids: [1, 2, 3, 4, 5, 6], hasNextPage: false },
])(
  "streams first: $first with initialCount: $initialCount and deferred page info",
  async ({ first, initialCount, ids, hasNextPage }) => {
    const { payloads, pgCursorCount } = await runConnectionQuery(`{
      allPeople(first: ${first}) {
        pageInfo { startCursor hasPreviousPage ... @defer { hasNextPage endCursor } }
        nodes @stream(initialCount: ${initialCount}) { id }
      }
    }`);
    expect(pgCursorCount).toBe(1);
    expect(payloads?.[0].data).toEqual({
      allPeople: {
        pageInfo: {
          startCursor: firstPageCursors.startCursor,
          hasPreviousPage: false,
        },
        nodes: ids.slice(0, initialCount).map((id) => ({ id })),
      },
    });
    expect(
      payloads?.slice(1).filter(({ data }) => data?.id != null),
    ).toMatchObject(
      ids.slice(initialCount).map((id, index) => ({
        path: ["allPeople", "nodes", initialCount + index],
        data: { id },
      })),
    );
    expect(payloads).toContainEqual({
      path: ["allPeople", "pageInfo"],
      data: {
        hasNextPage,
        endCursor: Buffer.from(
          JSON.stringify(["08e0d342de", ids.at(-1)]),
        ).toString("base64"),
      },
    });
  },
);

test("trims the extra row from a backwards page with deferred page info", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(
    `{
      allPeople(last: 3, orderBy: PRIMARY_KEY_ASC) {
        edges @stream(initialCount: 1) { node { id } }
        ... @defer { pageInfo { hasPreviousPage hasNextPage } }
      }
    }`,
  );
  expect(pgCursorCount).toBe(0);
  expect(payloads).toMatchObject([
    { data: { allPeople: { edges: [{ node: { id: 4 } }] } } },
    {
      path: ["allPeople"],
      data: { pageInfo: { hasPreviousPage: true, hasNextPage: false } },
    },
    { path: ["allPeople", "edges", 1], data: { node: { id: 5 } } },
    { path: ["allPeople", "edges", 2], data: { node: { id: 6 } } },
  ]);
});

test("reads items through the public get helper on a PostgreSQL select", async () => {
  const plugin = extendSchema((build) => {
    const people = build.input.pgRegistry.pgResources.person;
    return {
      typeDefs: "extend type Query { rawRows: [[String]] }",
      objects: {
        Query: {
          plans: {
            rawRows: EXPORTABLE(
              (get, people) => () => get(people.find(), "items"),
              [get, people],
            ),
          },
        },
      },
    };
  });
  const { data, errors } = await runTestQuery(
    "{ rawRows }",
    {},
    { path: __filename, plugins: [plugin] },
  );
  expect(errors).toBeFalsy();
  expect(data?.rawRows).toHaveLength(6);
});

const firstPageCursors = {
  startCursor: "WyIwOGUwZDM0MmRlIiwxXQ==",
  endCursor: "WyIwOGUwZDM0MmRlIiwzXQ==",
};

test("reads page cursors when they are the only selection", async () => {
  const { data, errors } = await runTestQuery(
    `{ allPeople(first: 3) { pageInfo { startCursor endCursor } } }`,
    {},
    { path: __filename },
  );
  expect(errors).toBeFalsy();
  expect(data).toEqual({ allPeople: { pageInfo: firstPageCursors } });
});

test("uses an ordinary query when page info and the stream share a defer", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(`{
    ... @defer {
      allPeople(first: 3) {
        nodes @stream(initialCount: 1) { id }
        pageInfo { hasNextPage endCursor }
      }
    }
  }`);
  expect(pgCursorCount).toBe(0);
  expect(payloads).toContainEqual({
    path: [],
    data: {
      allPeople: {
        nodes: [{ id: 1 }],
        pageInfo: { hasNextPage: true, endCursor: firstPageCursors.endCursor },
      },
    },
  });
});

test("reads startCursor before streamed nodes planned in a later defer", async () => {
  const { payloads, pgCursorCount, extensions } = await runConnectionQuery(`{
    allPeople(first: 3) {
      pageInfo { startCursor }
      ... @defer { nodes @stream(initialCount: 1) { id } }
    }
  }`);
  expect(pgCursorCount).toBe(1);
  const plan = extensions?.explain?.operations?.find(
    (op: { type: string }) => op.type === "plan",
  )?.plan;
  const diagram = planToMermaid(plan);
  expect(diagram).toMatch(/ConnectionItems\d+ ==> __Item\d+/);
  expect(diagram).not.toContain("__CloneStream");
  expect(payloads).toMatchObject([
    {
      data: {
        allPeople: { pageInfo: { startCursor: firstPageCursors.startCursor } },
      },
    },
    { path: ["allPeople"], data: { nodes: [{ id: 1 }] } },
    { path: ["allPeople", "nodes", 1], data: { id: 2 } },
    { path: ["allPeople", "nodes", 2], data: { id: 3 } },
  ]);
});

test("finishes page info alongside nodes in a deferred connection fragment", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(`{
    allPeople(first: 3) {
      pageInfo { startCursor }
      ... @defer {
        nodes @stream(initialCount: 1) { id }
        deferred: pageInfo { endCursor hasNextPage }
      }
    }
  }`);
  expect(pgCursorCount).toBe(0);
  expect(payloads).toContainEqual({
    path: ["allPeople"],
    data: {
      nodes: [{ id: 1 }],
      deferred: { endCursor: firstPageCursors.endCursor, hasNextPage: true },
    },
  });
});

test.each([
  { stream: true, defer: true, cursors: 1 },
  { stream: true, defer: false, cursors: 0 },
  { stream: false, defer: true, cursors: 0 },
  { stream: false, defer: false, cursors: 0 },
])(
  "offset page with stream=$stream and defer=$defer",
  async ({ stream, defer, cursors }) => {
    const { errors, data, payloads, queries } = await runTestQuery(
      `query ($stream: Boolean!, $defer: Boolean!) {
      allPeople(first: 2, offset: 1) {
        nodes @stream(if: $stream, initialCount: 1) { id }
        pageInfo { startCursor hasPreviousPage ... @defer(if: $defer) { endCursor hasNextPage } }
      }
    }`,
      { variableValues: { stream, defer }, expectedPlanConstraints: 1 },
      { path: __filename },
    );
    expect(errors).toBeFalsy();
    expect(queries.filter(({ text }) => /^declare /im.test(text))).toHaveLength(
      cursors,
    );
    const initial = (payloads?.[0].data ?? data)!.allPeople;
    expect(initial.nodes).toEqual(
      stream ? [{ id: 2 }] : [{ id: 2 }, { id: 3 }],
    );
    expect(initial.pageInfo.hasPreviousPage).toBe(true);
    const page = defer
      ? payloads?.find((p) => p.data?.endCursor !== undefined)?.data
      : initial.pageInfo;
    expect(page).toMatchObject({
      endCursor: firstPageCursors.endCursor,
      hasNextPage: true,
    });
  },
);

test("takes the last rows of a forward page before streaming nodes", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(`{
    allPeople(first: 4, last: 2) { nodes @stream(initialCount: 1) { id } }
  }`);
  expect(pgCursorCount).toBe(0);
  expect(payloads).toMatchObject([
    { data: { allPeople: { nodes: [{ id: 3 }] } } },
    { path: ["allPeople", "nodes", 1], data: { id: 4 } },
  ]);
});

test("settles both cursors for an empty stream", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(`{
    allPeople(first: 2, offset: 10) {
      pageInfo { startCursor ... @defer { endCursor hasNextPage } }
      nodes @stream(initialCount: 0) { id }
    }
  }`);
  expect(pgCursorCount).toBe(1);
  expect(payloads).toMatchObject([
    { data: { allPeople: { nodes: [], pageInfo: { startCursor: null } } } },
    {
      path: ["allPeople", "pageInfo"],
      data: { endCursor: null, hasNextPage: false },
    },
  ]);
});

test("streams inside a defer when endCursor belongs to a later defer", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(`{
    allPeople(first: 3) {
      pageInfo { startCursor }
      ... @defer {
        nodes @stream(initialCount: 1) { id }
        ... @defer { deferred: pageInfo { endCursor hasNextPage } }
      }
    }
  }`);
  expect(pgCursorCount).toBe(1);
  expect(payloads).toContainEqual({
    path: ["allPeople"],
    data: {
      deferred: { endCursor: firstPageCursors.endCursor, hasNextPage: true },
    },
  });
  expect(payloads).toContainEqual({
    path: ["allPeople", "nodes", 2],
    data: { id: 3 },
  });
});

test("streams when nodes and endCursor belong to sibling defers", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(`{
    allPeople(first: 3) {
      pageInfo { startCursor }
      ... @defer {
        nodes @stream(initialCount: 1) { id }
      }
      ... @defer { deferred: pageInfo { endCursor hasNextPage } }
    }
  }`);
  expect(pgCursorCount).toBe(1);
  expect(payloads).toContainEqual({
    path: ["allPeople"],
    data: {
      deferred: { endCursor: firstPageCursors.endCursor, hasNextPage: true },
    },
  });
  expect(payloads).toContainEqual({
    path: ["allPeople", "nodes", 2],
    data: { id: 3 },
  });
});

test("streams an unbounded page with eager hasNextPage", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(`{
    allPeople {
      nodes @stream(initialCount: 1) { id }
      pageInfo { hasNextPage }
    }
  }`);
  expect(pgCursorCount).toBe(1);
  expect(payloads?.[0].data).toEqual({
    allPeople: { nodes: [{ id: 1 }], pageInfo: { hasNextPage: false } },
  });
});

test.each([
  { liveList: true, nestedDefer: true },
  { liveList: false, nestedDefer: true },
  { liveList: false, nestedDefer: false },
])(
  "finishes a discarded page with liveList=$liveList and nestedDefer=$nestedDefer",
  async ({ liveList, nestedDefer }) => {
    const plugin = extendSchema({
      typeDefs: "extend type PeopleConnection { failure: Boolean! }",
      resolvers: {
        PeopleConnection: {
          failure() {
            throw new Error("Connection field failed");
          },
        },
      },
    });
    const edges = "edges @stream(initialCount: 1) { node { id } }";
    const { payloads, errors, queries } = await runTestQuery(
      `{
      allPeople(first: 2) {
        ${liveList ? "nodes @stream { id }" : ""}
        ... @defer {
          failure
          ${nestedDefer ? `... @defer { ${edges} }` : edges}
        }
        ... @defer { pageInfo { endCursor hasNextPage } }
      }
    }`,
      {},
      { path: __filename, plugins: [plugin], preservePayloadOrder: true },
    );
    expect(queries.filter(({ text }) => /^declare /im.test(text))).toHaveLength(
      1,
    );
    expect(errors).toMatchObject([{ path: ["allPeople", "failure"] }]);
    expect(payloads!.flatMap(({ data }) => data?.id ?? [])).toEqual(
      liveList ? [1, 2] : [],
    );
    expect(payloads).toContainEqual({
      path: ["allPeople"],
      data: {
        pageInfo: {
          endCursor: Buffer.from(JSON.stringify(["08e0d342de", 2])).toString(
            "base64",
          ),
          hasNextPage: true,
        },
      },
    });
  },
);

test("streams a backward page in requested order without page flags", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(`{
    allPeople(last: 3) {
      nodes @stream { id }
      pageInfo { startCursor ... @defer { endCursor } }
    }
  }`);
  expect(pgCursorCount).toBe(0);
  expect(payloads?.flatMap(({ data }) => data?.id ?? [])).toEqual([4, 5, 6]);
  const cursor = (id: number) =>
    Buffer.from(JSON.stringify(["08e0d342de", id])).toString("base64");
  expect(payloads?.[0].data?.allPeople.pageInfo.startCursor).toBe(cursor(4));
  expect(payloads).toContainEqual({
    path: ["allPeople", "pageInfo"],
    data: { endCursor: cursor(6) },
  });
});

test("gets each parent's start cursor before streaming a large batch", async () => {
  const { payloads, errors } = await runTestQuery(
    `{
    allPeople(first: 2) {
      nodes {
        postsByAuthorId {
          nodes @stream(initialCount: 0) { id }
          pageInfo { startCursor }
        }
      }
    }
  }`,
    {
      setupSql: `insert into a.post (id, headline, author_id)
               select id, 'batched start cursor', 1 from generate_series(10000, 10110) id`,
      cleanupSql: "delete from a.post where id between 10000 and 10110",
    },
    { path: __filename },
  );
  expect(errors).toBeFalsy();
  for (const { postsByAuthorId } of payloads![0].data!.allPeople.nodes) {
    expect(postsByAuthorId.nodes).toEqual([]);
    expect(postsByAuthorId.pageInfo.startCursor).toEqual(expect.any(String));
  }
  expect(payloads).toContainEqual(
    expect.objectContaining({ data: { id: 10110 } }),
  );
});
