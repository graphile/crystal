update "pg11"."types" as __types__ set "regrole" = $1::"regrole", "regnamespace" = $2::"regnamespace", "bigint_domain_array_domain" = $3::"c"."bigint_domain_array_domain", "domain_constrained_compound_type" = $4::"pg11"."domain_constrained_compound_type" where (__types__."id" = $5::"int4") returning
  __types__."id"::text as "0",
  __types__."regrole"::text as "1",
  __types__."regnamespace"::text as "2",
  __types__."bigint_domain_array_domain"::text as "3",
  case when (__types__."domain_constrained_compound_type") is not distinct from null then null::text else json_build_array((((__types__."domain_constrained_compound_type")."a"))::text, ((__types__."domain_constrained_compound_type")."b"), (((__types__."domain_constrained_compound_type")."c"))::text, ((__types__."domain_constrained_compound_type")."d"), (((__types__."domain_constrained_compound_type")."e"))::text, (((__types__."domain_constrained_compound_type")."f"))::text, to_char(((__types__."domain_constrained_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."domain_constrained_compound_type")."foo_bar"))::text)::text end as "4";

select __frmcdc_domain_constrained_compound_type_result__.*
from (select 0 as idx) as __frmcdc_domain_constrained_compound_type_identifier__,
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
  from (select ($1::"pg11"."domain_constrained_compound_type").*) as __frmcdc_domain_constrained_compound_type__
) as __frmcdc_domain_constrained_compound_type_result__;

insert into "pg11"."types" as __types__ ("regrole", "regnamespace", "bigint_domain_array_domain", "domain_constrained_compound_type") values ($1::"regrole", $2::"regnamespace", $3::"c"."bigint_domain_array_domain", $4::"pg11"."domain_constrained_compound_type") returning
  __types__."id"::text as "0",
  __types__."regrole"::text as "1",
  __types__."regnamespace"::text as "2",
  __types__."bigint_domain_array_domain"::text as "3",
  case when (__types__."domain_constrained_compound_type") is not distinct from null then null::text else json_build_array((((__types__."domain_constrained_compound_type")."a"))::text, ((__types__."domain_constrained_compound_type")."b"), (((__types__."domain_constrained_compound_type")."c"))::text, ((__types__."domain_constrained_compound_type")."d"), (((__types__."domain_constrained_compound_type")."e"))::text, (((__types__."domain_constrained_compound_type")."f"))::text, to_char(((__types__."domain_constrained_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."domain_constrained_compound_type")."foo_bar"))::text)::text end as "4";

select __frmcdc_domain_constrained_compound_type_result__.*
from (select 0 as idx) as __frmcdc_domain_constrained_compound_type_identifier__,
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
  from (select ($1::"pg11"."domain_constrained_compound_type").*) as __frmcdc_domain_constrained_compound_type__
) as __frmcdc_domain_constrained_compound_type_result__;