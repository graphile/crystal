select
  (select json_agg(s) from (
    select
      __post__."headline" as "0",
      __post__."author_id"::text as "1"
    from "a"."post" as __post__
    where (
      __person__."id"::"int4" = __post__."author_id"
    )
    order by __post__."id" asc
    limit 2
  ) s) as "0",
  (select json_agg(s) from (
    select
      __post_2."headline" as "0",
      __post_2."author_id"::text as "1"
    from "a"."post" as __post_2
    where
      (
        __post_2."headline" = $1::"text"
      ) and (
        __person__."id"::"int4" = __post_2."author_id"
      )
    order by __post_2."id" asc
  ) s) as "1",
  (select json_agg(s) from (
    select
      __compound_key__."person_id_1"::text as "0",
      __compound_key__."person_id_2"::text as "1"
    from "c"."compound_key" as __compound_key__
    where (
      __person__."id"::"int4" = __compound_key__."person_id_1"
    )
    order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
  ) s) as "2",
  (select json_agg(s) from (
    select
      __compound_key_2."person_id_1"::text as "0",
      __compound_key_2."person_id_2"::text as "1"
    from "c"."compound_key" as __compound_key_2
    where (
      __person__."id"::"int4" = __compound_key_2."person_id_2"
    )
    order by __compound_key_2."person_id_1" asc, __compound_key_2."person_id_2" asc
  ) s) as "3",
  __person__."id"::text as "4",
  __person__."person_full_name" as "5"
from "c"."person" as __person__
order by __person__."id" asc;

select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1"
from "c"."compound_key" as __compound_key__
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;