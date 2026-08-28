select
  __forums__."id" as "0",
  __forums_random_user__."username" as "1",
  __forums_random_user__."gravatar_url" as "2",
  (
    select array[
      __users_most_recent_forum__."id",
      __forums_unique_author_count__.v::text,
      array(
        select array[
          __forums_featured_messages__."body"
        ]::text[]
        from app_public.forums_featured_messages(__users_most_recent_forum__) as __forums_featured_messages__
        where (
          true /* authorization checks */
        )
      )::text
    ]::text[]
    from app_public.users_most_recent_forum(__forums_random_user__) as __users_most_recent_forum__
    left outer join app_public.forums_unique_author_count(__users_most_recent_forum__) as __forums_unique_author_count__(v)
    on (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    ))
  )::text as "3"
from app_public.forums as __forums__
left outer join app_public.forums_random_user(__forums__) as __forums_random_user__
on (
/* WHERE becoming ON */ (
  true /* authorization checks */
))
where
  (
    __forums__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );
