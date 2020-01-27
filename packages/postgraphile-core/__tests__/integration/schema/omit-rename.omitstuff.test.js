const core = require("./core");

test(
  "omit create, update and delete on table",
  core.test(
    ["d"],
    {},
    `
comment on table d.films is E'@omit create,update,delete';
`
  )
);

test(
  "omit create on table",
  core.test(
    ["d"],
    {},
    `
comment on table d.films is E'@omit create';
`
  )
);

test(
  "omit update on table",
  core.test(
    ["d"],
    {},
    `
comment on table d.films is E'@omit update';
`
  )
);

test(
  "omit delete on table",
  core.test(
    ["d"],
    {},
    `
comment on table d.films is E'@omit delete';
`
  )
);

test(
  "omit read on table",
  core.test(
    ["d"],
    {},
    `
comment on table d.films is E'@omit read,all,update,create,delete,many';
`
  )
);

test(
  "omit and omit everything on table",
  core.test(
    ["d"],
    {},
    `
comment on table d.films is E'@omit *';
comment on table d.tv_shows is E'@omit';
`
  )
);

test(
  "omit many on constraint and table",
  core.test(
    ["d"],
    {},
    `
comment on constraint post_author_id_fkey on d.post is E'@omit many\n@fieldName author';
comment on constraint tv_shows_studio_id_fkey on d.tv_shows is E'@omit many';
comment on table d.tv_episodes is E'@omit many';
`
  )
);

test(
  "omit order on table",
  core.test(
    ["d"],
    {},
    `
comment on table d.tv_shows is E'@omit order';
`
  )
);
