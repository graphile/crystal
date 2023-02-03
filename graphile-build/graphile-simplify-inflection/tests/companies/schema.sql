create table companies (
  id serial primary key,
  name text not null
);

create table beverages (
  id serial primary key,
  company_id int not null references companies,
  distributor_id int references companies,
  name text not null
);
comment on constraint "beverages_distributor_id_fkey" on "beverages" is
  E'@foreignFieldName distributedBeverages\n@foreignSimpleFieldName distributedBeveragesList';

create table mascots (
    id serial primary key,
    company_id int unique not null references companies,
    name text not null
);

