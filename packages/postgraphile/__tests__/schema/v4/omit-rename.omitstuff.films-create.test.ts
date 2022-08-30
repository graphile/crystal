import * as core from "./core.js";

test(
  "omit create on table",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on table d.films is E'@omit create';
`,
  ),
);
