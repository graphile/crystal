set search_path to app_public, public;

update foo set name = 'David' where id = 4;
select pg_sleep(3);
insert into bar (foo_id, name) values (6, 'Francine''s dog');
select pg_sleep(3);
insert into bar (foo_id, name) values (6, 'Francine''s handbag');
select pg_sleep(3);
insert into foo (name) values ('George');

