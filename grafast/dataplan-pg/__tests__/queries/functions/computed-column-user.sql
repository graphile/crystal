select
  __forums_random_user__."username" as "0",
  __forums_random_user__."gravatar_url" as "1",
  __forums__."id" as "2"
from app_public.forums as __forums__
left outer join app_public.forums_random_user(__forums__) as __forums_random_user__
on (
/* WHERE becoming ON */ (
  true /* authorization checks */
))
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $1::"uuid"
  );
