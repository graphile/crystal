select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."id" ASC
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."id" ASC
  limit 2
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."person_full_name" ASC,
  __local_0__."id" ASC
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."person_full_name" DESC,
  __local_0__."id" ASC
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."headline")) as "headline",
to_json((__local_0__."author_id")) as "authorId"
from (
  select __local_0__.*
  from "a"."post" as __local_0__
  where (
    __local_0__."author_id" = $1
  ) and (TRUE) and (TRUE)
  order by __local_0__."id" ASC
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."headline")) as "headline",
to_json((__local_0__."author_id")) as "authorId"
from (
  select __local_0__.*
  from "a"."post" as __local_0__
  where (
    __local_0__."author_id" = $1
  ) and (TRUE) and (TRUE)
  order by __local_0__."id" ASC
  limit 2
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."id" ASC
  limit 3 offset 1
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."id" ASC
  limit 0
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."id" ASC
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (__local_0__."about" IS NULL) and (TRUE) and (TRUE)
  order by __local_0__."id" ASC
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."headline")) as "headline",
to_json((__local_0__."author_id")) as "authorId"
from (
  select __local_0__.*
  from "a"."post" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."author_id" DESC,
  __local_0__."headline" DESC,
  __local_0__."id" ASC
  limit 3
) __local_0__