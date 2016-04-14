drop schema if exists postgraphql_integration_tests cascade;

create schema postgraphql_integration_tests;

set search_path = postgraphql_integration_tests;

create table person (
  id               serial not null primary key,
  given_name       varchar(64) not null,
  family_name      varchar(64)
);

comment on table person is 'A human, person, user of the forum.';
comment on column person.id is 'The primary key for the person.';
comment on column person.given_name is 'The person’s first name.';
comment on column person.family_name is 'The person’s last name.';

insert into person (id, given_name, family_name) values
  (1, 'Kathryn', 'Ramirez'),
  (2, 'Johnny', 'Tucker'),
  (3, 'Nancy', 'Diaz'),
  (4, 'Russell', 'Gardner'),
  (5, 'Ann', 'West'),
  (6, 'Joe', 'Cruz'),
  (7, 'Scott', 'Torres'),
  (8, 'David', 'Bell'),
  (9, 'Carl', 'Ward'),
  (10, 'Jonathan', 'Campbell'),
  (11, 'Beverly', 'Kelly'),
  (12, 'Kelly', 'Reed'),
  (13, 'Nicholas', 'Perry'),
  (14, 'Carol', 'Taylor');
