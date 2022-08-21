select
  __types__."id"::text as "0",
  __temporary_source1__."foo_bar"::text as "1",
  __temporary_source1__."f"::text as "2",
  __temporary_source1__."e"::text as "3",
  __temporary_source1__."d" as "4",
  __temporary_source1__."c"::text as "5",
  __temporary_source1__."b" as "6",
  __temporary_source1__."a"::text as "7",
  (not (__temporary_source1__ is null))::text as "8",
  __types__."domain_constrained_compound_type"::text as "9",
  __types__."bigint_domain_array_domain"::text as "10",
  __types__."regnamespace"::text as "11",
  __types__."regrole"::text as "12"
from "pg11"."types" as __types__
left outer join lateral (select (__types__."domain_constrained_compound_type").*) as __temporary_source1__
on TRUE
order by __types__."id" asc

select
  (count(*))::text as "0"
from "pg11"."types" as __types__