select __person_result__.*
from (select 0 as idx, $1::"text" as "id0") as __person_identifiers__,
lateral (
  select
    (select json_agg(s) from (
      select
        __post__."headline" as "0",
        __post__."author_id"::text as "1"
      from "a"."post" as __post__
      where (
        __person__."id"::"int4" = __post__."author_id"
      )
      order by __post__."id" desc
      limit 2
    ) s) as "0",
    (select json_agg(s) from (
      select
        __post_2."headline" as "0",
        __post_2."author_id"::text as "1"
      from "a"."post" as __post_2
      where
        (
          __post_2."headline" = __person_identifiers__."id0"
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
    __person__."person_full_name" as "5",
    __person_identifiers__.idx as "6"
  from "c"."person" as __person__
  order by __person__."id" asc
) as __person_result__;

select
  (select json_agg(s) from (
    select
      __foreign_key__."person_id"::text as "0",
      __foreign_key__."compound_key_1"::text as "1",
      __foreign_key__."compound_key_2"::text as "2",
      (not (__foreign_key__ is null))::text as "3"
    from "a"."foreign_key" as __foreign_key__
    where
      (
        __compound_key__."person_id_1"::"int4" = __foreign_key__."compound_key_1"
      ) and (
        __compound_key__."person_id_2"::"int4" = __foreign_key__."compound_key_2"
      )
  ) s) as "0",
  __compound_key__."person_id_1"::text as "1",
  __compound_key__."person_id_2"::text as "2"
from "c"."compound_key" as __compound_key__
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;