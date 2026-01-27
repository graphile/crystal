import * as core from "./core.ts";

test(
  "omit delete on table",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on table d.films is E'@omit delete';
`,
  ),
);
