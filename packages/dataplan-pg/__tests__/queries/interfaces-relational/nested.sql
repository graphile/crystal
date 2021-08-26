select
  __people__."username"::text as "0",
  array(
    select array[
      __relational_items_6."type"::text,
      __relational_items_7."type"::text,
      __relational_items_8."type"::text,
      __relational_topics__."id"::text,
      __relational_items_9."type"::text,
      __relational_posts__."id"::text,
      __relational_items_10."type"::text,
      __relational_dividers__."id"::text,
      __relational_items_11."type"::text,
      __relational_checklists__."id"::text,
      __relational_items_12."type"::text,
      __relational_checklist_items__."id"::text,
      __relational_items_7."id"::text,
      __relational_items__."parent_id"::text,
      __relational_items__."type"::text,
      __relational_topics_2."id"::text,
      __relational_items_13."type"::text,
      __relational_items_14."type"::text,
      __relational_topics_3."id"::text,
      __relational_items_15."type"::text,
      __relational_posts_2."id"::text,
      __relational_items_16."type"::text,
      __relational_dividers_2."id"::text,
      __relational_items_17."type"::text,
      __relational_checklists_2."id"::text,
      __relational_items_18."type"::text,
      __relational_checklist_items_2."id"::text,
      __relational_items_13."id"::text,
      __relational_items_2."parent_id"::text,
      __relational_items_2."type"::text,
      __relational_posts_3."id"::text,
      __relational_items_19."type"::text,
      __relational_items_20."type"::text,
      __relational_topics_4."id"::text,
      __relational_items_21."type"::text,
      __relational_posts_4."id"::text,
      __relational_items_22."type"::text,
      __relational_dividers_3."id"::text,
      __relational_items_23."type"::text,
      __relational_checklists_3."id"::text,
      __relational_items_24."type"::text,
      __relational_checklist_items_3."id"::text,
      __relational_items_19."id"::text,
      __relational_items_3."parent_id"::text,
      __relational_items_3."type"::text,
      __relational_dividers_4."id"::text,
      __relational_items_25."type"::text,
      __relational_items_26."type"::text,
      __relational_topics_5."id"::text,
      __relational_items_27."type"::text,
      __relational_posts_5."id"::text,
      __relational_items_28."type"::text,
      __relational_dividers_5."id"::text,
      __relational_items_29."type"::text,
      __relational_checklists_4."id"::text,
      __relational_items_30."type"::text,
      __relational_checklist_items_4."id"::text,
      __relational_items_25."id"::text,
      __relational_items_4."parent_id"::text,
      __relational_items_4."type"::text,
      __relational_checklists_5."id"::text,
      __relational_items_31."type"::text,
      __relational_items_32."type"::text,
      __relational_topics_6."id"::text,
      __relational_items_33."type"::text,
      __relational_posts_6."id"::text,
      __relational_items_34."type"::text,
      __relational_dividers_6."id"::text,
      __relational_items_35."type"::text,
      __relational_checklists_6."id"::text,
      __relational_items_36."type"::text,
      __relational_checklist_items_5."id"::text,
      __relational_items_31."id"::text,
      __relational_items_5."parent_id"::text,
      __relational_items_5."type"::text,
      __relational_checklist_items_6."id"::text,
      __relational_items_6."id"::text
    ]::text[]
    from interfaces_and_unions.relational_items as __relational_items_6
    left outer join interfaces_and_unions.relational_topics as __relational_topics_2
    on (__relational_items_6."id"::"int4" = __relational_topics_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items__
    on (__relational_topics_2."id"::"int4" = __relational_items__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_7
    on (__relational_items__."parent_id"::"int4" = __relational_items_7."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics__
    on (__relational_items_7."id"::"int4" = __relational_topics__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_8
    on (__relational_topics__."id"::"int4" = __relational_items_8."id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts__
    on (__relational_items_7."id"::"int4" = __relational_posts__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_9
    on (__relational_posts__."id"::"int4" = __relational_items_9."id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
    on (__relational_items_7."id"::"int4" = __relational_dividers__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_10
    on (__relational_dividers__."id"::"int4" = __relational_items_10."id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
    on (__relational_items_7."id"::"int4" = __relational_checklists__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_11
    on (__relational_checklists__."id"::"int4" = __relational_items_11."id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
    on (__relational_items_7."id"::"int4" = __relational_checklist_items__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_12
    on (__relational_checklist_items__."id"::"int4" = __relational_items_12."id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_3
    on (__relational_items_6."id"::"int4" = __relational_posts_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_2
    on (__relational_posts_3."id"::"int4" = __relational_items_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_13
    on (__relational_items_2."parent_id"::"int4" = __relational_items_13."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics_3
    on (__relational_items_13."id"::"int4" = __relational_topics_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_14
    on (__relational_topics_3."id"::"int4" = __relational_items_14."id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_2
    on (__relational_items_13."id"::"int4" = __relational_posts_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_15
    on (__relational_posts_2."id"::"int4" = __relational_items_15."id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_2
    on (__relational_items_13."id"::"int4" = __relational_dividers_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_16
    on (__relational_dividers_2."id"::"int4" = __relational_items_16."id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_2
    on (__relational_items_13."id"::"int4" = __relational_checklists_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_17
    on (__relational_checklists_2."id"::"int4" = __relational_items_17."id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_2
    on (__relational_items_13."id"::"int4" = __relational_checklist_items_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_18
    on (__relational_checklist_items_2."id"::"int4" = __relational_items_18."id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_4
    on (__relational_items_6."id"::"int4" = __relational_dividers_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_3
    on (__relational_dividers_4."id"::"int4" = __relational_items_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_19
    on (__relational_items_3."parent_id"::"int4" = __relational_items_19."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics_4
    on (__relational_items_19."id"::"int4" = __relational_topics_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_20
    on (__relational_topics_4."id"::"int4" = __relational_items_20."id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_4
    on (__relational_items_19."id"::"int4" = __relational_posts_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_21
    on (__relational_posts_4."id"::"int4" = __relational_items_21."id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_3
    on (__relational_items_19."id"::"int4" = __relational_dividers_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_22
    on (__relational_dividers_3."id"::"int4" = __relational_items_22."id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_3
    on (__relational_items_19."id"::"int4" = __relational_checklists_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_23
    on (__relational_checklists_3."id"::"int4" = __relational_items_23."id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_3
    on (__relational_items_19."id"::"int4" = __relational_checklist_items_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_24
    on (__relational_checklist_items_3."id"::"int4" = __relational_items_24."id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_5
    on (__relational_items_6."id"::"int4" = __relational_checklists_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_4
    on (__relational_checklists_5."id"::"int4" = __relational_items_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_25
    on (__relational_items_4."parent_id"::"int4" = __relational_items_25."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics_5
    on (__relational_items_25."id"::"int4" = __relational_topics_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_26
    on (__relational_topics_5."id"::"int4" = __relational_items_26."id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_5
    on (__relational_items_25."id"::"int4" = __relational_posts_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_27
    on (__relational_posts_5."id"::"int4" = __relational_items_27."id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_5
    on (__relational_items_25."id"::"int4" = __relational_dividers_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_28
    on (__relational_dividers_5."id"::"int4" = __relational_items_28."id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_4
    on (__relational_items_25."id"::"int4" = __relational_checklists_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_29
    on (__relational_checklists_4."id"::"int4" = __relational_items_29."id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_4
    on (__relational_items_25."id"::"int4" = __relational_checklist_items_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_30
    on (__relational_checklist_items_4."id"::"int4" = __relational_items_30."id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_6
    on (__relational_items_6."id"::"int4" = __relational_checklist_items_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_5
    on (__relational_checklist_items_6."id"::"int4" = __relational_items_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_31
    on (__relational_items_5."parent_id"::"int4" = __relational_items_31."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics_6
    on (__relational_items_31."id"::"int4" = __relational_topics_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_32
    on (__relational_topics_6."id"::"int4" = __relational_items_32."id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_6
    on (__relational_items_31."id"::"int4" = __relational_posts_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_33
    on (__relational_posts_6."id"::"int4" = __relational_items_33."id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_6
    on (__relational_items_31."id"::"int4" = __relational_dividers_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_34
    on (__relational_dividers_6."id"::"int4" = __relational_items_34."id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_6
    on (__relational_items_31."id"::"int4" = __relational_checklists_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_35
    on (__relational_checklists_6."id"::"int4" = __relational_items_35."id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_5
    on (__relational_items_31."id"::"int4" = __relational_checklist_items_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_36
    on (__relational_checklist_items_5."id"::"int4" = __relational_items_36."id")
    where
      (
        __people__."person_id"::"int4" = __relational_items_6."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items_6."id" asc
  ) as "1",
  __people__."person_id"::text as "2"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc