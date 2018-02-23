-- Adds the functionality for PostGraphile to watch the database for schema
-- changes. This script is idempotent, you can run it as many times as you
-- would like.

begin;

-- Drop the `postgraphile_watch` schema and all of its dependant objects
-- including the event trigger function and the event trigger itself. We will
-- recreate those objects in this script.
drop schema if exists postgraphile_watch cascade;

-- Create a schema for the PostGraphile watch functionality. This schema will
-- hold things like trigger functions that are used to implement schema
-- watching.
create schema postgraphile_watch;

-- This function will notify PostGraphile of schema changes via a trigger.
create function postgraphile_watch.notify_watchers() returns event_trigger as $$
begin
  perform pg_notify(
    'postgraphile_watch',
    (select array_to_json(array_agg(x)) from (select schema_name as schema, command_tag as command from pg_event_trigger_ddl_commands()) as x)::text
  );
end;
$$ language plpgsql;

-- Create an event trigger which will listen for the completion of all DDL
-- events and report that they happened to PostGraphile. Events are selected by
-- whether or not they modify the static definition of `pg_catalog` that
-- `introspection-query.sql` queries.
create event trigger postgraphile_watch
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
  execute procedure postgraphile_watch.notify_watchers();

commit;
