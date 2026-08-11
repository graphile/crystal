select
  __random_user_array__."id" as "0",
  array(
    select array[
      __messages__."id"
    ]::text[]
    from app_public.messages as __messages__
    where
      (
        __messages__.author_id = __random_user_array__."id"
      ) and (
        true /* authorization checks */
      )
    order by __messages__."id" asc, __messages__."id" asc
  )::text as "1"
from unnest(app_public.random_user_array()) as __random_user_array__
where (
  true /* authorization checks */
);
