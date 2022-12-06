select
  __types__."id"::text as "0",
  __types__."regrole"::text as "1",
  __types__."regnamespace"::text as "2",
  __types__."bigint_domain_array_domain"::text as "3",
  __frmcdc_domain_constrained_compound_type_1__."a"::text as "4",
  __frmcdc_domain_constrained_compound_type_1__."b" as "5",
  __frmcdc_domain_constrained_compound_type_1__."c"::text as "6",
  __frmcdc_domain_constrained_compound_type_1__."d" as "7",
  __frmcdc_domain_constrained_compound_type_1__."e"::text as "8",
  __frmcdc_domain_constrained_compound_type_1__."f"::text as "9",
  __frmcdc_domain_constrained_compound_type_1__."foo_bar"::text as "10",
  (not (__frmcdc_domain_constrained_compound_type_1__ is null))::text as "11",
  __frmcdc_domain_constrained_compound_type_1_2."foo_bar"::text as "12",
  __frmcdc_domain_constrained_compound_type_1_2."f"::text as "13",
  __frmcdc_domain_constrained_compound_type_1_2."e"::text as "14",
  __frmcdc_domain_constrained_compound_type_1_2."d" as "15",
  __frmcdc_domain_constrained_compound_type_1_2."c"::text as "16",
  __frmcdc_domain_constrained_compound_type_1_2."b" as "17",
  __frmcdc_domain_constrained_compound_type_1_2."a"::text as "18",
  (not (__frmcdc_domain_constrained_compound_type_1_2 is null))::text as "19"
from "pg11"."types" as __types__
left outer join lateral (select (__types__."domain_constrained_compound_type").*) as __frmcdc_domain_constrained_compound_type_1__
on TRUE
left outer join lateral (select (__types__."domain_constrained_compound_type").*) as __frmcdc_domain_constrained_compound_type_1_2
on TRUE
order by __types__."id" asc;

select
  (count(*))::text as "0"
from "pg11"."types" as __types__;