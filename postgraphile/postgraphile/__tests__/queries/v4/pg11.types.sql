select
  __types__."id"::text as "0",
  __types__."regrole"::text as "1",
  __types__."regnamespace"::text as "2",
  __types__."bigint_domain_array_domain"::text as "3",
  case when (__types__."domain_constrained_compound_type") is not distinct from null then null::text else json_build_array((((__types__."domain_constrained_compound_type")."a"))::text, ((__types__."domain_constrained_compound_type")."b"), (((__types__."domain_constrained_compound_type")."c"))::text, ((__types__."domain_constrained_compound_type")."d"), (((__types__."domain_constrained_compound_type")."e"))::text, (((__types__."domain_constrained_compound_type")."f"))::text, to_char(((__types__."domain_constrained_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."domain_constrained_compound_type")."foo_bar"))::text)::text end as "4"
from "pg11"."types" as __types__
order by __types__."id" asc;

select
  (count(*))::text as "0"
from "pg11"."types" as __types__;

select __frmcdc_domain_constrained_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"pg11"."domain_constrained_compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_domain_constrained_compound_type_identifier__,
lateral (
  select
    __frmcdc_domain_constrained_compound_type__."a"::text as "0",
    __frmcdc_domain_constrained_compound_type__."b" as "1",
    __frmcdc_domain_constrained_compound_type__."c"::text as "2",
    __frmcdc_domain_constrained_compound_type__."d" as "3",
    __frmcdc_domain_constrained_compound_type__."e"::text as "4",
    __frmcdc_domain_constrained_compound_type__."f"::text as "5",
    __frmcdc_domain_constrained_compound_type__."foo_bar"::text as "6",
    (not (__frmcdc_domain_constrained_compound_type__ is null))::text as "7",
    __frmcdc_domain_constrained_compound_type_identifier__.idx as "8"
  from (select (__frmcdc_domain_constrained_compound_type_identifier__."id0").*) as __frmcdc_domain_constrained_compound_type__
) as __frmcdc_domain_constrained_compound_type_result__;