SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "geometry"."geom" (
    "point",
    "line",
    "lseg",
    "box",
    "open_path",
    "closed_path",
    "polygon",
    "circle"
  ) values(
    point(
      $1,
      $2
    ),
    line(
      point(
        $3,
        $4
      ),
      point(
        $5,
        $6
      )
    ),
    lseg(
      point(
        $7,
        $8
      ),
      point(
        $9,
        $10
      )
    ),
    box(
      point(
        $11,
        $12
      ),
      point(
        $13,
        $14
      )
    ),
    $15,
    $16,
    $17,
    circle(
      point(
        $18,
        $19
      ),
      $20
    )
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"geometry"."geom"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'point'::text,
      (__local_0__."point"),
      'line'::text,
      (__local_0__."line"),
      'lseg'::text,
      (__local_0__."lseg"),
      'box'::text,
      (__local_0__."box"),
      'openPath'::text,
      (__local_0__."open_path"),
      'closedPath'::text,
      (__local_0__."closed_path"),
      'polygon'::text,
      (__local_0__."polygon"),
      'circle'::text,
      (__local_0__."circle")
    )
  )
) as "@geom"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation