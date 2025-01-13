select __forums_result__.*
from (select 0 as idx, $4::"uuid" as "id0") as __forums_identifiers__,
lateral (
  select
    __forums_unique_author_count__.v::text as "0",
    __forums_unique_author_count_2.v::text as "1",
    __forums_unique_author_count_3.v::text as "2",
    __forums__."id" as "3",
    __forums_identifiers__.idx as "4"
  from app_public.forums as __forums__
  left outer join app_public.forums_unique_author_count(
    __forums__,
    $1::"bool"
  ) as __forums_unique_author_count__(v)
  on (
  /* WHERE becoming ON */ (
    true /* authorization checks */
  ))
  left outer join app_public.forums_unique_author_count(
    __forums__,
    $2::"bool"
  ) as __forums_unique_author_count_2(v)
  on (
  /* WHERE becoming ON */ (
    true /* authorization checks */
  ))
  left outer join app_public.forums_unique_author_count(
    __forums__,
    $3::"bool"
  ) as __forums_unique_author_count_3(v)
  on (
  /* WHERE becoming ON */ (
    true /* authorization checks */
  ))
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
) as __forums_result__;
