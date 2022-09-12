DO $$
BEGIN
  if current_setting('wal_level') is distinct from 'logical' then
    raise exception 'wal_level must be set to ''logical'', your database has it set to ''%''. Please edit your `%` file and restart PostgreSQL.', current_setting('wal_level'), current_setting('config_file');
  end if;
  if (current_setting('max_replication_slots')::int >= 1) is not true then
    raise exception 'Your max_replication_slots setting is too low, it must be greater than 1. Please edit your `%` file and restart PostgreSQL.', current_setting('config_file');
  end if;
  if (current_setting('max_wal_senders')::int >= 1) is not true then
    raise exception 'Your max_wal_senders setting is too low, it must be greater than 1. Please edit your `%` file and restart PostgreSQL.', current_setting('config_file');
  end if;

  PERFORM pg_drop_replication_slot('postgraphile');
EXCEPTION
  WHEN undefined_object THEN
    -- NO ACTION
    PERFORM 1;
END;
$$ language plpgsql;


