select 
  __forums__."name"::text as "0",
  __forums__."id"::text as "1"
from app_public.forums as __forums__
where (
  true /* authorization checks */
)
order by __forums__."id" asc
limit 2

select 
  __messages__."body"::text as "0",
  __messages__."author_id"::text as "1",
  __messages_identifiers__.idx as "2"
from app_public.messages as __messages__
inner join (select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0" from json_array_elements($1) with ordinality as ids) as __messages_identifiers__
on ((__messages__."forum_id" = __messages_identifiers__."id0"))
order by __messages__."id" asc
limit 2

select 
  __users__."username"::text as "0",
  __users__."gravatar_url"::text as "1",
  __users_identifiers__.idx as "2"
from app_public.users as __users__
inner join (select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0" from json_array_elements($1) with ordinality as ids) as __users_identifiers__
on ((__users__."id" = __users_identifiers__."id0"))
where (
  true /* authorization checks */
)
order by __users__."id" asc