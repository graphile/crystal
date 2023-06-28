select __forums_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __forums_identifiers__,
lateral (
  select
    __forums__::text as "0",
    __forums__."id" as "1",
    __forums_identifiers__.idx as "2"
  from app_public.forums as __forums__
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
) as __forums_result__;

select __forums_random_user_result__.*
from (select 0 as idx, $1::app_public.forums as "id0") as __forums_random_user_identifiers__,
lateral (
  select
    __forums_random_user__."username" as "0",
    __forums_random_user__."gravatar_url" as "1",
    __forums_random_user__::text as "2",
    __forums_random_user_identifiers__.idx as "3"
  from app_public.forums_random_user(__forums_random_user_identifiers__."id0") as __forums_random_user__
  where (
    true /* authorization checks */
  )
) as __forums_random_user_result__;

select __users_most_recent_forum_result__.*
from (select 0 as idx, $1::app_public.users as "id0", $2::"bool" as "id1") as __users_most_recent_forum_identifiers__,
lateral (
  select
    __forums_unique_author_count__.v::text as "0",
    __users_most_recent_forum__::text as "1",
    __users_most_recent_forum__."id" as "2",
    __users_most_recent_forum_identifiers__.idx as "3"
  from app_public.users_most_recent_forum(__users_most_recent_forum_identifiers__."id0") as __users_most_recent_forum__
  left outer join app_public.forums_unique_author_count(
    __users_most_recent_forum__,
    __users_most_recent_forum_identifiers__."id1"
  ) as __forums_unique_author_count__(v)
  on TRUE
  where (
    true /* authorization checks */
  )
) as __users_most_recent_forum_result__;

select __forums_featured_messages_result__.*
from (select 0 as idx, $1::app_public.forums as "id0") as __forums_featured_messages_identifiers__,
lateral (
  select
    __forums_featured_messages__."body" as "0",
    __forums_featured_messages_identifiers__.idx as "1"
  from app_public.forums_featured_messages(__forums_featured_messages_identifiers__."id0") as __forums_featured_messages__
  where (
    true /* authorization checks */
  )
) as __forums_featured_messages_result__;
