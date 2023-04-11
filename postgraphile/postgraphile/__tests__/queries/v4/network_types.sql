select __network_result__.*
from (select 0 as idx, $1::"inet" as "id0") as __network_identifiers__,
lateral (
  select
    __network__."id"::text as "0",
    __network__."inet"::text as "1",
    __network__."cidr"::text as "2",
    __network__."macaddr"::text as "3",
    __network_identifiers__.idx as "4"
  from "network_types"."network" as __network__
  where (
    __network__."inet" = __network_identifiers__."id0"
  )
  order by __network__."id" asc
) as __network_result__;

select __network_result__.*
from (select 0 as idx, $1::"inet" as "id0") as __network_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __network_identifiers__.idx as "1"
  from "network_types"."network" as __network__
  where (
    __network__."inet" = __network_identifiers__."id0"
  )
) as __network_result__;

select __network_result__.*
from (select 0 as idx, $1::"cidr" as "id0") as __network_identifiers__,
lateral (
  select
    __network__."id"::text as "0",
    __network__."inet"::text as "1",
    __network__."cidr"::text as "2",
    __network__."macaddr"::text as "3",
    __network_identifiers__.idx as "4"
  from "network_types"."network" as __network__
  where (
    __network__."cidr" = __network_identifiers__."id0"
  )
  order by __network__."id" asc
) as __network_result__;

select __network_result__.*
from (select 0 as idx, $1::"cidr" as "id0") as __network_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __network_identifiers__.idx as "1"
  from "network_types"."network" as __network__
  where (
    __network__."cidr" = __network_identifiers__."id0"
  )
) as __network_result__;

select __network_result__.*
from (select 0 as idx, $1::"macaddr" as "id0") as __network_identifiers__,
lateral (
  select
    __network__."id"::text as "0",
    __network__."inet"::text as "1",
    __network__."cidr"::text as "2",
    __network__."macaddr"::text as "3",
    __network_identifiers__.idx as "4"
  from "network_types"."network" as __network__
  where (
    __network__."macaddr" = __network_identifiers__."id0"
  )
  order by __network__."id" asc
) as __network_result__;

select __network_result__.*
from (select 0 as idx, $1::"macaddr" as "id0") as __network_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __network_identifiers__.idx as "1"
  from "network_types"."network" as __network__
  where (
    __network__."macaddr" = __network_identifiers__."id0"
  )
) as __network_result__;