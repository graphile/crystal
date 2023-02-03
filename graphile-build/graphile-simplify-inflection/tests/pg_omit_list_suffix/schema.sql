create table companies (
  id serial primary key,
  name text not null
);
comment on table companies is E'@listSuffix include';

create table beverages (
  id serial primary key,
  company_id int not null references companies,
  distributor_id int references companies,
  name text not null
);
comment on constraint "beverages_company_id_fkey" on "beverages" is E'@listSuffix include';
-- @omitListSuffix has no effect when @foreignSimpleFieldName is set
comment on constraint "beverages_distributor_id_fkey" on "beverages" is
  E'@foreignFieldName distributedBeverages\n@foreignSimpleFieldName distributedBeveragesListing\n@listSuffix include';

create function list_include() returns setof beverages as $$
  select * from beverages;
$$ language sql stable;
comment on function list_include() is E'@listSuffix include';

create function list_omit() returns setof beverages as $$
  select * from beverages;
$$ language sql stable;

create function companies_computed_list_include(company companies) returns setof beverages as $$
  select * from beverages;
$$ language sql stable;
comment on function companies_computed_list_include(companies) is E'@listSuffix include';

create function companies_computed_list_omit(company companies) returns setof beverages as $$
  select * from beverages;
$$ language sql stable;
