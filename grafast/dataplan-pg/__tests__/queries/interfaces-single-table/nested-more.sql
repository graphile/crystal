select
  __people_3."username" as "0",
  array(
    select array[
      __single_table_items_2."type"::text,
      __single_table_items_2."parent_id"::text,
      __single_table_items_2."id"::text,
      __single_table_items_2."type2"::text,
      __single_table_items_2."position"::text,
      to_char(__single_table_items_2."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      to_char(__single_table_items_2."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      __single_table_items_2."is_explicitly_archived"::text,
      to_char(__single_table_items_2."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      __single_table_items__."type"::text,
      __single_table_items__."type2"::text,
      __single_table_items__."position"::text,
      to_char(__single_table_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      to_char(__single_table_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      __single_table_items__."is_explicitly_archived"::text,
      to_char(__single_table_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      __people__."username",
      __people_2."username"
    ]::text[]
    from interfaces_and_unions.single_table_items as __single_table_items_2
    left outer join interfaces_and_unions.single_table_items as __single_table_items__
    on (
    /* WHERE becoming ON */
      (
        __single_table_items__."id" = __single_table_items_2."parent_id"
      ) and (
        true /* authorization checks */
      )
    )
    left outer join interfaces_and_unions.people as __people__
    on (
    /* WHERE becoming ON */
      (
        __people__."person_id" = __single_table_items__."author_id"
      ) and (
        true /* authorization checks */
      )
    )
    left outer join interfaces_and_unions.people as __people_2
    on (
    /* WHERE becoming ON */
      (
        __people_2."person_id" = __single_table_items_2."author_id"
      ) and (
        true /* authorization checks */
      )
    )
    where
      (
        __single_table_items_2."author_id" = __people_3."person_id"
      ) and (
        true /* authorization checks */
      )
    order by __single_table_items_2."id" asc
  )::text as "1"
from interfaces_and_unions.people as __people_3
where (
  true /* authorization checks */
)
order by __people_3."person_id" asc;
