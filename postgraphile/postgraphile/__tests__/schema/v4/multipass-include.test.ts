import { scopedUtils } from "graphile-utils";

import * as core from "./core.ts";

const { multipassInclude } = scopedUtils("default");

test(
  "makes explicitly included objects available to gather plugins",
  core.test(undefined, "issue_2212", {}, undefined, undefined, true, {
    plugins: [
      multipassInclude({
        tables: ["enum_tables.simple_enum"],
        functions: ["c.floatrange"],
      }),
      multipassInclude({ types: ["b.wrapped_url"] }),
      multipassInclude({ serviceName: "other", tables: ["refs.people"] }),
      {
        name: "CheckIncludedObjects",
        gather: {
          hooks: {
            pgIntrospection_introspection(_info, { introspection }) {
              const included = introspection
                .getNamespace({ name: "enum_tables" })
                ?.getClass({ name: "simple_enum" });
              expect(
                included?.getAttributes().map((attr) => attr.attname),
              ).toContain("value");
              expect(included?.getTags().enum).toBe(true);
              expect(
                introspection
                  .getNamespace({ name: "c" })
                  ?.getProcs({ name: "floatrange" }),
              ).toHaveLength(2);
              expect(
                introspection
                  .getType({ schemaName: "b", name: "wrapped_url" })
                  ?.getClass()
                  ?.getAttributes()
                  .map((attr) => attr.attname),
              ).toEqual(["url"]);
              expect(
                introspection
                  .getNamespace({ name: "refs" })
                  ?.getClass({ name: "people" }),
              ).toBeUndefined();
            },
          },
        },
      },
    ],
  }),
);
