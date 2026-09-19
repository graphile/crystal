insert into "c"."person" as __person__ ("id", "person_full_name", "email") values ($1::"int4", $2::"varchar", $3::"b"."email") returning
  __person__."id" as "0",
  __person__."person_full_name" as "1",
  __person__."id"::text as "2";