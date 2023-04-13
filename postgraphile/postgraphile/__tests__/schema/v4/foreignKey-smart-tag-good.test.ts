import * as core from "./core.js";

test(
  "doesn't raise an error when a foreignKey references a unique combination of attributes",
  core.test(__filename, ["c"], {}, (pgClient) => {
    return pgClient.query(
      `\
comment on table c.person_secret is E'@foreignKey (sekrit) references c.person (about)\\n@deprecated This is deprecated (comment on table c.person_secret).\\nTracks the person''s secret';
ALTER TABLE "c"."person" ADD UNIQUE ("about");
`,
    );
  }),
);
