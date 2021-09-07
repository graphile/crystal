select __forums_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0",
    (ids.value->>1)::"bool" as "id1"
  from json_array_elements($1::json) with ordinality as ids
) as __forums_identifiers__,
lateral (
  select
    __users__."username"::text as "0",
    __users__."gravatar_url"::text as "1",
    __forums_unique_author_count__.__forums_unique_author_count__::text as "2",
    array(
      select array[
        __forums_featured_messages__."body"::text
      ]::text[]
      from app_public.forums_featured_messages(__users_most_recent_forum__) as __forums_featured_messages__
      where (
        true /* authorization checks */
      )
    ) as "3",
    __forums_identifiers__.idx as "4"
  from app_public.forums as __forums__
  left outer join app_public.forums_random_user(__forums__) as __users__
  on TRUE
  left outer join app_public.users_most_recent_forum(__users__) as __users_most_recent_forum__
  on TRUE
  left outer join app_public.forums_unique_author_count(__users_most_recent_forum__, __forums_identifiers__."id1") as __forums_unique_author_count__
  on TRUE
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
  order by __forums__."id" asc
) as __forums_result__