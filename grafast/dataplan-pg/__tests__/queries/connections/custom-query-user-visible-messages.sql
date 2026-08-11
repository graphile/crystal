select
  __random_user__."id" as "0",
  array(
    select array[
      __messages__."id"
    ]::text[]
    from app_public.messages as __messages__
    where
      (
        __messages__.author_id = __random_user__."id"
      ) and (
        true /* authorization checks */
      )
    order by __messages__."id" asc, __messages__."id" asc
  )::text as "1"
from app_public.random_user() as __random_user__
where (
  true /* authorization checks */
);
