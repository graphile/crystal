import * as core from "./core.js";

test(
  "omit order on table",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on table d.tv_shows is E'@omit order';
`,
  ),
);
