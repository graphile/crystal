alter sequence interfaces_and_unions.people_person_id_seq restart with 1000000;
alter sequence interfaces_and_unions.posts_post_id_seq restart with 1000000;
alter sequence interfaces_and_unions.comments_comment_id_seq restart with 1000000;
alter sequence interfaces_and_unions.single_table_items_id_seq restart with 1000000;
alter sequence interfaces_and_unions.relational_items_id_seq restart with 1000000;
alter sequence interfaces_and_unions.relational_commentables_id_seq restart with 1000000;
alter sequence interfaces_and_unions.union_items_id_seq restart with 1000000;
alter sequence interfaces_and_unions.person_bookmarks_id_seq restart with 1000000;
alter sequence interfaces_and_unions.person_likes_id_seq restart with 1000000;

delete from app_public.messages where substring(id::text from 14 for 11) <> '-0000-0000-';
drop function if exists a.create_post;
