select __list_bde_mutation_result__.*
from (select 0 as idx) as __list_bde_mutation_identifiers__,
lateral (
  select
    __list_bde_mutation__.v::text as "0",
    __list_bde_mutation_identifiers__.idx as "1"
  from "b"."list_bde_mutation"(
    $1::"text"[],
    $2::"text",
    $3::"text"
  ) as __list_bde_mutation__(v)
) as __list_bde_mutation_result__;

select __list_bde_mutation_result__.*
from (select 0 as idx) as __list_bde_mutation_identifiers__,
lateral (
  select
    __list_bde_mutation__.v::text as "0",
    __list_bde_mutation_identifiers__.idx as "1"
  from "b"."list_bde_mutation"(
    $1::"text"[],
    $2::"text",
    $3::"text"
  ) as __list_bde_mutation__(v)
) as __list_bde_mutation_result__;

select __list_bde_mutation_result__.*
from (select 0 as idx) as __list_bde_mutation_identifiers__,
lateral (
  select
    __list_bde_mutation__.v::text as "0",
    __list_bde_mutation_identifiers__.idx as "1"
  from "b"."list_bde_mutation"(
    $1::"text"[],
    $2::"text",
    $3::"text"
  ) as __list_bde_mutation__(v)
) as __list_bde_mutation_result__;

select __list_bde_mutation_result__.*
from (select 0 as idx) as __list_bde_mutation_identifiers__,
lateral (
  select
    __list_bde_mutation__.v::text as "0",
    __list_bde_mutation_identifiers__.idx as "1"
  from "b"."list_bde_mutation"(
    $1::"text"[],
    $2::"text",
    $3::"text"
  ) as __list_bde_mutation__(v)
) as __list_bde_mutation_result__;