select
  case when (__forums__) is not distinct from null then null::text else json_build_array(((__forums__)."id"), ((__forums__)."name"), to_char(((__forums__)."archived_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text))::text end as "0",
  __forums__."id" as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $1::"uuid"
  );

select
  __forums_unique_author_count__.v::text as "0"
from app_public.forums_unique_author_count(
  $1::app_public.forums,
  $2::"bool"
) as __forums_unique_author_count__(v)
where (
  true /* authorization checks */
);

select
  __forums_unique_author_count__.v::text as "0"
from app_public.forums_unique_author_count(
  $1::app_public.forums,
  $2::"bool"
) as __forums_unique_author_count__(v)
where (
  true /* authorization checks */
);

select
  __forums_unique_author_count__.v::text as "0"
from app_public.forums_unique_author_count(
  $1::app_public.forums,
  $2::"bool"
) as __forums_unique_author_count__(v)
where (
  true /* authorization checks */
);
