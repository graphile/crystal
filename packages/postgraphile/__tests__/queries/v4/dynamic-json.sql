select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."jsonb_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."jsonb_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'json'::text,
        (__local_1__."json"),
        'jsonb'::text,
        (__local_1__."jsonb")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "b"."types" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
  ) __local_1__
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data"