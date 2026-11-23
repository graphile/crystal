import { runTestQuery } from "../../helpers.ts";

async function runConnectionQuery(document: string) {
  const { errors, payloads, queries } = await runTestQuery(
    document,
    {},
    { path: __filename },
  );
  expect(errors).toBeFalsy();
  return {
    payloads,
    pgCursorCount: queries.filter(({ text }) => /^declare /im.test(text))
      .length,
  };
}

test.each([
  { first: 3, initialCount: 1, ids: [1, 2, 3], hasNextPage: true },
  { first: 3, initialCount: 5, ids: [1, 2, 3], hasNextPage: true },
  { first: 6, initialCount: 1, ids: [1, 2, 3, 4, 5, 6], hasNextPage: false },
  { first: 8, initialCount: 8, ids: [1, 2, 3, 4, 5, 6], hasNextPage: false },
])(
  "streams first: $first with initialCount: $initialCount and deferred page info",
  async ({ first, initialCount, ids, hasNextPage }) => {
    const { payloads, pgCursorCount } = await runConnectionQuery(`{
      allPeople(first: ${first}) {
        pageInfo { startCursor }
        nodes @stream(initialCount: ${initialCount}) { id }
        ... @defer { deferred: pageInfo { hasNextPage endCursor } }
      }
    }`);
    expect(pgCursorCount).toBe(1);
    expect(payloads?.[0].data).toEqual({
      allPeople: {
        pageInfo: { startCursor: firstPageCursors.startCursor },
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
      path: ["allPeople"],
      data: {
        deferred: {
          hasNextPage,
          endCursor: Buffer.from(
            JSON.stringify(["08e0d342de", ids.at(-1)]),
          ).toString("base64"),
        },
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
  const { payloads, pgCursorCount } = await runConnectionQuery(`{
    allPeople(first: 3) {
      pageInfo { startCursor }
      ... @defer { nodes @stream(initialCount: 1) { id } }
    }
  }`);
  expect(pgCursorCount).toBe(1);
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
