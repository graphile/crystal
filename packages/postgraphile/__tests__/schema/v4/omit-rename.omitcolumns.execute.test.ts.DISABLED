import * as core from "./core.js";

test(
  "omit execute on computed column",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on function d.person_full_name(d.person) is E'@omit execute';
`,
  ),
);
