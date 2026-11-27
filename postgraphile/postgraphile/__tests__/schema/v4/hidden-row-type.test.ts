import * as adaptor from "@dataplan/pg/adaptors/pg";
import { makeSchema } from "graphile-build";
import { assertObjectType, getNamedType } from "graphql";

import AmberPreset from "../../../dist/presets/amber.js";
import { withPoolClientTransaction } from "../../helpers.ts";

test.each([false, true])(
  "builds codecs for hidden extension row types (multipass: %s)",
  (multipass) =>
    withPoolClientTransaction(async (client) => {
      await client.query(`
        create schema hidden_row_test;
        create extension pg_buffercache with schema hidden_row_test;
        create function hidden_row_test.buffer_entry()
          returns hidden_row_test.pg_buffercache language sql stable
          as $$ select null::hidden_row_test.pg_buffercache $$;
        create function hidden_row_test.buffer_entries()
          returns hidden_row_test.pg_buffercache[] language sql stable
          as $$ select null::hidden_row_test.pg_buffercache[] $$;
      `);
      const { schema } = await makeSchema({
        extends: [AmberPreset],
        gather: { pgMultipassIntrospection: multipass },
        pgServices: [
          {
            adaptor,
            name: "main",
            withPgClientKey: "withPgClient",
            pgSettingsKey: "pgSettings",
            schemas: ["hidden_row_test"],
            adaptorSettings: { poolClient: client },
          },
        ],
      });
      const fields = schema.getQueryType()!.getFields();
      expect(fields.bufferEntry).toBeDefined();
      expect(fields.bufferEntries).toBeDefined();
      const row = assertObjectType(getNamedType(fields.bufferEntry.type));
      expect(row.getFields().bufferid).toBeDefined();
      expect(getNamedType(fields.bufferEntries.type)).toBe(row);
      expect(fields.allPgBuffercaches).toBeUndefined();
      expect(fields.pgBuffercachePages).toBeUndefined();
    }),
);
