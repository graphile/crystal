begin; /*fake*/

select set_config(key, value, true) from unnest($1::text[], $2::text[]) as settings(key, value)

delete from "c"."person" as __person__ where (__person__."id" = $1::"int4") returning
  __person__."id"::text as "0";

commit; /*fake*/