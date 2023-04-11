update "pg11"."types" as __types__ set "regrole" = $1::"regrole", "regnamespace" = $2::"regnamespace", "bigint_domain_array_domain" = $3::"c"."bigint_domain_array_domain", "domain_constrained_compound_type" = $4::"pg11"."domain_constrained_compound_type" where (__types__."id" = $5::"int4") returning
  __types__."id"::text as "0",
  __types__."regrole"::text as "1",
  __types__."regnamespace"::text as "2",
  __types__."bigint_domain_array_domain"::text as "3",
  __types__."domain_constrained_compound_type"::text as "4";

select __frmcdc_domain_constrained_compound_type_1_result__.*
from (select 0 as idx, $1::"pg11"."domain_constrained_compound_type" as "id0") as __frmcdc_domain_constrained_compound_type_1_identifi__,
lateral (
  select
    __frmcdc_domain_constrained_compound_type_1__."a"::text as "0",
    __frmcdc_domain_constrained_compound_type_1__."b" as "1",
    __frmcdc_domain_constrained_compound_type_1__."c"::text as "2",
    __frmcdc_domain_constrained_compound_type_1__."d" as "3",
    __frmcdc_domain_constrained_compound_type_1__."e"::text as "4",
    __frmcdc_domain_constrained_compound_type_1__."f"::text as "5",
    __frmcdc_domain_constrained_compound_type_1__."foo_bar"::text as "6",
    (not (__frmcdc_domain_constrained_compound_type_1__ is null))::text as "7",
    __frmcdc_domain_constrained_compound_type_1_identifi__.idx as "8"
  from (select (__frmcdc_domain_constrained_compound_type_1_identifi__."id0").*) as __frmcdc_domain_constrained_compound_type_1__
) as __frmcdc_domain_constrained_compound_type_1_result__;

insert into "pg11"."types" as __types__ ("regrole", "regnamespace", "bigint_domain_array_domain", "domain_constrained_compound_type") values ($1::"regrole", $2::"regnamespace", $3::"c"."bigint_domain_array_domain", $4::"pg11"."domain_constrained_compound_type") returning
  __types__."id"::text as "0",
  __types__."regrole"::text as "1",
  __types__."regnamespace"::text as "2",
  __types__."bigint_domain_array_domain"::text as "3",
  __types__."domain_constrained_compound_type"::text as "4";

select __frmcdc_domain_constrained_compound_type_1_result__.*
from (select 0 as idx, $1::"pg11"."domain_constrained_compound_type" as "id0") as __frmcdc_domain_constrained_compound_type_1_identifi__,
lateral (
  select
    __frmcdc_domain_constrained_compound_type_1__."a"::text as "0",
    __frmcdc_domain_constrained_compound_type_1__."b" as "1",
    __frmcdc_domain_constrained_compound_type_1__."c"::text as "2",
    __frmcdc_domain_constrained_compound_type_1__."d" as "3",
    __frmcdc_domain_constrained_compound_type_1__."e"::text as "4",
    __frmcdc_domain_constrained_compound_type_1__."f"::text as "5",
    __frmcdc_domain_constrained_compound_type_1__."foo_bar"::text as "6",
    (not (__frmcdc_domain_constrained_compound_type_1__ is null))::text as "7",
    __frmcdc_domain_constrained_compound_type_1_identifi__.idx as "8"
  from (select (__frmcdc_domain_constrained_compound_type_1_identifi__."id0").*) as __frmcdc_domain_constrained_compound_type_1__
) as __frmcdc_domain_constrained_compound_type_1_result__;