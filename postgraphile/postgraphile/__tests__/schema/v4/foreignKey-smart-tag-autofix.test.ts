import * as core from "./core.ts";

test(
  "autofix plugin automatically adds uniques where needed",
  core.test(
    __filename,
    ["c"],
    {},
    (pgClient) => {
      return pgClient.query(
        `\
comment on table c.person_secret is E'@foreignKey (sekrit) references c.person (about)\\n@deprecated This is deprecated (comment on table c.person_secret).\\nTracks the person''s secret';
`,
      );
    },
    undefined,
    undefined,
    {
      gather: {
        pgFakeConstraintsAutofixForeignKeyUniqueness: true,
      },
    },
  ),
);
