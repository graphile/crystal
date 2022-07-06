-- Rename table and its column
comment on table d.original_table is E'@name renamed_table';
comment on column d.original_table.col1 is E'@name colA';

-- Rename custom function
comment on function d.original_function() is E'@name renamed_function';

-- Rename relations and computed column
comment on constraint post_author_id_fkey on d.post is E'@foreignFieldName posts\n@fieldName author';
comment on constraint person_pkey on d.person is E'@fieldName findPersonById';
comment on function d.person_full_name(d.person) is E'@fieldName name';
comment on function d.search_posts(text) is E'@name returnPostsMatching';

-- Rename custom queries
comment on function d.search_posts(text) is E'@name returnPostsMatching';

-- rename custom mutations
comment on function d.authenticate(a integer) is E'@name login\n@resultFieldName token';

-- rename type
comment on type d.flibble is E'@name flamble';

-- Begin tests for omit actions
comment on table d.films is E'@omit create';
comment on table d.tv_shows is E'@omit *';

comment on column d.tv_shows.title is E'@omit create';
comment on function d.person_full_name(d.person) is E'@omit execute';
