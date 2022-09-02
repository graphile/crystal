import * as core from "./core.js";

test(
  "omit create on column",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on column d.tv_shows.title is E'@omit create';
`,
  ),
);
