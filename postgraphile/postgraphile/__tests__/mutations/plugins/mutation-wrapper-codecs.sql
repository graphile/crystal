begin; /*fake*/

insert into "mutation_wrapper_codecs"."codec_values" as __codec_values__ ("id", "enabled") values ($1::"int4", $2::"bool") returning
  __codec_values__."enabled"::text as "0",
  __codec_values__."json"::text as "1",
  __codec_values__."jsonb"::text as "2",
  to_char(__codec_values__."duration", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "3",
  to_char(__codec_values__."date", 'YYYY-MM-DD'::text) as "4",
  __codec_values__."tags"::text as "5",
  __codec_values__."nullable_json"::text as "6";

commit; /*fake*/

begin; /*fake*/

update "mutation_wrapper_codecs"."codec_values" as __codec_values__ set "enabled" = $1::"bool" where (__codec_values__."id" = $2::"int4") returning
  __codec_values__."enabled"::text as "0",
  __codec_values__."json"::text as "1",
  __codec_values__."jsonb"::text as "2",
  to_char(__codec_values__."duration", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "3",
  to_char(__codec_values__."date", 'YYYY-MM-DD'::text) as "4",
  __codec_values__."tags"::text as "5",
  __codec_values__."nullable_json"::text as "6";

commit; /*fake*/

begin; /*fake*/

update "mutation_wrapper_codecs"."codec_values" as __codec_values__ set "enabled" = $1::"bool" where (__codec_values__."id" = $2::"int4") returning
  __codec_values__."enabled"::text as "0",
  __codec_values__."json"::text as "1",
  __codec_values__."jsonb"::text as "2",
  to_char(__codec_values__."duration", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "3",
  to_char(__codec_values__."date", 'YYYY-MM-DD'::text) as "4",
  __codec_values__."tags"::text as "5",
  __codec_values__."nullable_json"::text as "6";

commit; /*fake*/

begin; /*fake*/

delete from "mutation_wrapper_codecs"."codec_values" as __codec_values__ where (__codec_values__."id" = $1::"int4") returning
  __codec_values__."enabled"::text as "0",
  __codec_values__."json"::text as "1",
  __codec_values__."jsonb"::text as "2",
  to_char(__codec_values__."duration", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "3",
  to_char(__codec_values__."date", 'YYYY-MM-DD'::text) as "4",
  __codec_values__."tags"::text as "5",
  __codec_values__."nullable_json"::text as "6";

commit; /*fake*/