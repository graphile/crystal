create table companies (
  id serial primary key,
  name text not null
);
comment on table companies is E'@listSuffix omit';

create table beverages (
  id serial primary key,
  company_id int not null references companies,
  distributor_id int references companies,
  name text not null
);
comment on constraint "beverages_company_id_fkey" on "beverages" is E'@listSuffix omit';
-- @omitListSuffix has no effect when @foreignSimpleFieldName is set
comment on constraint "beverages_distributor_id_fkey" on "beverages" is
  E'@foreignFieldName distributedBeverages\n@foreignSimpleFieldName distributedBeveragesListing\n@listSuffix omit';

create function list_omit() returns setof beverages as $$
  select * from beverages;
$$ language sql stable;
comment on function list_omit() is E'@listSuffix omit';

create function list_include() returns setof beverages as $$
  select * from beverages;
$$ language sql stable;

create function companies_computed_list_omit(company companies) returns setof beverages as $$
  select * from beverages;
$$ language sql stable;
comment on function companies_computed_list_omit(companies) is E'@listSuffix omit';

create function companies_computed_list_include(company companies) returns setof beverages as $$
  select * from beverages;
$$ language sql stable;
