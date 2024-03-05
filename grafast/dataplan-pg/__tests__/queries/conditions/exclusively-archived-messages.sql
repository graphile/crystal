select
  __forums__."name" as "0",
  (select json_agg(s) from (
    select
      __messages__."body" as "0",
      __users__."username" as "1",
      __users__."gravatar_url" as "2",
      __messages__."id" as "3",
      __users_2."username" as "4",
      __users_2."gravatar_url" as "5"
    from app_public.messages as __messages__
    left outer join app_public.users as __users__
    on (
      (
        __messages__."author_id"::"uuid" = __users__."id"
      ) and (
        /* WHERE becoming ON */ (
          true /* authorization checks */
        )
      )
    )
    left outer join app_public.users as __users_2
    on (
      (
        __messages__."author_id"::"uuid" = __users_2."id"
      ) and (
        /* WHERE becoming ON */ (
          true /* authorization checks */
        )
      )
    )
    where
      (
        __messages__.archived_at is not null
      ) and (
        __forums__."id"::"uuid" = __messages__."forum_id"
      )
    order by __messages__."id" asc
    limit 6
  ) s) as "1",
  (select json_agg(s) from (
    select
      (count(*))::text as "0"
    from app_public.messages as __messages__
    where
      (
        __messages__.archived_at is not null
      ) and (
        __forums__."id"::"uuid" = __messages__."forum_id"
      )
  ) s) as "2"
from app_public.forums as __forums__
where (
  true /* authorization checks */
)
order by __forums__."id" asc;
