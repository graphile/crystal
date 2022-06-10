with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'point'::text,
        (__local_1__."point"),
        'line'::text,
        (__local_1__."line"),
        'lseg'::text,
        (__local_1__."lseg"),
        'box'::text,
        (__local_1__."box"),
        'openPath'::text,
        (__local_1__."open_path"),
        'closedPath'::text,
        (__local_1__."closed_path"),
        'polygon'::text,
        (__local_1__."polygon"),
        'circle'::text,
        (__local_1__."circle")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "geometry"."geom" as __local_1__
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