import * as core from "./core.js";

test(
  "omit order on attribute",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on column d.tv_episodes.title is E'@omit order';
`,
  ),
);
