select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."person_full_name")) as "name",
to_json(
  (
    select to_json(__local_1__) as "value"
    from "c"."person_first_name"(__local_0__) as __local_1__
    where (TRUE) and (TRUE)
  )
) as "@firstName",
to_json(
  (
    with __local_2__ as (
      select to_json(
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_3__."id"),
            'name'::text,
            (__local_3__."person_full_name"),
            '@firstName'::text,
            (
              select to_json(__local_4__) as "value"
              from "c"."person_first_name"(__local_3__) as __local_4__
              where (TRUE) and (TRUE)
            ),
            '@friends'::text,
            (
              with __local_5__ as (
                select to_json(
                  (
                    json_build_object(
                      '__identifiers'::text,
                      json_build_array(__local_6__."id"),
                      'name'::text,
                      (__local_6__."person_full_name"),
                      '@firstName'::text,
                      (
                        select to_json(__local_7__) as "value"
                        from "c"."person_first_name"(__local_6__) as __local_7__
                        where (TRUE) and (TRUE)
                      )
                    )
                  )
                ) as "@nodes"
                from "c"."person_friends"(__local_3__) as __local_6__
                where (TRUE) and (TRUE)
                limit 1
              ),
              __local_8__ as (
                select json_agg(
                  to_json(__local_5__)
                ) as data
                from __local_5__
              )
              select json_build_object(
                'data'::text,
                coalesce(
                  (
                    select __local_8__.data
                    from __local_8__
                  ),
                  '[]'::json
                )
              )
            )
          )
        )
      ) as "@nodes"
      from "c"."person_friends"(__local_0__) as __local_3__
      where (TRUE) and (TRUE)
    ),
    __local_9__ as (
      select json_agg(
        to_json(__local_2__)
      ) as data
      from __local_2__
    )
    select json_build_object(
      'data'::text,
      coalesce(
        (
          select __local_9__.data
          from __local_9__
        ),
        '[]'::json
      )
    )
  )
) as "@friends",
to_json((__local_0__."id")) as "id",
to_json(
  (
    with __local_10__ as (
      select to_json(
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_11__."id"),
            'headline'::text,
            (__local_11__."headline"),
            '@headlineTrimmed'::text,
            (
              select to_json(__local_12__) as "value"
              from "a"."post_headline_trimmed"(__local_11__) as __local_12__
              where (TRUE) and (TRUE)
            ),
            'authorId'::text,
            (__local_11__."author_id"),
            '@computedIntervalSet'::text,
            (
              with __local_13__ as (
                select to_json(
                  (__local_14__)::text
                ) as "value",
                to_json(
                  (
                    to_json(__local_14__)
                  )
                ) as "@nodes"
                from "a"."post_computed_interval_set"(__local_11__) as __local_14__
                where (TRUE) and (TRUE)
                limit 1
              ),
              __local_15__ as (
                select json_agg(
                  to_json(__local_13__)
                ) as data
                from __local_13__
              )
              select json_build_object(
                'data'::text,
                coalesce(
                  (
                    select __local_15__.data
                    from __local_15__
                  ),
                  '[]'::json
                )
              )
            ),
            '@computedIntervalSetList'::text,
            (
              select coalesce(
                (
                  select json_agg(__local_16__."object")
                  from (
                    select json_build_object(
                      'value'::text,
                      (__local_17__)::text
                    ) as object
                    from "a"."post_computed_interval_set"(__local_11__) as __local_17__
                    where (TRUE) and (TRUE)
                    limit 1
                  ) as __local_16__
                ),
                '[]'::json
              )
            )
          )
        )
      ) as "@nodes"
      from (
        with __local_18__ as (
          select __local_11__.*
          from "a"."post" as __local_11__
          where (__local_11__."author_id" = __local_0__."id") and (TRUE) and (TRUE)
          order by __local_11__."id" DESC
          limit 2
        )
        select *
        from __local_18__
        order by (
          row_number( ) over (partition by 1)
        ) desc
      ) __local_11__
    ),
    __local_19__ as (
      select json_agg(
        to_json(__local_10__)
      ) as data
      from __local_10__
    )
    select json_build_object(
      'data'::text,
      coalesce(
        (
          select __local_19__.data
          from __local_19__
        ),
        '[]'::json
      )
    )
  )
) as "@postsByAuthorId",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_20__."object")
        from (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_21__."id"),
            'headline'::text,
            (__local_21__."headline"),
            '@headlineTrimmed'::text,
            (
              select to_json(__local_22__) as "value"
              from "a"."post_headline_trimmed"(__local_21__) as __local_22__
              where (TRUE) and (TRUE)
            ),
            'authorId'::text,
            (__local_21__."author_id"),
            '@computedIntervalSet'::text,
            (
              with __local_23__ as (
                select to_json(
                  (__local_24__)::text
                ) as "value",
                to_json(
                  (
                    to_json(__local_24__)
                  )
                ) as "@nodes"
                from "a"."post_computed_interval_set"(__local_21__) as __local_24__
                where (TRUE) and (TRUE)
                limit 1
              ),
              __local_25__ as (
                select json_agg(
                  to_json(__local_23__)
                ) as data
                from __local_23__
              )
              select json_build_object(
                'data'::text,
                coalesce(
                  (
                    select __local_25__.data
                    from __local_25__
                  ),
                  '[]'::json
                )
              )
            ),
            '@computedIntervalSetList'::text,
            (
              select coalesce(
                (
                  select json_agg(__local_26__."object")
                  from (
                    select json_build_object(
                      'value'::text,
                      (__local_27__)::text
                    ) as object
                    from "a"."post_computed_interval_set"(__local_21__) as __local_27__
                    where (TRUE) and (TRUE)
                    limit 1
                  ) as __local_26__
                ),
                '[]'::json
              )
            )
          ) as object
          from (
            select __local_21__.*
            from "a"."post" as __local_21__
            where (__local_21__."author_id" = __local_0__."id") and (TRUE) and (TRUE)
            order by __local_21__."id" ASC
            limit 2
          ) __local_21__
        ) as __local_20__
      ),
      '[]'::json
    )
  )
) as "@postsByAuthorIdList",
to_json(
  (
    with __local_28__ as (
      select to_json(
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_29__."id"),
            'headline'::text,
            (__local_29__."headline"),
            '@headlineTrimmed'::text,
            (
              select to_json(__local_30__) as "value"
              from "a"."post_headline_trimmed"(__local_29__) as __local_30__
              where (TRUE) and (TRUE)
            ),
            'authorId'::text,
            (__local_29__."author_id"),
            '@computedIntervalSet'::text,
            (
              with __local_31__ as (
                select to_json(
                  (__local_32__)::text
                ) as "value",
                to_json(
                  (
                    to_json(__local_32__)
                  )
                ) as "@nodes"
                from "a"."post_computed_interval_set"(__local_29__) as __local_32__
                where (TRUE) and (TRUE)
                limit 1
              ),
              __local_33__ as (
                select json_agg(
                  to_json(__local_31__)
                ) as data
                from __local_31__
              )
              select json_build_object(
                'data'::text,
                coalesce(
                  (
                    select __local_33__.data
                    from __local_33__
                  ),
                  '[]'::json
                )
              )
            ),
            '@computedIntervalSetList'::text,
            (
              select coalesce(
                (
                  select json_agg(__local_34__."object")
                  from (
                    select json_build_object(
                      'value'::text,
                      (__local_35__)::text
                    ) as object
                    from "a"."post_computed_interval_set"(__local_29__) as __local_35__
                    where (TRUE) and (TRUE)
                    limit 1
                  ) as __local_34__
                ),
                '[]'::json
              )
            )
          )
        )
      ) as "@nodes"
      from (
        select __local_29__.*
        from "a"."post" as __local_29__
        where (__local_29__."author_id" = __local_0__."id")
        and (
          __local_29__."headline" = $1
        ) and (TRUE) and (TRUE)
        order by __local_29__."id" ASC
      ) __local_29__
    ),
    __local_36__ as (
      select json_agg(
        to_json(__local_28__)
      ) as data
      from __local_28__
    )
    select json_build_object(
      'data'::text,
      coalesce(
        (
          select __local_36__.data
          from __local_36__
        ),
        '[]'::json
      )
    )
  )
) as "@roundOnePost",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_37__."object")
        from (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_38__."id"),
            'headline'::text,
            (__local_38__."headline"),
            '@headlineTrimmed'::text,
            (
              select to_json(__local_39__) as "value"
              from "a"."post_headline_trimmed"(__local_38__) as __local_39__
              where (TRUE) and (TRUE)
            ),
            'authorId'::text,
            (__local_38__."author_id"),
            '@computedIntervalSet'::text,
            (
              with __local_40__ as (
                select to_json(
                  (__local_41__)::text
                ) as "value",
                to_json(
                  (
                    to_json(__local_41__)
                  )
                ) as "@nodes"
                from "a"."post_computed_interval_set"(__local_38__) as __local_41__
                where (TRUE) and (TRUE)
                limit 1
              ),
              __local_42__ as (
                select json_agg(
                  to_json(__local_40__)
                ) as data
                from __local_40__
              )
              select json_build_object(
                'data'::text,
                coalesce(
                  (
                    select __local_42__.data
                    from __local_42__
                  ),
                  '[]'::json
                )
              )
            ),
            '@computedIntervalSetList'::text,
            (
              select coalesce(
                (
                  select json_agg(__local_43__."object")
                  from (
                    select json_build_object(
                      'value'::text,
                      (__local_44__)::text
                    ) as object
                    from "a"."post_computed_interval_set"(__local_38__) as __local_44__
                    where (TRUE) and (TRUE)
                    limit 1
                  ) as __local_43__
                ),
                '[]'::json
              )
            )
          ) as object
          from (
            select __local_38__.*
            from "a"."post" as __local_38__
            where (__local_38__."author_id" = __local_0__."id")
            and (
              __local_38__."headline" = $2
            ) and (TRUE) and (TRUE)
            order by __local_38__."id" ASC
          ) __local_38__
        ) as __local_37__
      ),
      '[]'::json
    )
  )
) as "@roundOnePostList",
to_json(
  (
    with __local_45__ as (
      select to_json(
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(
              __local_46__."person_id_1",
              __local_46__."person_id_2"
            ),
            'personId1'::text,
            (__local_46__."person_id_1"),
            'personId2'::text,
            (__local_46__."person_id_2")
          )
        )
      ) as "@nodes"
      from (
        select __local_46__.*
        from "c"."compound_key" as __local_46__
        where (__local_46__."person_id_1" = __local_0__."id") and (TRUE) and (TRUE)
        order by __local_46__."person_id_1" ASC,
        __local_46__."person_id_2" ASC
      ) __local_46__
    ),
    __local_47__ as (
      select json_agg(
        to_json(__local_45__)
      ) as data
      from __local_45__
    )
    select json_build_object(
      'data'::text,
      coalesce(
        (
          select __local_47__.data
          from __local_47__
        ),
        '[]'::json
      )
    )
  )
) as "@compoundKeysByPersonId1",
to_json(
  (
    with __local_48__ as (
      select to_json(
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(
              __local_49__."person_id_1",
              __local_49__."person_id_2"
            ),
            'personId1'::text,
            (__local_49__."person_id_1"),
            'personId2'::text,
            (__local_49__."person_id_2")
          )
        )
      ) as "@nodes"
      from (
        select __local_49__.*
        from "c"."compound_key" as __local_49__
        where (__local_49__."person_id_2" = __local_0__."id") and (TRUE) and (TRUE)
        order by __local_49__."person_id_1" ASC,
        __local_49__."person_id_2" ASC
      ) __local_49__
    ),
    __local_50__ as (
      select json_agg(
        to_json(__local_48__)
      ) as data
      from __local_48__
    )
    select json_build_object(
      'data'::text,
      coalesce(
        (
          select __local_50__.data
          from __local_50__
        ),
        '[]'::json
      )
    )
  )
) as "@compoundKeysByPersonId2",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_51__."object")
        from (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(
              __local_52__."person_id_1",
              __local_52__."person_id_2"
            ),
            'personId1'::text,
            (__local_52__."person_id_1"),
            'personId2'::text,
            (__local_52__."person_id_2")
          ) as object
          from (
            select __local_52__.*
            from "c"."compound_key" as __local_52__
            where (__local_52__."person_id_1" = __local_0__."id") and (TRUE) and (TRUE)
            order by __local_52__."person_id_1" ASC,
            __local_52__."person_id_2" ASC
          ) __local_52__
        ) as __local_51__
      ),
      '[]'::json
    )
  )
) as "@compoundKeysByPersonId1List",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_53__."object")
        from (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(
              __local_54__."person_id_1",
              __local_54__."person_id_2"
            ),
            'personId1'::text,
            (__local_54__."person_id_1"),
            'personId2'::text,
            (__local_54__."person_id_2")
          ) as object
          from (
            select __local_54__.*
            from "c"."compound_key" as __local_54__
            where (__local_54__."person_id_2" = __local_0__."id") and (TRUE) and (TRUE)
            order by __local_54__."person_id_1" ASC,
            __local_54__."person_id_2" ASC
          ) __local_54__
        ) as __local_53__
      ),
      '[]'::json
    )
  )
) as "@compoundKeysByPersonId2List"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."id" ASC
) __local_0__

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'name'::text,
        (__local_1__."person_full_name"),
        '@postsByAuthorId'::text,
        (
          with __local_2__ as (
            select to_json(
              (
                json_build_object(
                  '__identifiers'::text,
                  json_build_array(__local_3__."id"),
                  'headline'::text,
                  (__local_3__."headline"),
                  '@headlineTrimmed'::text,
                  (
                    select to_json(__local_4__) as "value"
                    from "a"."post_headline_trimmed"(__local_3__) as __local_4__
                    where (TRUE) and (TRUE)
                  ),
                  'authorId'::text,
                  (__local_3__."author_id"),
                  '@computedIntervalSet'::text,
                  (
                    with __local_5__ as (
                      select to_json(
                        (__local_6__)::text
                      ) as "value",
                      to_json(
                        (
                          to_json(__local_6__)
                        )
                      ) as "@nodes"
                      from "a"."post_computed_interval_set"(__local_3__) as __local_6__
                      where (TRUE) and (TRUE)
                      limit 1
                    ),
                    __local_7__ as (
                      select json_agg(
                        to_json(__local_5__)
                      ) as data
                      from __local_5__
                    )
                    select json_build_object(
                      'data'::text,
                      coalesce(
                        (
                          select __local_7__.data
                          from __local_7__
                        ),
                        '[]'::json
                      )
                    )
                  ),
                  '@computedIntervalSetList'::text,
                  (
                    select coalesce(
                      (
                        select json_agg(__local_8__."object")
                        from (
                          select json_build_object(
                            'value'::text,
                            (__local_9__)::text
                          ) as object
                          from "a"."post_computed_interval_set"(__local_3__) as __local_9__
                          where (TRUE) and (TRUE)
                          limit 1
                        ) as __local_8__
                      ),
                      '[]'::json
                    )
                  )
                )
              )
            ) as "@nodes"
            from (
              with __local_10__ as (
                select __local_3__.*
                from "a"."post" as __local_3__
                where (__local_3__."author_id" = __local_1__."id") and (TRUE) and (TRUE)
                order by __local_3__."id" DESC
                limit 2
              )
              select *
              from __local_10__
              order by (
                row_number( ) over (partition by 1)
              ) desc
            ) __local_3__
          ),
          __local_11__ as (
            select json_agg(
              to_json(__local_2__)
            ) as data
            from __local_2__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_11__.data
                from __local_11__
              ),
              '[]'::json
            )
          )
        ),
        '@postsByAuthorIdList'::text,
        (
          select coalesce(
            (
              select json_agg(__local_12__."object")
              from (
                select json_build_object(
                  '__identifiers'::text,
                  json_build_array(__local_13__."id"),
                  'headline'::text,
                  (__local_13__."headline"),
                  '@headlineTrimmed'::text,
                  (
                    select to_json(__local_14__) as "value"
                    from "a"."post_headline_trimmed"(__local_13__) as __local_14__
                    where (TRUE) and (TRUE)
                  ),
                  'authorId'::text,
                  (__local_13__."author_id"),
                  '@computedIntervalSet'::text,
                  (
                    with __local_15__ as (
                      select to_json(
                        (__local_16__)::text
                      ) as "value",
                      to_json(
                        (
                          to_json(__local_16__)
                        )
                      ) as "@nodes"
                      from "a"."post_computed_interval_set"(__local_13__) as __local_16__
                      where (TRUE) and (TRUE)
                      limit 1
                    ),
                    __local_17__ as (
                      select json_agg(
                        to_json(__local_15__)
                      ) as data
                      from __local_15__
                    )
                    select json_build_object(
                      'data'::text,
                      coalesce(
                        (
                          select __local_17__.data
                          from __local_17__
                        ),
                        '[]'::json
                      )
                    )
                  ),
                  '@computedIntervalSetList'::text,
                  (
                    select coalesce(
                      (
                        select json_agg(__local_18__."object")
                        from (
                          select json_build_object(
                            'value'::text,
                            (__local_19__)::text
                          ) as object
                          from "a"."post_computed_interval_set"(__local_13__) as __local_19__
                          where (TRUE) and (TRUE)
                          limit 1
                        ) as __local_18__
                      ),
                      '[]'::json
                    )
                  )
                ) as object
                from (
                  select __local_13__.*
                  from "a"."post" as __local_13__
                  where (__local_13__."author_id" = __local_1__."id") and (TRUE) and (TRUE)
                  order by __local_13__."id" ASC
                  limit 2
                ) __local_13__
              ) as __local_12__
            ),
            '[]'::json
          )
        ),
        '@roundOnePost'::text,
        (
          with __local_20__ as (
            select to_json(
              (
                json_build_object(
                  '__identifiers'::text,
                  json_build_array(__local_21__."id"),
                  'headline'::text,
                  (__local_21__."headline"),
                  '@headlineTrimmed'::text,
                  (
                    select to_json(__local_22__) as "value"
                    from "a"."post_headline_trimmed"(__local_21__) as __local_22__
                    where (TRUE) and (TRUE)
                  ),
                  'authorId'::text,
                  (__local_21__."author_id"),
                  '@computedIntervalSet'::text,
                  (
                    with __local_23__ as (
                      select to_json(
                        (__local_24__)::text
                      ) as "value",
                      to_json(
                        (
                          to_json(__local_24__)
                        )
                      ) as "@nodes"
                      from "a"."post_computed_interval_set"(__local_21__) as __local_24__
                      where (TRUE) and (TRUE)
                      limit 1
                    ),
                    __local_25__ as (
                      select json_agg(
                        to_json(__local_23__)
                      ) as data
                      from __local_23__
                    )
                    select json_build_object(
                      'data'::text,
                      coalesce(
                        (
                          select __local_25__.data
                          from __local_25__
                        ),
                        '[]'::json
                      )
                    )
                  ),
                  '@computedIntervalSetList'::text,
                  (
                    select coalesce(
                      (
                        select json_agg(__local_26__."object")
                        from (
                          select json_build_object(
                            'value'::text,
                            (__local_27__)::text
                          ) as object
                          from "a"."post_computed_interval_set"(__local_21__) as __local_27__
                          where (TRUE) and (TRUE)
                          limit 1
                        ) as __local_26__
                      ),
                      '[]'::json
                    )
                  )
                )
              )
            ) as "@nodes"
            from (
              select __local_21__.*
              from "a"."post" as __local_21__
              where (__local_21__."author_id" = __local_1__."id")
              and (
                __local_21__."headline" = $1
              ) and (TRUE) and (TRUE)
              order by __local_21__."id" ASC
            ) __local_21__
          ),
          __local_28__ as (
            select json_agg(
              to_json(__local_20__)
            ) as data
            from __local_20__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_28__.data
                from __local_28__
              ),
              '[]'::json
            )
          )
        ),
        '@roundOnePostList'::text,
        (
          select coalesce(
            (
              select json_agg(__local_29__."object")
              from (
                select json_build_object(
                  '__identifiers'::text,
                  json_build_array(__local_30__."id"),
                  'headline'::text,
                  (__local_30__."headline"),
                  '@headlineTrimmed'::text,
                  (
                    select to_json(__local_31__) as "value"
                    from "a"."post_headline_trimmed"(__local_30__) as __local_31__
                    where (TRUE) and (TRUE)
                  ),
                  'authorId'::text,
                  (__local_30__."author_id"),
                  '@computedIntervalSet'::text,
                  (
                    with __local_32__ as (
                      select to_json(
                        (__local_33__)::text
                      ) as "value",
                      to_json(
                        (
                          to_json(__local_33__)
                        )
                      ) as "@nodes"
                      from "a"."post_computed_interval_set"(__local_30__) as __local_33__
                      where (TRUE) and (TRUE)
                      limit 1
                    ),
                    __local_34__ as (
                      select json_agg(
                        to_json(__local_32__)
                      ) as data
                      from __local_32__
                    )
                    select json_build_object(
                      'data'::text,
                      coalesce(
                        (
                          select __local_34__.data
                          from __local_34__
                        ),
                        '[]'::json
                      )
                    )
                  ),
                  '@computedIntervalSetList'::text,
                  (
                    select coalesce(
                      (
                        select json_agg(__local_35__."object")
                        from (
                          select json_build_object(
                            'value'::text,
                            (__local_36__)::text
                          ) as object
                          from "a"."post_computed_interval_set"(__local_30__) as __local_36__
                          where (TRUE) and (TRUE)
                          limit 1
                        ) as __local_35__
                      ),
                      '[]'::json
                    )
                  )
                ) as object
                from (
                  select __local_30__.*
                  from "a"."post" as __local_30__
                  where (__local_30__."author_id" = __local_1__."id")
                  and (
                    __local_30__."headline" = $2
                  ) and (TRUE) and (TRUE)
                  order by __local_30__."id" ASC
                ) __local_30__
              ) as __local_29__
            ),
            '[]'::json
          )
        ),
        '@compoundKeysByPersonId1'::text,
        (
          with __local_37__ as (
            select to_json(
              (
                json_build_object(
                  '__identifiers'::text,
                  json_build_array(
                    __local_38__."person_id_1",
                    __local_38__."person_id_2"
                  ),
                  'personId1'::text,
                  (__local_38__."person_id_1"),
                  'personId2'::text,
                  (__local_38__."person_id_2")
                )
              )
            ) as "@nodes"
            from (
              select __local_38__.*
              from "c"."compound_key" as __local_38__
              where (__local_38__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
              order by __local_38__."person_id_1" ASC,
              __local_38__."person_id_2" ASC
            ) __local_38__
          ),
          __local_39__ as (
            select json_agg(
              to_json(__local_37__)
            ) as data
            from __local_37__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_39__.data
                from __local_39__
              ),
              '[]'::json
            )
          )
        ),
        '@compoundKeysByPersonId2'::text,
        (
          with __local_40__ as (
            select to_json(
              (
                json_build_object(
                  '__identifiers'::text,
                  json_build_array(
                    __local_41__."person_id_1",
                    __local_41__."person_id_2"
                  ),
                  'personId1'::text,
                  (__local_41__."person_id_1"),
                  'personId2'::text,
                  (__local_41__."person_id_2")
                )
              )
            ) as "@nodes"
            from (
              select __local_41__.*
              from "c"."compound_key" as __local_41__
              where (__local_41__."person_id_2" = __local_1__."id") and (TRUE) and (TRUE)
              order by __local_41__."person_id_1" ASC,
              __local_41__."person_id_2" ASC
            ) __local_41__
          ),
          __local_42__ as (
            select json_agg(
              to_json(__local_40__)
            ) as data
            from __local_40__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_42__.data
                from __local_42__
              ),
              '[]'::json
            )
          )
        ),
        '@compoundKeysByPersonId1List'::text,
        (
          select coalesce(
            (
              select json_agg(__local_43__."object")
              from (
                select json_build_object(
                  '__identifiers'::text,
                  json_build_array(
                    __local_44__."person_id_1",
                    __local_44__."person_id_2"
                  ),
                  'personId1'::text,
                  (__local_44__."person_id_1"),
                  'personId2'::text,
                  (__local_44__."person_id_2")
                ) as object
                from (
                  select __local_44__.*
                  from "c"."compound_key" as __local_44__
                  where (__local_44__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
                  order by __local_44__."person_id_1" ASC,
                  __local_44__."person_id_2" ASC
                ) __local_44__
              ) as __local_43__
            ),
            '[]'::json
          )
        ),
        '@compoundKeysByPersonId2List'::text,
        (
          select coalesce(
            (
              select json_agg(__local_45__."object")
              from (
                select json_build_object(
                  '__identifiers'::text,
                  json_build_array(
                    __local_46__."person_id_1",
                    __local_46__."person_id_2"
                  ),
                  'personId1'::text,
                  (__local_46__."person_id_1"),
                  'personId2'::text,
                  (__local_46__."person_id_2")
                ) as object
                from (
                  select __local_46__.*
                  from "c"."compound_key" as __local_46__
                  where (__local_46__."person_id_2" = __local_1__."id") and (TRUE) and (TRUE)
                  order by __local_46__."person_id_1" ASC,
                  __local_46__."person_id_2" ASC
                ) __local_46__
              ) as __local_45__
            ),
            '[]'::json
          )
        )
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."person" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
  ) __local_1__
),
__local_47__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_47__.data
    from __local_47__
  ),
  '[]'::json
) as "data"