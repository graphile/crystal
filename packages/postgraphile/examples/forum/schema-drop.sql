-- This script will delete everything created in `schema.sql`. This script is
-- also idempotent, you can run it as many times as you would like. Nothing
-- will be dropped if the schemas and roles do not exist.

begin;

drop schema if exists forum_example, forum_example_private cascade;
drop role if exists forum_example_postgraphile, forum_example_anonymous, forum_example_person, forum_example_postgraphile_demo;

commit;
