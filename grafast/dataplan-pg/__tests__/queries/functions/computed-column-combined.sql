select
  __forums_random_user__."username" as "0",
  __forums_random_user__."gravatar_url" as "1",
  __forums_unique_author_count__.v::text as "2",
  (select json_agg(s) from (
    select
      __forums_featured_messages__."body" as "0"
    from app_public.forums_featured_messages(__users_most_recent_forum__) as __forums_featured_messages__
    where (
      true /* authorization checks */
    )
  ) s) as "3",
  __users_most_recent_forum__."id" as "4",
  __forums__."id" as "5"
from app_public.forums as __forums__
left outer join app_public.forums_random_user(__forums__) as __forums_random_user__
on (
/* WHERE becoming ON */ (
  true /* authorization checks */
))
left outer join app_public.users_most_recent_forum(__forums_random_user__) as __users_most_recent_forum__
on TRUE
left outer join app_public.forums_unique_author_count(
  __users_most_recent_forum__,
  $1::"bool"
) as __forums_unique_author_count__(v)
on (
/* WHERE becoming ON */ (
  true /* authorization checks */
))
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $2::"uuid"
  );
