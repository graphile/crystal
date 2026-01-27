import * as core from "./core.ts";

test(
  "omit update on table",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on table d.films is E'@omit update';
`,
  ),
);
