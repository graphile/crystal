select
  __c_person__."id"::text as "0"
from "c"."person" as __c_person__
where (
  __c_person__."id" = $1::"int4"
);

select /* NOTHING?! */
from "c"."person" as __c_person__
where
  (
    __c_person__."id" = $1::"int4"
  ) and (
    __c_person__."email" = $2::"b"."email"
  )
order by __c_person__."id" asc;