insert into "c"."person" as __person__ ("id", "person_full_name", "email") values ($1::"int4", $2::"varchar", $3::"b"."email") returning
  __person__."id" as "0",
  __person__."person_full_name" as "1",
  __person__."id"::text as "2";

update "c"."person" as __person__ set "person_full_name" = $1::"varchar" where (__person__."id" = $2::"int4") returning
  __person__."id" as "0",
  __person__."person_full_name" as "1",
  __person__."id"::text as "2";

delete from "c"."person" as __person__ where (__person__."id" = $1::"int4") returning
  __person__."id" as "0",
  __person__."person_full_name" as "1",
  __person__."id"::text as "2";

insert into "c"."person" as __person__ ("id", "person_full_name", "email") values ($1::"int4", $2::"varchar", $3::"b"."email") returning
  __person__."id" as "0",
  __person__."person_full_name" as "1",
  __person__."id"::text as "2";