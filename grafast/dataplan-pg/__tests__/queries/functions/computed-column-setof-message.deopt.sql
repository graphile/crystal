select __forums_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __forums_identifiers__,
lateral (
  select
    case when (__forums__) is not distinct from null then null::text else json_build_array(((__forums__)."id"), ((__forums__)."name"), to_char(((__forums__)."archived_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text))::text end as "0",
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

select __forums_featured_messages_result__.*
from (select 0 as idx) as __forums_featured_messages_identifiers__,
lateral (
  select
    __forums_featured_messages__."body" as "0",
    __forums_featured_messages_identifiers__.idx as "1"
  from app_public.forums_featured_messages($1::app_public.forums) as __forums_featured_messages__
  where (
    true /* authorization checks */
  )
) as __forums_featured_messages_result__;
