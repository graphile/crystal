insert into "pg11"."network" as __network__ ("inet", "cidr", "macaddr", "macaddr8") values ($1::"inet", $2::"cidr", $3::"macaddr", $4::"macaddr8") returning
  __network__."id"::text as "0",
  __network__."inet"::text as "1",
  __network__."cidr"::text as "2",
  __network__."macaddr"::text as "3",
  __network__."macaddr8"::text as "4"
