select to_json(
  case when ((__local_0__."int8")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."int8")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."int8"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."int8"))
    ) end,
    'end',
    case when upper((__local_0__."int8")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."int8"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."int8"))
    ) end
  ) end
) as "int8"
from "ranges"."range_test" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)