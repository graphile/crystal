create table something(
  something_id integer not null primary key,
  name text
);

create table something_data(
  something_data_id integer not null primary key,
	something_id integer not null references something on delete cascade,
	data text
);

comment on column something.something_id is E'@name some_id';
comment on column something_data.something_id is E'@name some_id';
