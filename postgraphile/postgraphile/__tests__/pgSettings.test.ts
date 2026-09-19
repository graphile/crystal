import { runTestQuery } from "./helpers.ts";

test("applies pgSettings to PostgreSQL", async () => {
  const { data, errors } = await runTestQuery(
    /* GraphQL */ `
      query {
        cReadPgSettings
      }
    `,
    {
      pgSettings: {
        statement_timeout: 12345,
        role: "postgraphile_test_visitor",
        "jwt.claims.string": "a string value",
        "jwt.claims.number": 42,
        "jwt.claims.boolean_true": true,
        "jwt.claims.other_string": "another string value",
        "jwt.claims.other_number": -7,
        "jwt.claims.boolean_false": false,
        "jwt.claims.empty_string": "",
        "jwt.claims.escaped_string": 'a "quoted" value',
        "jwt.claims.null": null,
        "jwt.claims.undefined": undefined,
      },
    },
    { path: __filename },
  );

  expect(errors).toBeFalsy();
  expect(data).toEqual({
    cReadPgSettings: {
      statement_timeout: "12345ms",
      role: "postgraphile_test_visitor",
      "jwt.claims.string": "a string value",
      "jwt.claims.number": "42",
      "jwt.claims.boolean_true": "true",
      "jwt.claims.other_string": "another string value",
      "jwt.claims.other_number": "-7",
      "jwt.claims.boolean_false": "false",
      "jwt.claims.empty_string": "",
      "jwt.claims.escaped_string": 'a "quoted" value',
      "jwt.claims.null": null,
      "jwt.claims.undefined": null,
    },
  });
});
