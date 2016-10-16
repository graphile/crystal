-- An additional query to be run when setting up our demo database. This will
-- drop the `forum_example_postgraphql` role which people know the password for
-- (because it’s in the tutorial!), and creates additional
-- `forum_example_postgraphql_demo` role which only has the permissions of an
-- anonymous user.

begin;

drop role forum_example_postgraphql;

create role forum_example_postgraphql_demo login password 'password';
grant forum_example_anonymous to forum_example_postgraphql_demo;

commit;
