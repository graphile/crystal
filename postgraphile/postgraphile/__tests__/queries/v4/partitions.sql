select
  to_char(__measurements__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "0",
  __measurements__."key" as "1",
  __measurements__."value"::text as "2",
  __users__."id"::text as "3",
  __users__."name" as "4"
from "partitions"."measurements" as __measurements__
left outer join "partitions"."users" as __users__
on (
/* WHERE becoming ON */ (
  __users__."id" = __measurements__."user_id"
))
order by __measurements__."timestamp" asc, __measurements__."key" asc;

select
  __location_tags__."entity_kind"::text as "0",
  __location_tags__."entity_id" as "1",
  __location_tags__."tag" as "2",
  __locations__."id" as "3"
from "partitions"."location_tags" as __location_tags__
left outer join "partitions"."locations" as __locations__
on (
/* WHERE becoming ON */ (
  __locations__."id" = __location_tags__."entity_id"
))
order by __location_tags__."entity_kind" asc, __location_tags__."entity_id" asc, __location_tags__."tag" asc;

select
  __locations__."id" as "0",
  array(
    select array[
      __location_tags__."tag"
    ]::text[]
    from "partitions"."location_tags" as __location_tags__
    where (
      __location_tags__."entity_id" = __locations__."id"
    )
    order by __location_tags__."entity_kind" asc, __location_tags__."entity_id" asc, __location_tags__."tag" asc
  )::text as "1"
from "partitions"."locations" as __locations__
order by __locations__."id" asc;

select
  __photo_tags__."entity_kind"::text as "0",
  __photo_tags__."entity_id" as "1",
  __photo_tags__."tag" as "2",
  __photos__."id" as "3"
from "partitions"."photo_tags" as __photo_tags__
left outer join "partitions"."photos" as __photos__
on (
/* WHERE becoming ON */ (
  __photos__."id" = __photo_tags__."entity_id"
))
order by __photo_tags__."entity_kind" asc, __photo_tags__."entity_id" asc, __photo_tags__."tag" asc;

select
  __photos__."id" as "0",
  array(
    select array[
      __photo_tags__."tag"
    ]::text[]
    from "partitions"."photo_tags" as __photo_tags__
    where (
      __photo_tags__."entity_id" = __photos__."id"
    )
    order by __photo_tags__."entity_kind" asc, __photo_tags__."entity_id" asc, __photo_tags__."tag" asc
  )::text as "1"
from "partitions"."photos" as __photos__
order by __photos__."id" asc;

select
  __profile_tags__."entity_kind"::text as "0",
  __profile_tags__."entity_id" as "1",
  __profile_tags__."tag" as "2",
  __profiles__."id" as "3"
from "partitions"."profile_tags" as __profile_tags__
left outer join "partitions"."profiles" as __profiles__
on (
/* WHERE becoming ON */ (
  __profiles__."id" = __profile_tags__."entity_id"
))
order by __profile_tags__."entity_kind" asc, __profile_tags__."entity_id" asc, __profile_tags__."tag" asc;

select
  __profiles__."id" as "0",
  array(
    select array[
      __profile_tags__."tag"
    ]::text[]
    from "partitions"."profile_tags" as __profile_tags__
    where (
      __profile_tags__."entity_id" = __profiles__."id"
    )
    order by __profile_tags__."entity_kind" asc, __profile_tags__."entity_id" asc, __profile_tags__."tag" asc
  )::text as "1"
from "partitions"."profiles" as __profiles__
order by __profiles__."id" asc;

select
  (count(*))::text as "0"
from "partitions"."measurements" as __measurements__;