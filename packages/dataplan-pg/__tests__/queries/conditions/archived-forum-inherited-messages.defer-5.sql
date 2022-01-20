select
  __forums__."name" as "0",
  (select json_agg(_._) from (
    select json_build_array(
      __messages__."body",
      __users__."username",
      __users__."gravatar_url",
      __messages__."id",
      __users_2."username",
      __users_2."gravatar_url"
    ) as _
    from app_public.messages as __messages__
    left outer join app_public.users as __users__
    on (__messages__."author_id"::"uuid" = __users__."id")
    left outer join app_public.users as __users_2
    on (__messages__."author_id"::"uuid" = __users_2."id")
    where
      (
        (__messages__.archived_at is null) = (__forums__."archived_at" is null)
      ) and (
        __forums__."id"::"uuid" = __messages__."forum_id"
      )
    order by __messages__."id" asc
  ) _) as "1",
  (select json_agg(_._) from (
    select json_build_array(
      (count(*))::text
    ) as _
    from app_public.messages as __messages__
    where
      (
        (__messages__.archived_at is null) = (__forums__."archived_at" is null)
      ) and (
        __forums__."id"::"uuid" = __messages__."forum_id"
      )
  ) _) as "2"
from app_public.forums as __forums__
where
  (
    __forums__.archived_at is not null
  ) and (
    true /* authorization checks */
  )
order by __forums__."id" asc