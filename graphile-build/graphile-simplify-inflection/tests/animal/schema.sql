create table animal (
  id serial primary key
);

create table dog (
  id integer primary key references animal
);

create table cat (
  id integer primary key references animal
);

create table gerbil (
  animal_id integer primary key references animal
);
