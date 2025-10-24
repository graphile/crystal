select
  case when (__spectacles__) is not distinct from null then null::text else json_build_array(
    (((__spectacles__)."id"))::text,
    ((__spectacles__)."model_number")
  )::text end as "0",
  __spectacles__."id"::text as "1"
from "relay"."spectacles" as __spectacles__
where (
  __spectacles__."id" = $1::"int4"
);

select
  case when (__spectacles__) is not distinct from null then null::text else json_build_array(
    (((__spectacles__)."id"))::text,
    ((__spectacles__)."model_number")
  )::text end as "0",
  __spectacles__."id"::text as "1"
from "relay"."spectacles" as __spectacles__
where (
  __spectacles__."id" = $1::"int4"
);

select
  case when (__spectacles__) is not distinct from null then null::text else json_build_array(
    (((__spectacles__)."id"))::text,
    ((__spectacles__)."model_number")
  )::text end as "0",
  __spectacles__."id"::text as "1"
from "relay"."spectacles" as __spectacles__
where (
  __spectacles__."id" = $1::"int4"
);

select
  case when (__spectacles__) is not distinct from null then null::text else json_build_array(
    (((__spectacles__)."id"))::text,
    ((__spectacles__)."model_number")
  )::text end as "0",
  __spectacles__."id"::text as "1"
from "relay"."spectacles" as __spectacles__
where (
  __spectacles__."id" = $1::"int4"
);

select
  __users__."username" as "0",
  ("relay"."users_max_reading_distance"(
    __users__,
    $1::"relay"."spectacles"
  ))::text as "1",
  ("relay"."users_max_reading_distance"(
    __users__,
    $2::"relay"."spectacles"
  ))::text as "2",
  ("relay"."users_max_reading_distance"(
    __users__,
    $3::"relay"."spectacles"
  ))::text as "3",
  ("relay"."users_max_reading_distance"(
    __users__,
    $4::"relay"."spectacles"
  ))::text as "4",
  ("relay"."users_max_reading_distance"(
    __users__,
    $5::"relay"."spectacles"
  ))::text as "5",
  ("relay"."users_max_reading_distance"(
    __users__,
    $6::"relay"."spectacles"
  ))::text as "6",
  ("relay"."users_max_reading_distance"(
    __users__,
    $7::"relay"."spectacles"
  ))::text as "7",
  ("relay"."users_max_reading_distance"(
    __users__,
    $8::"relay"."spectacles"
  ))::text as "8"
from "relay"."users" as __users__
where (
  __users__."id" = $9::"int4"
);

select
  __users__."username" as "0",
  ("relay"."users_max_reading_distance"(
    __users__,
    $1::"relay"."spectacles"
  ))::text as "1",
  ("relay"."users_max_reading_distance"(
    __users__,
    $2::"relay"."spectacles"
  ))::text as "2",
  ("relay"."users_max_reading_distance"(
    __users__,
    $3::"relay"."spectacles"
  ))::text as "3",
  ("relay"."users_max_reading_distance"(
    __users__,
    $4::"relay"."spectacles"
  ))::text as "4",
  ("relay"."users_max_reading_distance"(
    __users__,
    $5::"relay"."spectacles"
  ))::text as "5",
  ("relay"."users_max_reading_distance"(
    __users__,
    $6::"relay"."spectacles"
  ))::text as "6",
  ("relay"."users_max_reading_distance"(
    __users__,
    $7::"relay"."spectacles"
  ))::text as "7",
  ("relay"."users_max_reading_distance"(
    __users__,
    $8::"relay"."spectacles"
  ))::text as "8"
from "relay"."users" as __users__
where (
  __users__."id" = $9::"int4"
);