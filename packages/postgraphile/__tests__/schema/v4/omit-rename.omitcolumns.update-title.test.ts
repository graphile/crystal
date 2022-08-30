const core = require("./core");

test(
  "omit update on column",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on column d.tv_shows.title is E'@omit update';
`
  )
);
