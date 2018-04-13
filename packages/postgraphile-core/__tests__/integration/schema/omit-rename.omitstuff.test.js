const core = require("./core");

test("omit create, update and delete on table", core.test(["d"], {}, `
comment on table d.films is E'@omit create,update,delete';
`));

test("omit create on table", core.test(["d"], {}, `
comment on table d.films is E'@omit create';
`));

test("omit update on table", core.test(["d"], {}, `
comment on table d.films is E'@omit update';
`));

test("omit delete on table", core.test(["d"], {}, `
comment on table d.films is E'@omit delete';
`));

test("omit read on table", core.test(["d"], {}, `
comment on table d.films is E'@omit read,all,update,create,delete,many';
`));


test("omit and omit many on table", core.test(["d"], {}, `
comment on table d.films is E'@omit *';
comment on table d.tv_shows is E'@omit';
comment on table d.tv_episodes is E'@omit many';
`));

test("omit order on table", core.test(["d"], {}, `
comment on table d.tv_shows is E'@omit order';
`));
