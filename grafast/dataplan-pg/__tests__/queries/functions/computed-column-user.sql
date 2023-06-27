select __forums_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __forums_identifiers__,
lateral (
  select
    __forums_random_user__."username" as "0",
    __forums_random_user__."gravatar_url" as "1",
    __forums__."id" as "2",
    __forums_identifiers__.idx as "3"
  from app_public.forums as __forums__
  left outer join app_public.forums_random_user(__forums__) as __forums_random_user__
  on TRUE
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
) as __forums_result__;
