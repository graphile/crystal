import * as core from "./core.js";

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
