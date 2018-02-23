-- An additional query to be run when setting up our demo database. This will
-- drop the `forum_example_postgraphile` role which people know the password for
-- (because it’s in the tutorial!), and creates additional
-- `forum_example_postgraphile_demo` role which only has the permissions of an
-- anonymous user.

begin;

drop role forum_example_postgraphile;

create role forum_example_postgraphile_demo login password 'password';
grant forum_example_anonymous to forum_example_postgraphile_demo;

commit;
