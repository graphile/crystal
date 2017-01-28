-- An example of polymorphic row matcher. Accepts matching criteria as a json object.
-- Example of matching criteria, taking `forum_example.person` as the starting table:
--
-- {
--   "first_name": "íllérmø",  -- will also find "Guillermo"
--   "post:author_id:rev": {    -- <related table>:<fk name>[:rev] (rev, for reverse, is included when the key is in the related table)
--     "headline": "first post",
--     "comment:post_id:rev": {
--       "body": "awesome"
--     }
--   }
-- }
--
-- When a relation is traversed, the original record is included in the foundset if ANY of the N records
-- matches the criterion.
--
-- Another example, with `forum_example.post` as the starting table:
--
-- {
--   "headline": "first post",
--   "post:author_id": {
--     "first_name": "Guillermo"
--   }
-- }

CREATE OR REPLACE FUNCTION forum_example.row_match(in_row json, criteria jsonb) RETURNS boolean AS $$
DECLARE
  found int = 0;
  attr text;
  is_match boolean;
  colon_pos int;
  colon_pos2 int;
  related_table text;
  related_fk text;
  related_criteria jsonb;
  related_query text;
  related_row record;
  related_count int;
BEGIN
  RAISE NOTICE '*** %: %', in_row->>'id', in_row;

  FOR attr IN SELECT jsonb_object_keys(criteria) LOOP
    colon_pos = strpos(attr, ':');

    -- 1. Apply local criteria
    IF colon_pos = 0 THEN
      RAISE NOTICE '- local attr: % (''%'') ?= ''%''', attr, in_row->>attr, criteria->>attr;
      IF
        ((in_row->>attr) IS NULL AND (criteria->>attr) IS NULL) OR
        ((in_row->>attr) = (criteria->>attr)) OR
        (unaccent((in_row->>attr)::text) ILIKE '%' || unaccent(criteria->>attr) || '%')
      THEN
        CONTINUE;
      END IF;
      RAISE NOTICE '  local attr: %: match NOK (null mismatch)', attr;
      RETURN FALSE;

    -- 2. Apply related criteria (attribute name examples: post:post_id (from comment) comment:post_id:rev (from post)
    ELSE
      related_table = substring(attr for colon_pos - 1);
      related_fk = substring(attr from colon_pos + 1);
      colon_pos2 = strpos(related_fk, ':');
      related_criteria = criteria->>attr;
      IF colon_pos2 > 0 THEN
        related_fk = substring(related_fk for colon_pos2 - 1);
      END IF;
      RAISE NOTICE '- related attr (% table via %) ?= %', related_table, related_fk, related_criteria;
      IF colon_pos2 > 0 THEN
        -- 1-to-N query (will find 0, 1 or more rows)
        related_query = format('SELECT * FROM forum_example.%I AS related WHERE related.%I = %L', related_table, related_fk, in_row->>'id');
      ELSE
        -- 1-to-1 query (will find 0, 1 rows)
        related_query = format('SELECT * FROM forum_example.%I AS related WHERE related.id = %L', related_table, in_row->>related_fk);
      END IF;
      RAISE NOTICE '  * related query: %', related_query;
      is_match = FALSE;
      FOR related_row IN EXECUTE related_query LOOP
        IF forum_example.row_match(row_to_json(related_row), related_criteria) THEN
          is_match = TRUE;
          EXIT;
        END IF;
      END LOOP;
      IF NOT is_match THEN
        RAISE NOTICE '  related attr: %: match NOK', attr;
        RETURN FALSE;
      END IF;
    END IF;
  END LOOP;

  RAISE NOTICE '*** %: match OK', in_row->>'id';
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql STABLE;
