select to_json(
  case when ((__local_0__."num")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."num")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."num"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."num"))
    ) end,
    'end',
    case when upper((__local_0__."num")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."num"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."num"))
    ) end
  ) end
) as "num"
from "ranges"."range_test" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)