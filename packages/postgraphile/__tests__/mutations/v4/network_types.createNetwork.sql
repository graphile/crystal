insert into "network_types"."network" as __network__ ("inet", "cidr", "macaddr") values ($1::"inet", $2::"cidr", $3::"macaddr") returning
  __network__."id"::text as "0",
  __network__."inet"::text as "1",
  __network__."cidr"::text as "2",
  __network__."macaddr"::text as "3"
