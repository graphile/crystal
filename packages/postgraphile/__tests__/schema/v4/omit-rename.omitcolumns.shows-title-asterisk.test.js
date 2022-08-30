const core = require("./core");

test(
  "omit on column",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on column d.tv_shows.title is E'@omit *';
comment on column d.tv_episodes.title is E'@omit';
`
  )
);
