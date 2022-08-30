const core = require("./core");

test(
  "omit many on constraint and table",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on constraint post_author_id_fkey on d.post is E'@omit many\n@fieldName author';
comment on constraint tv_shows_studio_id_fkey on d.tv_shows is E'@omit many';
comment on table d.tv_episodes is E'@omit many';
`
  )
);
