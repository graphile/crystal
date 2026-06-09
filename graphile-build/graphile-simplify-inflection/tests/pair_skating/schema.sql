create table skaters (
  id bigint generated always as identity,
  primary key (id)
);

create table competing_pairs (
  id bigint generated always as identity,
  primary key (id),

  male_skater bigint not null unique
    references skaters(id),
  female_skater bigint not null unique
    references skaters(id)
);

create index on competing_pairs(male_skater);
create index on competing_pairs(female_skater);
