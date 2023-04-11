select __unique_author_count_result__.*
from (select 0 as idx, $1::"bool" as "id0") as __unique_author_count_identifiers__,
lateral (
  select
    __unique_author_count__.v::text as "0",
    __unique_author_count_identifiers__.idx as "1"
  from app_public.unique_author_count("featured" := __unique_author_count_identifiers__."id0") as __unique_author_count__(v)
  where (
    true /* authorization checks */
  )
) as __unique_author_count_result__;

select __unique_author_count_result__.*
from (select 0 as idx, $1::"bool" as "id0") as __unique_author_count_identifiers__,
lateral (
  select
    __unique_author_count__.v::text as "0",
    __unique_author_count_identifiers__.idx as "1"
  from app_public.unique_author_count("featured" := __unique_author_count_identifiers__."id0") as __unique_author_count__(v)
  where (
    true /* authorization checks */
  )
) as __unique_author_count_result__;

select __unique_author_count_result__.*
from (select 0 as idx, $1::"bool" as "id0") as __unique_author_count_identifiers__,
lateral (
  select
    __unique_author_count__.v::text as "0",
    __unique_author_count_identifiers__.idx as "1"
  from app_public.unique_author_count("featured" := __unique_author_count_identifiers__."id0") as __unique_author_count__(v)
  where (
    true /* authorization checks */
  )
) as __unique_author_count_result__;
