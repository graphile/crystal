const core = require("./core");

test(
  "omit and omit everything on table",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on table d.films is E'@omit *';
comment on table d.tv_shows is E'@omit';
`
  )
);
