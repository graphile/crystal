const { graphql } = require("graphql");
const { withPgClient } = require("../helpers");
const { createPostGraphileSchema } = require("../..");

let schema;

beforeAll(async () => {
  // Get a few GraphQL schema instance that we can query.
  schema = await withPgClient(async pgClient =>
    createPostGraphileSchema(pgClient, ["ranges"])
  );
});

test("numeric range", () =>
  withPgClient(async pgClient => {
    const {
      rows: [row],
    } = await pgClient.query(
      "insert into ranges.range_test (num) values (numrange($1, $2)) returning *",
      ["-1234567890123456789.123456789012", "1111111111111111111.111111111111"]
    );
    const result = await graphql(
      schema,
      "query ($id: Int!) {rangeTestById(id:$id) {num{start {value inclusive} end { value inclusive } }}}",
      null,
      {
        pgClient: pgClient,
      },
      { id: row.id }
    );
    expect(result.errors).toBeFalsy();
    expect(result.data.rangeTestById.num).toEqual({
      start: {
        value: "-1234567890123456789.123456789012",
        inclusive: true,
      },
      end: {
        value: "1111111111111111111.111111111111",
        inclusive: false,
      },
    });
  }));

test("bigint range", () =>
  withPgClient(async pgClient => {
    const {
      rows: [row],
    } = await pgClient.query(
      "insert into ranges.range_test (int8) values (int8range($1, $2)) returning *",
      ["-98765432109876543", "22222222222222222"]
    );
    const result = await graphql(
      schema,
      "query ($id: Int!) {rangeTestById(id:$id) {int8{start {value inclusive} end { value inclusive } }}}",
      null,
      {
        pgClient: pgClient,
      },
      { id: row.id }
    );
    expect(result.errors).toBeFalsy();
    expect(result.data.rangeTestById.int8).toEqual({
      start: {
        value: "-98765432109876543",
        inclusive: true,
      },
      end: {
        value: "22222222222222222",
        inclusive: false,
      },
    });
  }));

test("ts range", () =>
  withPgClient(async pgClient => {
    const {
      rows: [row],
    } = await pgClient.query(
      "insert into ranges.range_test (ts) values (tsrange($1::timestamp, null)) returning *",
      ["2019-01-10 21:45:56.356022"]
    );
    const result = await graphql(
      schema,
      "query ($id: Int!) {rangeTestById(id:$id) {ts{start {value inclusive} }}}",
      null,
      {
        pgClient: pgClient,
      },
      { id: row.id }
    );
    expect(result.errors).toBeFalsy();
    expect(result.data.rangeTestById.ts).toEqual({
      start: {
        value: "2019-01-10T21:45:56.356022",
        inclusive: true,
      },
    });
  }));

test("tstz range", () =>
  withPgClient(async pgClient => {
    const {
      rows: [row],
    } = await pgClient.query(
      "insert into ranges.range_test (tstz) values (tstzrange($1::timestamptz, null)) returning *",
      ["2019-01-10 21:45:56.356022+00"]
    );
    const result = await graphql(
      schema,
      "query ($id: Int!) {rangeTestById(id:$id) {tstz{start {value inclusive} }}}",
      null,
      {
        pgClient: pgClient,
      },
      { id: row.id }
    );
    expect(result.errors).toBeFalsy();
    expect(result.data.rangeTestById.tstz).toEqual({
      start: {
        value: "2019-01-10T17:45:56.356022-04:00",
        inclusive: true,
      },
    });
  }));
