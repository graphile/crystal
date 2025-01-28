select
  __network__."id"::text as "0",
  __network__."inet"::text as "1",
  __network__."cidr"::text as "2",
  __network__."macaddr"::text as "3",
  __network__."id" as "4"
from "network_types"."network" as __network__
where (
  __network__."inet" = $1::"inet"
)
order by __network__."id" asc;

select
  (count(*))::text as "0"
from "network_types"."network" as __network__
where (
  __network__."inet" = $1::"inet"
);

select
  __network__."id"::text as "0",
  __network__."inet"::text as "1",
  __network__."cidr"::text as "2",
  __network__."macaddr"::text as "3",
  __network__."id" as "4"
from "network_types"."network" as __network__
where (
  __network__."cidr" = $1::"cidr"
)
order by __network__."id" asc;

select
  (count(*))::text as "0"
from "network_types"."network" as __network__
where (
  __network__."cidr" = $1::"cidr"
);

select
  __network__."id"::text as "0",
  __network__."inet"::text as "1",
  __network__."cidr"::text as "2",
  __network__."macaddr"::text as "3",
  __network__."id" as "4"
from "network_types"."network" as __network__
where (
  __network__."macaddr" = $1::"macaddr"
)
order by __network__."id" asc;

select
  (count(*))::text as "0"
from "network_types"."network" as __network__
where (
  __network__."macaddr" = $1::"macaddr"
);