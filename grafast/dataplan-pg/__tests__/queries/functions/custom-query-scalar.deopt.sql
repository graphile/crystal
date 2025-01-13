select
  __unique_author_count__.v::text as "0"
from app_public.unique_author_count("featured" := $1::"bool") as __unique_author_count__(v)
where (
  true /* authorization checks */
);

select
  __unique_author_count__.v::text as "0"
from app_public.unique_author_count("featured" := $1::"bool") as __unique_author_count__(v)
where (
  true /* authorization checks */
);

select
  __unique_author_count__.v::text as "0"
from app_public.unique_author_count("featured" := $1::"bool") as __unique_author_count__(v)
where (
  true /* authorization checks */
);
