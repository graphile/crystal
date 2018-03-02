-- @see https://github.com/graphile/postgraphile/blob/886f8752f03d3fa05bdbdd97eeabb153a4d0343e/resources/watch-fixtures.sql

-- Adds the functionality for PostGraphile to watch the database for schema
-- changes. This script is idempotent, you can run it as many times as you
-- would like.

-- Drop the `postgraphile_watch` schema and all of its dependant objects
-- including the event trigger function and the event trigger itself. We will
-- recreate those objects in this script.
drop schema if exists postgraphile_watch cascade;

-- Create a schema for the PostGraphile watch functionality. This schema will
-- hold things like trigger functions that are used to implement schema
-- watching.
create schema postgraphile_watch;

create function postgraphile_watch.notify_watchers_ddl() returns event_trigger as $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$ language plpgsql;

create function postgraphile_watch.notify_watchers_drop() returns event_trigger as $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$ language plpgsql;

-- Create an event trigger which will listen for the completion of all DDL
-- events and report that they happened to PostGraphile. Events are selected by
-- whether or not they modify the static definition of `pg_catalog` that
-- `introspection-query.sql` queries.
create event trigger postgraphile_watch_ddl
  on ddl_command_end
  when tag in (
    'ALTER DOMAIN',
    'ALTER FOREIGN TABLE',
    'ALTER FUNCTION',
    'ALTER SCHEMA',
    'ALTER TABLE',
    'ALTER TYPE',
    'ALTER VIEW',
    'COMMENT',
    'CREATE DOMAIN',
    'CREATE FOREIGN TABLE',
    'CREATE FUNCTION',
    'CREATE SCHEMA',
    'CREATE TABLE',
    'CREATE TABLE AS',
    'CREATE VIEW',
    'DROP DOMAIN',
    'DROP FOREIGN TABLE',
    'DROP FUNCTION',
    'DROP SCHEMA',
    'DROP TABLE',
    'DROP VIEW',
    'GRANT',
    'REVOKE',
    'SELECT INTO'
  )
  execute procedure postgraphile_watch.notify_watchers_ddl();

-- Create an event trigger which will listen for drop events because on drops
-- the DDL method seems to get nothing returned from
-- pg_event_trigger_ddl_commands()
create event trigger postgraphile_watch_drop
  on sql_drop
  execute procedure postgraphile_watch.notify_watchers_drop();
