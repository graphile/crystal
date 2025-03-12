select
  __forums__."id" as "0",
  __forums_unique_author_count__.v::text as "1",
  __forums_unique_author_count_2.v::text as "2",
  __forums_unique_author_count_3.v::text as "3"
from app_public.forums as __forums__
left outer join app_public.forums_unique_author_count(__forums__) as __forums_unique_author_count__(v)
on (
/* WHERE becoming ON */ (
  true /* authorization checks */
))
left outer join app_public.forums_unique_author_count(
  __forums__,
  $1::"bool"
) as __forums_unique_author_count_2(v)
on (
/* WHERE becoming ON */ (
  true /* authorization checks */
))
left outer join app_public.forums_unique_author_count(
  __forums__,
  $2::"bool"
) as __forums_unique_author_count_3(v)
on (
/* WHERE becoming ON */ (
  true /* authorization checks */
))
where
  (
    __forums__."id" = $3::"uuid"
  ) and (
    true /* authorization checks */
  );
