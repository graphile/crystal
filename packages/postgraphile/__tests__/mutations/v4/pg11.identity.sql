insert into "pg11"."always_as_identity" as __always_as_identity__ ("t") values ($1::"text") returning
  __always_as_identity__."id"::text as "0",
  __always_as_identity__."t" as "1"


insert into "pg11"."by_default_as_identity" as __by_default_as_identity__ ("t") values ($1::"text") returning
  __by_default_as_identity__."id"::text as "0",
  __by_default_as_identity__."t" as "1"


insert into "pg11"."by_default_as_identity" as __by_default_as_identity__ ("id", "t") values ($1::"int4", $2::"text") returning
  __by_default_as_identity__."id"::text as "0",
  __by_default_as_identity__."t" as "1"
