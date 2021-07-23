select __forums_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0",
    (ids.value->>1)::"bool" as "id1",
    (ids.value->>2)::"bool" as "id2",
    (ids.value->>3)::"bool" as "id3"
  from json_array_elements($1::json) with ordinality as ids
) as __forums_identifiers__,
lateral (
  select
    __forums_unique_author_count__.__forums_unique_author_count__::text as "0",
    __forums_unique_author_count_2.__forums_unique_author_count_2::text as "1",
    __forums_unique_author_count_3.__forums_unique_author_count_3::text as "2",
    __forums__::text as "3",
    __forums_identifiers__.idx as "4"
  from app_public.forums as __forums__
  left outer join app_public.forums_unique_author_count(__forums__, __forums_identifiers__."id1") as __forums_unique_author_count__
  on TRUE
  left outer join app_public.forums_unique_author_count(__forums__, __forums_identifiers__."id2") as __forums_unique_author_count_2
  on TRUE
  left outer join app_public.forums_unique_author_count(__forums__, __forums_identifiers__."id3") as __forums_unique_author_count_3
  on TRUE
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
  order by __forums__."id" asc
) as __forums_result__