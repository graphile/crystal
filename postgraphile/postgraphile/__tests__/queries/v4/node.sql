select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1"
from "c"."compound_key" as __compound_key__
where
  (
    __compound_key__."person_id_1" = $1::"int4"
  ) and (
    __compound_key__."person_id_2" = $2::"int4"
  );

select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1"
from "c"."compound_key" as __compound_key__
where
  (
    __compound_key__."person_id_1" = $1::"int4"
  ) and (
    __compound_key__."person_id_2" = $2::"int4"
  );

select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1"
from "c"."compound_key" as __compound_key__
where
  (
    __compound_key__."person_id_1" = $1::"int4"
  ) and (
    __compound_key__."person_id_2" = $2::"int4"
  );

select
  __similar_table_1__."id"::text as "0",
  __similar_table_1__."col1"::text as "1",
  __similar_table_1__."col2"::text as "2",
  __similar_table_1__."col3"::text as "3"
from "a"."similar_table_1" as __similar_table_1__
where (
  __similar_table_1__."id" = $1::"int4"
);

select
  __similar_table_2__."id"::text as "0",
  __similar_table_2__."col3"::text as "1",
  __similar_table_2__."col4"::text as "2",
  __similar_table_2__."col5"::text as "3"
from "a"."similar_table_2" as __similar_table_2__
where (
  __similar_table_2__."id" = $1::"int4"
);

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
order by __person__."id" asc;

select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1"
from "c"."compound_key" as __compound_key__
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;