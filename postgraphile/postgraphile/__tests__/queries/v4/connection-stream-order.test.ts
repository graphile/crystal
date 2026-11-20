import { runTestQuery } from "../../helpers.ts";

// Each test builds its own schema, and with `EXPORT_SCHEMA` set it also
// exports and re-imports it, which takes longer than Jest's default 5s. The
// `.test.graphql` queries get the same allowance via their `beforeAll`.
jest.setTimeout(60000);

async function runConnectionQuery(
  document: string,
  config: Parameters<typeof runTestQuery>[1] = {},
) {
  const { errors, extensions, payloads, queries } = await runTestQuery(
    document,
    config,
    { path: __filename },
  );
  expect(errors).toBeFalsy();
  const { plan } = extensions.explain.operations.find(
    (op: { type: string }) => op.type === "plan",
  );
  const buckets: { steps: { stepClass: string }[] }[] = plan.buckets;
  const connections = buckets
    .flatMap((bucket) => bucket.steps)
    .filter((step) => step.stepClass === "ConnectionStep");
  expect(connections).toHaveLength(1);
  return {
    payloads,
    pgCursorCount: queries.filter(({ text }) => /^declare /im.test(text))
      .length,
  };
}

const plain = `plain: allPeople(first: 3, condition: $condition) { nodes { id } }`;
const streamed = `streamed: allPeople(first: 3, condition: $condition) {
  nodes @stream(initialCount: 1) { id }
}`;

test.each([
  ["plain first", `${plain} ${streamed}`],
  ["streamed first", `${streamed} ${plain}`],
])("shares a buffered page between aliases (%s)", async (_, fields) => {
  const { payloads, pgCursorCount } = await runConnectionQuery(
    `query ($condition: PersonCondition) { ${fields} }`,
    { variableValues: { condition: { about: null } } },
  );
  expect(pgCursorCount).toBe(0);
  expect(payloads).toMatchObject([
    {
      data: {
        plain: { nodes: [{ id: 1 }, { id: 2 }, { id: 4 }] },
        streamed: { nodes: [{ id: 1 }] },
      },
    },
    { path: ["streamed", "nodes", 1], data: { id: 2 } },
    { path: ["streamed", "nodes", 2], data: { id: 4 } },
  ]);
});

// Whichever wrapper is planned first, the shared connection is planned the
// same way: `hasNextPage` needs the extra row, so the page is buffered;
// `endCursor` reads the last item from a clone of the stream.
test.each([
  { field: "hasNextPage", value: true, cursors: 0 },
  { field: "endCursor", value: "WyJjM2QzZjIwYmMyIiwzLDNd", cursors: 1 },
])(
  "shares the page with a wrapper requesting $field",
  async ({ field, value, cursors }) => {
    const { payloads, pgCursorCount } = await runConnectionQuery(
      `{
        sharedPeople {
          plain { pageInfo { ${field} } }
          streamed @stream(initialCount: 1) { id }
        }
      }`,
      { extends: "./StreamConnectionDeduplication.ts:preset" },
    );
    expect(pgCursorCount).toBe(cursors);
    expect(payloads).toMatchObject([
      {
        data: {
          sharedPeople: {
            plain: { pageInfo: { [field]: value } },
            streamed: [{ id: 1 }],
          },
        },
      },
      { path: ["sharedPeople", "streamed", 1], data: { id: 2 } },
      { path: ["sharedPeople", "streamed", 2], data: { id: 3 } },
    ]);
  },
);

test("shares a PostgreSQL cursor between aliases with different initial counts", async () => {
  const { payloads, pgCursorCount } = await runConnectionQuery(
    `{
      a: allPeople(first: 3) { nodes @stream(initialCount: 1) { id } }
      b: allPeople(first: 3) { nodes @stream(initialCount: 2) { id } }
    }`,
  );
  expect(pgCursorCount).toBe(1);
  expect(payloads).toMatchObject([
    {
      data: { a: { nodes: [{ id: 1 }] }, b: { nodes: [{ id: 1 }, { id: 2 }] } },
    },
    { path: ["a", "nodes", 1], data: { id: 2 } },
    { path: ["a", "nodes", 2], data: { id: 3 } },
    { path: ["b", "nodes", 2], data: { id: 3 } },
  ]);
});

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

test("reads page cursors when streamed nodes are planned later", async () => {
  // The nested defers put nodes in a later planning pass than both cursors.
  const { payloads, pgCursorCount } = await runConnectionQuery(
    `{
      cursors: allPeople(first: 3) { pageInfo { startCursor endCursor } }
      people: allPeople(first: 3) {
        ... @defer {
          ... @defer {
            ... @defer { nodes @stream(initialCount: 1) { id } }
          }
        }
      }
    }`,
  );
  expect(pgCursorCount).toBe(1);
  expect(payloads?.[0].data).toEqual({
    cursors: { pageInfo: firstPageCursors },
    people: {},
  });
  expect(
    payloads
      ?.slice(1)
      .filter(({ data }) => data?.nodes != null || data?.id != null),
  ).toMatchObject([
    { path: ["people"], data: { nodes: [{ id: 1 }] } },
    { path: ["people", "nodes", 1], data: { id: 2 } },
    { path: ["people", "nodes", 2], data: { id: 3 } },
  ]);
});
