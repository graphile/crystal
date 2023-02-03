create table users (
  id serial primary key,
  username text
);

create table organizations (
  id serial primary key,
  name text
);

create table teams (
  id serial primary key,
  name text
);

create table goals (
  organization_id int not null references organizations,
  team_id int not null references teams,
  goal_uuid uuid not null default gen_random_uuid(),
  aim text,
  primary key(organization_id, team_id, goal_uuid)
);

create table goal_contributors (
  id serial primary key,
  organization_id int not null references organizations,
  team_id int not null references teams,
  goal_uuid uuid not null,
  contributor_id int not null references users,
  contribution text,

  foreign key (organization_id, team_id, goal_uuid) references goals
);
