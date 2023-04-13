import * as core from "./core.js";

test(
  "omit update on attribute",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on column d.tv_shows.title is E'@omit update';
`,
  ),
);
