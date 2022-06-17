select __unique_author_count_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"bool" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __unique_author_count_identifiers__,
lateral (
  select
    __unique_author_count__.v::text as "0",
    __unique_author_count_identifiers__.idx as "1"
  from app_public.unique_author_count(__unique_author_count_identifiers__."id0") as __unique_author_count__(v)
  where (
    true /* authorization checks */
  )
) as __unique_author_count_result__

select __unique_author_count_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"bool" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __unique_author_count_identifiers__,
lateral (
  select
    __unique_author_count__.v::text as "0",
    __unique_author_count_identifiers__.idx as "1"
  from app_public.unique_author_count(__unique_author_count_identifiers__."id0") as __unique_author_count__(v)
  where (
    true /* authorization checks */
  )
) as __unique_author_count_result__

select __unique_author_count_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"bool" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __unique_author_count_identifiers__,
lateral (
  select
    __unique_author_count__.v::text as "0",
    __unique_author_count_identifiers__.idx as "1"
  from app_public.unique_author_count(__unique_author_count_identifiers__."id0") as __unique_author_count__(v)
  where (
    true /* authorization checks */
  )
) as __unique_author_count_result__