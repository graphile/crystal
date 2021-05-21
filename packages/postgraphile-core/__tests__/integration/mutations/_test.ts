import { promises as fsp } from "fs";
import { graphql } from "graphql";
import JSON5 from "json5";
import { basename } from "path";

import { createPostGraphileSchema } from "../../..";
import { getServerVersionNum,withPgClient } from "../../helpers";

const kitchenSinkData = () =>
  fsp.readFile(`${__dirname}/../../kitchen-sink-data.sql`, "utf8");

const pg10Data = () => fsp.readFile(`${__dirname}/../../pg10-data.sql`, "utf8");

const dSchemaComments = () =>
  fsp.readFile(`${__dirname}/../../kitchen-sink-d-schema-comments.sql`, "utf8");

export const testGraphQL = (query: string, path: string) => {
  const fileName = basename(path);
  const lines = query.split("\n");
  const config: {
    [key: string]: any;
  } = {};
  for (const line of lines) {
    if (line.startsWith("#>")) {
      const colon = line.indexOf(":");
      if (colon < 0) {
        throw new Error(
          `Invalid query configuration '${line}' - expected colon.`,
        );
      }
      const key = line.substr(2, colon - 2).trim();
      const value = JSON5.parse(line.substr(colon + 1));
      config[key] = value;
    }
  }

  return withPgClient(async (pgClient) => {
    const serverVersionNum = await getServerVersionNum(pgClient);
    if (fileName.startsWith("pg10.")) {
      if (serverVersionNum < 100000) {
        console.log("Skipping test as PG version is less than 10");
        return;
      }
    }

    await pgClient.query(await dSchemaComments());
    await pgClient.query(await kitchenSinkData());
    if (serverVersionNum >= 100000) {
      await pgClient.query(await pg10Data());
    }

    const {
      variables,
      rbac,
      schemas = ["a", "b", "c"],
      options = {},
      ...rest
    } = config;
    if (Object.keys(rest).length) {
      throw new Error(
        `Invalid query configuration - keys '${Object.keys(rest).join(
          "', '",
        )}' not understood.`,
      );
    }
    const postgraphileOptions = {
      subscriptions: true,
      ...config.options,
    };

    let spy: jest.SpyInstance | null = null;
    if (rbac) {
      await pgClient.query("set role postgraphile_test_authenticator");
      spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    }

    const schema = await createPostGraphileSchema(
      pgClient,
      schemas,
      postgraphileOptions,
    );

    if (rbac) {
      await pgClient.query("reset role");
      if (spy) {
        // Expect rbac schema to output Recoverable error about post_with_suffix
        expect(spy.mock.calls).toHaveLength(1);
        spy.mockRestore();
      }
    }

    await pgClient.query("savepoint test");
    if (rbac) {
      await pgClient.query(
        "select set_config('role', 'postgraphile_test_visitor', true), set_config('jwt.claims.user_id', '3', true)",
      );
    }
    try {
      // Return the result of our GraphQL query.
      const result = await graphql(
        schema,
        query,
        null,
        {
          pgClient,
        },
        variables,
      );
      if (result.errors) {
        // eslint-disable-next-line no-console
        console.log(
          `GraphQL query '${fileName}' had an error:\n  ` +
            result.errors
              .map((e) => {
                const error = e.originalError || e;
                let message = error.message || String(e);
                if (e.locations && e.locations[0]) {
                  message = `[${e.locations[0].line}:${e.locations[0].column}]: ${message}`;
                }
                return message;
              })
              .join("\n  "),
        );
      }
      expect(result).toMatchSnapshot();
    } finally {
      await pgClient.query("rollback to savepoint test");
    }
  });
};
