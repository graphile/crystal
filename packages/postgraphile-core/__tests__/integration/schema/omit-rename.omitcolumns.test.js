const core = require("./core");

test(
  "omit create on column",
  core.test(
    ["d"],
    {},
    `
comment on column d.tv_shows.title is E'@omit create';
`
  )
);

test(
  "omit update on column",
  core.test(
    ["d"],
    {},
    `
comment on column d.tv_shows.title is E'@omit update';
`
  )
);

test(
  "omit read on column",
  core.test(
    ["d"],
    {},
    `
comment on column d.tv_shows.title is E'@omit read,create,update,delete,all,many';
`
  )
);

test(
  "omit on column",
  core.test(
    ["d"],
    {},
    `
comment on column d.tv_shows.title is E'@omit *';
comment on column d.tv_episodes.title is E'@omit';
`
  )
);

test(
  "omit order on column",
  core.test(
    ["d"],
    {},
    `
comment on column d.tv_episodes.title is E'@omit order';
`
  )
);

test(
  "omit execute on computed column",
  core.test(
    ["d"],
    {},
    `
comment on function d.person_full_name(d.person) is E'@omit execute';
`
  )
);
