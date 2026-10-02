begin; /*fake*/

insert into "c"."person" as __person__ ("id", "person_full_name", "email") values ($1::"int4", $2::"varchar", $3::"b"."email") returning
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."about" as "2";

commit; /*fake*/

begin; /*fake*/

update "c"."person" as __person__ set "person_full_name" = $1::"varchar" where (__person__."id" = $2::"int4") returning
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."about" as "2";

commit; /*fake*/

begin; /*fake*/

delete from "c"."person" as __person__ where (__person__."id" = $1::"int4") returning
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."about" as "2";

commit; /*fake*/

begin; /*fake*/

insert into "c"."person" as __person__ ("id", "person_full_name", "email") values ($1::"int4", $2::"varchar", $3::"b"."email") returning
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."about" as "2";

commit; /*fake*/