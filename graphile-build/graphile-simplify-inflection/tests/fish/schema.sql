create table ponds(
  id serial primary key,
  name text not null
);

create table fish(
  id serial primary key,
  pond_id int not null references ponds,
  name text not null
);
insert into ponds (name) values ('Amy'), ('James'), ('Duck');
insert into fish (pond_id, name) values (1, 'Blub'), (2, 'Bubble'), (3, 'Guber');

