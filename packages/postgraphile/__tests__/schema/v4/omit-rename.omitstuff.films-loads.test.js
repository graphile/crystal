const core = require("./core");

test(
  "omit read on table",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on table d.films is E'@omit read,all,update,create,delete,many';
`
  )
);
