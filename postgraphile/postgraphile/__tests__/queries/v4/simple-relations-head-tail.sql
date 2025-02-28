select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1"
from "c"."compound_key" as __compound_key__
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  array(
    select array[
      __post__."headline",
      __post__."author_id"::text
    ]::text[]
    from "a"."post" as __post__
    where (
      __post__."author_id" = __person__."id"
    )
    order by __post__."id" asc
    limit 2
  )::text as "2",
  array(
    select array[
      __post_2."headline",
      __post_2."author_id"::text
    ]::text[]
    from "a"."post" as __post_2
    where
      (
        __post_2."author_id" = __person__."id"
      ) and (
        __post_2."headline" = $1::"text"
      )
    order by __post_2."id" asc
  )::text as "3",
  array(
    select array[
      __compound_key__."person_id_1"::text,
      __compound_key__."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key__
    where (
      __compound_key__."person_id_1" = __person__."id"
    )
    order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
  )::text as "4",
  array(
    select array[
      __compound_key_2."person_id_1"::text,
      __compound_key_2."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key_2
    where (
      __compound_key_2."person_id_2" = __person__."id"
    )
    order by __compound_key_2."person_id_1" asc, __compound_key_2."person_id_2" asc
  )::text as "5"
from "c"."person" as __person__
order by __person__."id" asc;