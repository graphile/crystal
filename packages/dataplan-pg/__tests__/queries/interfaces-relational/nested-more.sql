select
  __people__."username"::text as "0",
  array(
    select array[
      __relational_items_31."type"::text,
      __relational_items_32."type"::text,
      __relational_items_2."type"::text,
      __people_2."username"::text,
      __relational_items_2."author_id"::text,
      __relational_items_2."position"::text,
      __relational_items_2."created_at"::text,
      __relational_items_2."updated_at"::text,
      __relational_items_2."is_explicitly_archived"::text,
      __relational_items_2."archived_at"::text,
      __relational_topics__."id"::text,
      __relational_items_3."type"::text,
      __people_3."username"::text,
      __relational_items_3."author_id"::text,
      __relational_items_3."position"::text,
      __relational_items_3."created_at"::text,
      __relational_items_3."updated_at"::text,
      __relational_items_3."is_explicitly_archived"::text,
      __relational_items_3."archived_at"::text,
      __relational_posts__."id"::text,
      __relational_items_4."type"::text,
      __people_4."username"::text,
      __relational_items_4."author_id"::text,
      __relational_items_4."position"::text,
      __relational_items_4."created_at"::text,
      __relational_items_4."updated_at"::text,
      __relational_items_4."is_explicitly_archived"::text,
      __relational_items_4."archived_at"::text,
      __relational_dividers__."id"::text,
      __relational_items_5."type"::text,
      __people_5."username"::text,
      __relational_items_5."author_id"::text,
      __relational_items_5."position"::text,
      __relational_items_5."created_at"::text,
      __relational_items_5."updated_at"::text,
      __relational_items_5."is_explicitly_archived"::text,
      __relational_items_5."archived_at"::text,
      __relational_checklists__."id"::text,
      __relational_items_6."type"::text,
      __people_6."username"::text,
      __relational_items_6."author_id"::text,
      __relational_items_6."position"::text,
      __relational_items_6."created_at"::text,
      __relational_items_6."updated_at"::text,
      __relational_items_6."is_explicitly_archived"::text,
      __relational_items_6."archived_at"::text,
      __relational_checklist_items__."id"::text,
      __relational_items_32."id"::text,
      __relational_items__."parent_id"::text,
      __relational_items__."type"::text,
      __people_7."username"::text,
      __relational_items__."author_id"::text,
      __relational_items__."position"::text,
      __relational_items__."created_at"::text,
      __relational_items__."updated_at"::text,
      __relational_items__."is_explicitly_archived"::text,
      __relational_items__."archived_at"::text,
      __relational_topics_2."id"::text,
      __relational_items_33."type"::text,
      __relational_items_8."type"::text,
      __people_8."username"::text,
      __relational_items_8."author_id"::text,
      __relational_items_8."position"::text,
      __relational_items_8."created_at"::text,
      __relational_items_8."updated_at"::text,
      __relational_items_8."is_explicitly_archived"::text,
      __relational_items_8."archived_at"::text,
      __relational_topics_3."id"::text,
      __relational_items_9."type"::text,
      __people_9."username"::text,
      __relational_items_9."author_id"::text,
      __relational_items_9."position"::text,
      __relational_items_9."created_at"::text,
      __relational_items_9."updated_at"::text,
      __relational_items_9."is_explicitly_archived"::text,
      __relational_items_9."archived_at"::text,
      __relational_posts_2."id"::text,
      __relational_items_10."type"::text,
      __people_10."username"::text,
      __relational_items_10."author_id"::text,
      __relational_items_10."position"::text,
      __relational_items_10."created_at"::text,
      __relational_items_10."updated_at"::text,
      __relational_items_10."is_explicitly_archived"::text,
      __relational_items_10."archived_at"::text,
      __relational_dividers_2."id"::text,
      __relational_items_11."type"::text,
      __people_11."username"::text,
      __relational_items_11."author_id"::text,
      __relational_items_11."position"::text,
      __relational_items_11."created_at"::text,
      __relational_items_11."updated_at"::text,
      __relational_items_11."is_explicitly_archived"::text,
      __relational_items_11."archived_at"::text,
      __relational_checklists_2."id"::text,
      __relational_items_12."type"::text,
      __people_12."username"::text,
      __relational_items_12."author_id"::text,
      __relational_items_12."position"::text,
      __relational_items_12."created_at"::text,
      __relational_items_12."updated_at"::text,
      __relational_items_12."is_explicitly_archived"::text,
      __relational_items_12."archived_at"::text,
      __relational_checklist_items_2."id"::text,
      __relational_items_33."id"::text,
      __relational_items_7."parent_id"::text,
      __relational_items_7."type"::text,
      __people_13."username"::text,
      __relational_items_7."author_id"::text,
      __relational_items_7."position"::text,
      __relational_items_7."created_at"::text,
      __relational_items_7."updated_at"::text,
      __relational_items_7."is_explicitly_archived"::text,
      __relational_items_7."archived_at"::text,
      __relational_posts_3."id"::text,
      __relational_items_34."type"::text,
      __relational_items_14."type"::text,
      __people_14."username"::text,
      __relational_items_14."author_id"::text,
      __relational_items_14."position"::text,
      __relational_items_14."created_at"::text,
      __relational_items_14."updated_at"::text,
      __relational_items_14."is_explicitly_archived"::text,
      __relational_items_14."archived_at"::text,
      __relational_topics_4."id"::text,
      __relational_items_15."type"::text,
      __people_15."username"::text,
      __relational_items_15."author_id"::text,
      __relational_items_15."position"::text,
      __relational_items_15."created_at"::text,
      __relational_items_15."updated_at"::text,
      __relational_items_15."is_explicitly_archived"::text,
      __relational_items_15."archived_at"::text,
      __relational_posts_4."id"::text,
      __relational_items_16."type"::text,
      __people_16."username"::text,
      __relational_items_16."author_id"::text,
      __relational_items_16."position"::text,
      __relational_items_16."created_at"::text,
      __relational_items_16."updated_at"::text,
      __relational_items_16."is_explicitly_archived"::text,
      __relational_items_16."archived_at"::text,
      __relational_dividers_3."id"::text,
      __relational_items_17."type"::text,
      __people_17."username"::text,
      __relational_items_17."author_id"::text,
      __relational_items_17."position"::text,
      __relational_items_17."created_at"::text,
      __relational_items_17."updated_at"::text,
      __relational_items_17."is_explicitly_archived"::text,
      __relational_items_17."archived_at"::text,
      __relational_checklists_3."id"::text,
      __relational_items_18."type"::text,
      __people_18."username"::text,
      __relational_items_18."author_id"::text,
      __relational_items_18."position"::text,
      __relational_items_18."created_at"::text,
      __relational_items_18."updated_at"::text,
      __relational_items_18."is_explicitly_archived"::text,
      __relational_items_18."archived_at"::text,
      __relational_checklist_items_3."id"::text,
      __relational_items_34."id"::text,
      __relational_items_13."parent_id"::text,
      __relational_items_13."type"::text,
      __people_19."username"::text,
      __relational_items_13."author_id"::text,
      __relational_items_13."position"::text,
      __relational_items_13."created_at"::text,
      __relational_items_13."updated_at"::text,
      __relational_items_13."is_explicitly_archived"::text,
      __relational_items_13."archived_at"::text,
      __relational_dividers_4."id"::text,
      __relational_items_35."type"::text,
      __relational_items_20."type"::text,
      __people_20."username"::text,
      __relational_items_20."author_id"::text,
      __relational_items_20."position"::text,
      __relational_items_20."created_at"::text,
      __relational_items_20."updated_at"::text,
      __relational_items_20."is_explicitly_archived"::text,
      __relational_items_20."archived_at"::text,
      __relational_topics_5."id"::text,
      __relational_items_21."type"::text,
      __people_21."username"::text,
      __relational_items_21."author_id"::text,
      __relational_items_21."position"::text,
      __relational_items_21."created_at"::text,
      __relational_items_21."updated_at"::text,
      __relational_items_21."is_explicitly_archived"::text,
      __relational_items_21."archived_at"::text,
      __relational_posts_5."id"::text,
      __relational_items_22."type"::text,
      __people_22."username"::text,
      __relational_items_22."author_id"::text,
      __relational_items_22."position"::text,
      __relational_items_22."created_at"::text,
      __relational_items_22."updated_at"::text,
      __relational_items_22."is_explicitly_archived"::text,
      __relational_items_22."archived_at"::text,
      __relational_dividers_5."id"::text,
      __relational_items_23."type"::text,
      __people_23."username"::text,
      __relational_items_23."author_id"::text,
      __relational_items_23."position"::text,
      __relational_items_23."created_at"::text,
      __relational_items_23."updated_at"::text,
      __relational_items_23."is_explicitly_archived"::text,
      __relational_items_23."archived_at"::text,
      __relational_checklists_4."id"::text,
      __relational_items_24."type"::text,
      __people_24."username"::text,
      __relational_items_24."author_id"::text,
      __relational_items_24."position"::text,
      __relational_items_24."created_at"::text,
      __relational_items_24."updated_at"::text,
      __relational_items_24."is_explicitly_archived"::text,
      __relational_items_24."archived_at"::text,
      __relational_checklist_items_4."id"::text,
      __relational_items_35."id"::text,
      __relational_items_19."parent_id"::text,
      __relational_items_19."type"::text,
      __people_25."username"::text,
      __relational_items_19."author_id"::text,
      __relational_items_19."position"::text,
      __relational_items_19."created_at"::text,
      __relational_items_19."updated_at"::text,
      __relational_items_19."is_explicitly_archived"::text,
      __relational_items_19."archived_at"::text,
      __relational_checklists_5."id"::text,
      __relational_items_36."type"::text,
      __relational_items_26."type"::text,
      __people_26."username"::text,
      __relational_items_26."author_id"::text,
      __relational_items_26."position"::text,
      __relational_items_26."created_at"::text,
      __relational_items_26."updated_at"::text,
      __relational_items_26."is_explicitly_archived"::text,
      __relational_items_26."archived_at"::text,
      __relational_topics_6."id"::text,
      __relational_items_27."type"::text,
      __people_27."username"::text,
      __relational_items_27."author_id"::text,
      __relational_items_27."position"::text,
      __relational_items_27."created_at"::text,
      __relational_items_27."updated_at"::text,
      __relational_items_27."is_explicitly_archived"::text,
      __relational_items_27."archived_at"::text,
      __relational_posts_6."id"::text,
      __relational_items_28."type"::text,
      __people_28."username"::text,
      __relational_items_28."author_id"::text,
      __relational_items_28."position"::text,
      __relational_items_28."created_at"::text,
      __relational_items_28."updated_at"::text,
      __relational_items_28."is_explicitly_archived"::text,
      __relational_items_28."archived_at"::text,
      __relational_dividers_6."id"::text,
      __relational_items_29."type"::text,
      __people_29."username"::text,
      __relational_items_29."author_id"::text,
      __relational_items_29."position"::text,
      __relational_items_29."created_at"::text,
      __relational_items_29."updated_at"::text,
      __relational_items_29."is_explicitly_archived"::text,
      __relational_items_29."archived_at"::text,
      __relational_checklists_6."id"::text,
      __relational_items_30."type"::text,
      __people_30."username"::text,
      __relational_items_30."author_id"::text,
      __relational_items_30."position"::text,
      __relational_items_30."created_at"::text,
      __relational_items_30."updated_at"::text,
      __relational_items_30."is_explicitly_archived"::text,
      __relational_items_30."archived_at"::text,
      __relational_checklist_items_5."id"::text,
      __relational_items_36."id"::text,
      __relational_items_25."parent_id"::text,
      __relational_items_25."type"::text,
      __people_31."username"::text,
      __relational_items_25."author_id"::text,
      __relational_items_25."position"::text,
      __relational_items_25."created_at"::text,
      __relational_items_25."updated_at"::text,
      __relational_items_25."is_explicitly_archived"::text,
      __relational_items_25."archived_at"::text,
      __relational_checklist_items_6."id"::text,
      __relational_items_31."id"::text
    ]::text[]
    from interfaces_and_unions.relational_items as __relational_items_31
    left outer join interfaces_and_unions.relational_topics as __relational_topics_2
    on (__relational_items_31."id"::"int4" = __relational_topics_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items__
    on (__relational_topics_2."id"::"int4" = __relational_items__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_32
    on (__relational_items__."parent_id"::"int4" = __relational_items_32."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics__
    on (__relational_items_32."id"::"int4" = __relational_topics__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_2
    on (__relational_topics__."id"::"int4" = __relational_items_2."id")
    left outer join interfaces_and_unions.people as __people_2
    on (__relational_items_2."author_id"::"int4" = __people_2."person_id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts__
    on (__relational_items_32."id"::"int4" = __relational_posts__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_3
    on (__relational_posts__."id"::"int4" = __relational_items_3."id")
    left outer join interfaces_and_unions.people as __people_3
    on (__relational_items_3."author_id"::"int4" = __people_3."person_id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
    on (__relational_items_32."id"::"int4" = __relational_dividers__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_4
    on (__relational_dividers__."id"::"int4" = __relational_items_4."id")
    left outer join interfaces_and_unions.people as __people_4
    on (__relational_items_4."author_id"::"int4" = __people_4."person_id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
    on (__relational_items_32."id"::"int4" = __relational_checklists__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_5
    on (__relational_checklists__."id"::"int4" = __relational_items_5."id")
    left outer join interfaces_and_unions.people as __people_5
    on (__relational_items_5."author_id"::"int4" = __people_5."person_id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
    on (__relational_items_32."id"::"int4" = __relational_checklist_items__."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_6
    on (__relational_checklist_items__."id"::"int4" = __relational_items_6."id")
    left outer join interfaces_and_unions.people as __people_6
    on (__relational_items_6."author_id"::"int4" = __people_6."person_id")
    left outer join interfaces_and_unions.people as __people_7
    on (__relational_items__."author_id"::"int4" = __people_7."person_id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_3
    on (__relational_items_31."id"::"int4" = __relational_posts_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_7
    on (__relational_posts_3."id"::"int4" = __relational_items_7."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_33
    on (__relational_items_7."parent_id"::"int4" = __relational_items_33."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics_3
    on (__relational_items_33."id"::"int4" = __relational_topics_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_8
    on (__relational_topics_3."id"::"int4" = __relational_items_8."id")
    left outer join interfaces_and_unions.people as __people_8
    on (__relational_items_8."author_id"::"int4" = __people_8."person_id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_2
    on (__relational_items_33."id"::"int4" = __relational_posts_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_9
    on (__relational_posts_2."id"::"int4" = __relational_items_9."id")
    left outer join interfaces_and_unions.people as __people_9
    on (__relational_items_9."author_id"::"int4" = __people_9."person_id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_2
    on (__relational_items_33."id"::"int4" = __relational_dividers_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_10
    on (__relational_dividers_2."id"::"int4" = __relational_items_10."id")
    left outer join interfaces_and_unions.people as __people_10
    on (__relational_items_10."author_id"::"int4" = __people_10."person_id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_2
    on (__relational_items_33."id"::"int4" = __relational_checklists_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_11
    on (__relational_checklists_2."id"::"int4" = __relational_items_11."id")
    left outer join interfaces_and_unions.people as __people_11
    on (__relational_items_11."author_id"::"int4" = __people_11."person_id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_2
    on (__relational_items_33."id"::"int4" = __relational_checklist_items_2."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_12
    on (__relational_checklist_items_2."id"::"int4" = __relational_items_12."id")
    left outer join interfaces_and_unions.people as __people_12
    on (__relational_items_12."author_id"::"int4" = __people_12."person_id")
    left outer join interfaces_and_unions.people as __people_13
    on (__relational_items_7."author_id"::"int4" = __people_13."person_id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_4
    on (__relational_items_31."id"::"int4" = __relational_dividers_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_13
    on (__relational_dividers_4."id"::"int4" = __relational_items_13."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_34
    on (__relational_items_13."parent_id"::"int4" = __relational_items_34."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics_4
    on (__relational_items_34."id"::"int4" = __relational_topics_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_14
    on (__relational_topics_4."id"::"int4" = __relational_items_14."id")
    left outer join interfaces_and_unions.people as __people_14
    on (__relational_items_14."author_id"::"int4" = __people_14."person_id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_4
    on (__relational_items_34."id"::"int4" = __relational_posts_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_15
    on (__relational_posts_4."id"::"int4" = __relational_items_15."id")
    left outer join interfaces_and_unions.people as __people_15
    on (__relational_items_15."author_id"::"int4" = __people_15."person_id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_3
    on (__relational_items_34."id"::"int4" = __relational_dividers_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_16
    on (__relational_dividers_3."id"::"int4" = __relational_items_16."id")
    left outer join interfaces_and_unions.people as __people_16
    on (__relational_items_16."author_id"::"int4" = __people_16."person_id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_3
    on (__relational_items_34."id"::"int4" = __relational_checklists_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_17
    on (__relational_checklists_3."id"::"int4" = __relational_items_17."id")
    left outer join interfaces_and_unions.people as __people_17
    on (__relational_items_17."author_id"::"int4" = __people_17."person_id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_3
    on (__relational_items_34."id"::"int4" = __relational_checklist_items_3."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_18
    on (__relational_checklist_items_3."id"::"int4" = __relational_items_18."id")
    left outer join interfaces_and_unions.people as __people_18
    on (__relational_items_18."author_id"::"int4" = __people_18."person_id")
    left outer join interfaces_and_unions.people as __people_19
    on (__relational_items_13."author_id"::"int4" = __people_19."person_id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_5
    on (__relational_items_31."id"::"int4" = __relational_checklists_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_19
    on (__relational_checklists_5."id"::"int4" = __relational_items_19."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_35
    on (__relational_items_19."parent_id"::"int4" = __relational_items_35."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics_5
    on (__relational_items_35."id"::"int4" = __relational_topics_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_20
    on (__relational_topics_5."id"::"int4" = __relational_items_20."id")
    left outer join interfaces_and_unions.people as __people_20
    on (__relational_items_20."author_id"::"int4" = __people_20."person_id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_5
    on (__relational_items_35."id"::"int4" = __relational_posts_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_21
    on (__relational_posts_5."id"::"int4" = __relational_items_21."id")
    left outer join interfaces_and_unions.people as __people_21
    on (__relational_items_21."author_id"::"int4" = __people_21."person_id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_5
    on (__relational_items_35."id"::"int4" = __relational_dividers_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_22
    on (__relational_dividers_5."id"::"int4" = __relational_items_22."id")
    left outer join interfaces_and_unions.people as __people_22
    on (__relational_items_22."author_id"::"int4" = __people_22."person_id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_4
    on (__relational_items_35."id"::"int4" = __relational_checklists_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_23
    on (__relational_checklists_4."id"::"int4" = __relational_items_23."id")
    left outer join interfaces_and_unions.people as __people_23
    on (__relational_items_23."author_id"::"int4" = __people_23."person_id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_4
    on (__relational_items_35."id"::"int4" = __relational_checklist_items_4."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_24
    on (__relational_checklist_items_4."id"::"int4" = __relational_items_24."id")
    left outer join interfaces_and_unions.people as __people_24
    on (__relational_items_24."author_id"::"int4" = __people_24."person_id")
    left outer join interfaces_and_unions.people as __people_25
    on (__relational_items_19."author_id"::"int4" = __people_25."person_id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_6
    on (__relational_items_31."id"::"int4" = __relational_checklist_items_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_25
    on (__relational_checklist_items_6."id"::"int4" = __relational_items_25."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_36
    on (__relational_items_25."parent_id"::"int4" = __relational_items_36."id")
    left outer join interfaces_and_unions.relational_topics as __relational_topics_6
    on (__relational_items_36."id"::"int4" = __relational_topics_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_26
    on (__relational_topics_6."id"::"int4" = __relational_items_26."id")
    left outer join interfaces_and_unions.people as __people_26
    on (__relational_items_26."author_id"::"int4" = __people_26."person_id")
    left outer join interfaces_and_unions.relational_posts as __relational_posts_6
    on (__relational_items_36."id"::"int4" = __relational_posts_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_27
    on (__relational_posts_6."id"::"int4" = __relational_items_27."id")
    left outer join interfaces_and_unions.people as __people_27
    on (__relational_items_27."author_id"::"int4" = __people_27."person_id")
    left outer join interfaces_and_unions.relational_dividers as __relational_dividers_6
    on (__relational_items_36."id"::"int4" = __relational_dividers_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_28
    on (__relational_dividers_6."id"::"int4" = __relational_items_28."id")
    left outer join interfaces_and_unions.people as __people_28
    on (__relational_items_28."author_id"::"int4" = __people_28."person_id")
    left outer join interfaces_and_unions.relational_checklists as __relational_checklists_6
    on (__relational_items_36."id"::"int4" = __relational_checklists_6."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_29
    on (__relational_checklists_6."id"::"int4" = __relational_items_29."id")
    left outer join interfaces_and_unions.people as __people_29
    on (__relational_items_29."author_id"::"int4" = __people_29."person_id")
    left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_5
    on (__relational_items_36."id"::"int4" = __relational_checklist_items_5."id")
    left outer join interfaces_and_unions.relational_items as __relational_items_30
    on (__relational_checklist_items_5."id"::"int4" = __relational_items_30."id")
    left outer join interfaces_and_unions.people as __people_30
    on (__relational_items_30."author_id"::"int4" = __people_30."person_id")
    left outer join interfaces_and_unions.people as __people_31
    on (__relational_items_25."author_id"::"int4" = __people_31."person_id")
    where
      (
        __people__."person_id"::"int4" = __relational_items_31."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items_31."id" asc
  ) as "1",
  __people__."person_id"::text as "2"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc