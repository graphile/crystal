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
  __forums_random_user__."username" as "0",
  __forums_random_user__."gravatar_url" as "1",
  case when (__forums_random_user__) is not distinct from null then null::text else json_build_array(((__forums_random_user__)."id"), ((__forums_random_user__)."username"), ((__forums_random_user__)."gravatar_url"), to_char(((__forums_random_user__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text))::text end as "2"
from app_public.forums_random_user($1::app_public.forums) as __forums_random_user__
where (
  true /* authorization checks */
);

select
  case when (__users_most_recent_forum__) is not distinct from null then null::text else json_build_array(((__users_most_recent_forum__)."id"), ((__users_most_recent_forum__)."name"), to_char(((__users_most_recent_forum__)."archived_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text))::text end as "0",
  __users_most_recent_forum__."id" as "1"
from app_public.users_most_recent_forum($1::app_public.users) as __users_most_recent_forum__;

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
  __forums_featured_messages__."body" as "0"
from app_public.forums_featured_messages($1::app_public.forums) as __forums_featured_messages__
where (
  true /* authorization checks */
);
