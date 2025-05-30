select
  case when (__spectacles__) is not distinct from null then null::text else json_build_array((((__spectacles__)."id"))::text, ((__spectacles__)."model_number"))::text end as "0",
  __spectacles__."id"::text as "1"
from "relay"."spectacles" as __spectacles__
where (
  __spectacles__."id" = $1::"int4"
);

select
  __users__."username" as "0",
  ("relay"."users_max_reading_distance"(
    __users_2,
    $1::"relay"."spectacles"
  ))::text as "1",
  __users_2."id"::text as "2",
  ("relay"."users_max_reading_distance"(
    __users_3,
    $2::"relay"."spectacles"
  ))::text as "3",
  __users_3."id"::text as "4",
  ("relay"."users_max_reading_distance"(
    __users_4,
    $3::"relay"."spectacles"
  ))::text as "5",
  __users_4."id"::text as "6"
from "relay"."users" as __users__
left outer join lateral (select (__users__).*) as __users_2
on TRUE
left outer join lateral (select (__users__).*) as __users_3
on TRUE
left outer join lateral (select (__users__).*) as __users_4
on TRUE
where (
  __users__."id" = $4::"int4"
);