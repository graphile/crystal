const core = require("./core");

test(
  "omit order on column",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on column d.tv_episodes.title is E'@omit order';
`
  )
);
