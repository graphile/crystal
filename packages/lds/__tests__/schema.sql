\ir ./drop_replication_slot.sql

drop schema if exists app_public cascade;

create schema app_public;
set search_path to app_public, public;

do $_$
begin
if current_setting('server_version_num')::int >= 90500 then
  -- JSONB supported
  -- current_setting(x, true) supported
  create function viewer_id() returns int as $$
    select nullif(current_setting('jwt.claims.user_id', true), '')::int;
  $$ language sql stable;
else
  execute 'alter database ' || quote_ident(current_database()) || ' set jwt.claims.user_id to ''''';
  create function viewer_id() returns int as $$
    select nullif(current_setting('jwt.claims.user_id'), '')::int;
  $$ language sql stable;
end if;
end;
$_$ language plpgsql;

create table foo (
  id serial primary key,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table bar (
  id serial primary key,
  foo_id int not null references foo on delete cascade,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function odd_foos() returns setof foo as $$
  select * from app_public.foo where id % 2 = 1;
$$ language sql stable;

create function odd_foos_array() returns foo[] as $$
  select array_agg(foo.*) from app_public.foo where id % 2 = 1;
$$ language sql stable;

create function foo_one() returns foo as $$
  select * from app_public.foo where id = 1;
$$ language sql stable;

create function tg__update_timestamps() returns trigger as $$
begin
  if tg_op = 'INSERT' then
    new.created_at = now();
    new.updated_at = now();
  else
    new.created_at = old.created_at;
    new.updated_at = GREATEST(now(), old.updated_at + interval '1 microsecond');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger _100_timestamps before insert or update on foo for each row execute procedure tg__update_timestamps();
create trigger _100_timestamps before insert or update on bar for each row execute procedure tg__update_timestamps();

insert into foo (name) values
  ('Adam'),
  ('Benjie'),
  ('Caroline'),
  ('Dave'),
  ('Ellie'),
  ('Francine');

insert into bar(foo_id, label) values
  (1, 'China'),
  (2, 'PostGraphile'),
  (2, 'GraphQL'),
  (3, 'Rabbits'),
  (4, 'Buns'),
  (5, 'Folk');
