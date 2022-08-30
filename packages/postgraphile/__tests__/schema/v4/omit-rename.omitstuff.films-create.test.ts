const core = require("./core");

test(
  "omit create on table",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on table d.films is E'@omit create';
`
  )
);
