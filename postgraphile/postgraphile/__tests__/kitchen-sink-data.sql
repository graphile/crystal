alter table b.types disable trigger user;
delete from nested_arrays.t cascade;
delete from smart_comment_relations.streets cascade;
delete from smart_comment_relations.street_property cascade;
delete from smart_comment_relations.properties cascade;
delete from smart_comment_relations.buildings cascade;
delete from ranges.range_test cascade;
delete from network_types.network cascade;
delete from named_query_builder.toy_categories cascade;
delete from named_query_builder.toys cascade;
delete from named_query_builder.categories cascade;
delete from large_bigint.large_node_id cascade;
delete from geometry.geom cascade;
delete from enum_tables.referencing_table cascade;
delete from enum_tables.letter_descriptions cascade;
delete from d.person cascade;
delete from c.person_secret cascade;
delete from c.person cascade;
delete from c.null_test_record cascade;
delete from c.my_table cascade;
delete from c.left_arm cascade;
delete from c.edge_case cascade;
delete from c.compound_key cascade;
delete from b.types cascade;
delete from a.view_table cascade;
delete from a.unique_foreign_key cascade;
delete from a.similar_table_2 cascade;
delete from a.similar_table_1 cascade;
delete from a.post cascade;
delete from a.no_primary_key cascade;
delete from a.foreign_key cascade;
delete from a.default_value cascade;
delete from inheritence.user_file cascade;
delete from inheritence.file cascade;
delete from c.issue756 cascade;

delete from polymorphic.gcp_application_third_party_vulnerabilities cascade;
delete from polymorphic.gcp_application_first_party_vulnerabilities cascade;
delete from polymorphic.aws_application_third_party_vulnerabilities cascade;
delete from polymorphic.aws_application_first_party_vulnerabilities cascade;
delete from polymorphic.third_party_vulnerabilities cascade;
delete from polymorphic.first_party_vulnerabilities cascade;
delete from polymorphic.gcp_applications cascade;
delete from polymorphic.aws_applications cascade;
delete from polymorphic.relational_item_relations cascade;
delete from polymorphic.relational_checklist_items cascade;
delete from polymorphic.relational_checklists cascade;
delete from polymorphic.relational_dividers cascade;
delete from polymorphic.relational_posts cascade;
delete from polymorphic.relational_topics cascade;
delete from polymorphic.relational_items cascade;
delete from polymorphic.single_table_item_relations cascade;
delete from polymorphic.single_table_items cascade;
delete from polymorphic.priorities cascade;
delete from polymorphic.log_entries cascade;
delete from polymorphic.people cascade;
delete from polymorphic.organizations cascade;

delete from js_reserved.relational_status cascade;
delete from js_reserved.relational_topics cascade;
delete from js_reserved.relational_items cascade; 
delete from js_reserved.machine cascade;
delete from js_reserved.building cascade;

delete from js_reserved.project cascade;
delete from js_reserved.crop cascade;
delete from js_reserved.material cascade;
delete from js_reserved.constructor cascade;
delete from js_reserved.yield cascade;
delete from js_reserved.__proto__ cascade;
delete from js_reserved.null cascade;
delete from js_reserved.reserved cascade;

delete from partitions.measurements cascade;
delete from partitions.users cascade;

alter table b.types enable trigger user;

alter sequence inheritence.file_id_seq restart with 1;
alter sequence c.issue756_id_seq restart with 1;
alter sequence b.types_id_seq restart with 1;

insert into a.no_primary_key (id, str) values
  (1, 'one'),
  (2, 'two'),
  (3, 'three');

insert into c.person (id, person_full_name, email, about, config, last_login_from_ip, last_login_from_subnet, user_mac, created_at) values
  (1, 'John Smith', 'john.smith@email.com', null, '', '192.168.0.1', '192.168.0.0/24', '00:00:00:00:00:00', null),
  (2, 'Sara Smith', 'sara.smith@email.com', null, 'a => 1', '10.1.2.3', '10.0.0.0/8', '11-22-33-44-55-66', null),
  (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', 'b => 2', '172.21.22.23', '172.16.0.0/12', '778899AABBCC', null),
  (4, 'Kathryn Ramirez', 'kathryn.ramirez@email.com', null, 'a => 3, b => 4', '192.168.1.2', '192.168.0.0/16', 'ddee.ff00.1122', null),
  (5, 'Joe Tucker', 'joe.tucker@email.com', null, 'a => 5, b => 6, actually_null => NULL, null_string => "null", "_\"_$@£$)(@*£$" => "_\"_$@£$)(@*£$"', '192.168.0.2', '192.168.0.0/23', '334455-667788', null),
  (6, 'Twenty Seventwo', 'graphile-build.issue.27.exists@example.com', null, 'null_1 => NULL, null_2 => null', '10.1.2.254', '10.0.0.0/9', '99aabb:ccddee', null);

alter sequence c.person_id_seq restart with 10;

insert into c.person_secret (person_id, sekrit) values
  (2, 'Sara Smith is not really my name!'),
  (3, 'I once got stuck trying to retrieve something embarassing from between two panes of glass'),
  (5, 'My only secret is that I have no secrets!'),
  (6, 'I don''t think the bug I test for will ever return!');

insert into c.left_arm (id, person_id, length_in_metres) values
  (42, 4, 0.60),
  (45, 2, 0.70),
  (47, 5, 0.65),
  (50, 1, 0.65);

alter sequence c.left_arm_id_seq restart with 100;

insert into a.post (id, author_id, headline) values
  (1, 2, 'No… It’s a thing; it’s like a plan, but with more greatness.'),
  (2, 1, 'I hate yogurt. It’s just stuff with bits in.'),
  (3, 1, 'Is that a cooking show?'),
  (4, 1, 'You hit me with a cricket bat.'),
  (5, 5, 'Please, Don-Bot… look into your hard drive, and open your mercy file!'),
  (6, 3, 'Stop talking, brain thinking. Hush.'),
  (7, 1, 'Large bet on myself in round one.'),
  (8, 2, 'It’s a fez. I wear a fez now. Fezes are cool.'),
  (9, 3, 'You know how I sometimes have really brilliant ideas?'),
  (10, 2, 'What’s with you kids? Every other day it’s food, food, food.'),
  (11, 3, 'They’re not aliens, they’re Earth…liens!');

alter sequence a.post_id_seq restart with 1000000;

insert into c.compound_key (person_id_1, person_id_2, extra) values
  (1, 2, null),
  (2, 1, false),
  (4, 3, true),
  (2, 5, true),
  (2, 3, null),
  (4, 4, false);

insert into a.foreign_key (person_id, compound_key_1, compound_key_2) values
  (5, 2, 1),
  (null, 4, 4),
  (null, 2, 1);

insert into a.unique_foreign_key (compound_key_1, compound_key_2) values
  (2, 1),
  (4, 4),
  (2, 5);

insert into b.types values (
  11,
  10,
  467131188225,
  15.2,
  15.2,
  true,
  'xyz',
  'green',
  ARRAY['green', 'red']::b.color[],
  5,
  6,
  array['hey', 'i', 'just', 'met', 'you'],
  '{"a":1,"b":2,"c":3,"d":{"e":4,"f":5,"g":[6,7,8,"x",false,null]}}',
  '{"1":"a","2":"b","3":"c","4":{"5":"d","6":"e","7":["f","g","h",42,true,null]}}',
  null,
  numrange(-10, 52),
  daterange('1998-07-12', '2016-10-07'),
  '[20, 53]',
  '1999-01-08 04:05:06',
  '1999-01-08 04:05:06 -8:00',
  '2016-10-07',
  '04:05:06',
  '04:05:06 -8:00',
  '1 year 2 months 3 days 4 hours 5 minutes 6.789123456 seconds',
  ARRAY['1 year 2 months 3 days 4 hours 5 minutes 6.789123456 seconds', '1 year 1 months 1 days 1 hours 1 minutes 1 seconds']::interval[],
  '9876543.21',
  (1, '2', 'blue', '4be8a712-3ff7-432e-aa34-fdb43fbd838d', 'FOO_BAR', '', interval '6 hours', 8),
  ((3, '456', 'red', 'aed18400-2a92-46df-8204-b70c728b3520', 'BAR_FOO', 'one', interval '6 hours', 93), (42, 'Hello, world!', 'blue', 'd34df5e0-83f1-11e6-8dd0-abee917ffd1e', 'BAZ_QUX', '', interval '6 hours', -5), 7),
  null,
  null,
  point(1,3),
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
);

insert into b.types values (
  12,
  9999, -- deliberately don't reference a real post ID
  467131188225,
  15.2,
  15.2,
  true,
  'xyz',
  'green',
  ARRAY['green', 'red']::b.color[],
  5,
  6,
  array['hey', 'i', 'just', 'met', 'you'],
  '{"a":1,"b":2,"c":3,"d":{"e":4,"f":5,"g":[6,7,8,"x",false,null]}}',
  '{"1":"a","2":"b","3":"c","4":{"5":"d","6":"e","7":["f","g","h",42,true,null]}}',
  null,
  numrange(-10, 52),
  daterange('1998-07-12', '2016-10-07'),
  '[20, 53]',
  '1999-01-08 04:05:06',
  '1999-01-08 04:05:06 -8:00',
  '2016-10-07',
  '04:05:06',
  '04:05:06 -8:00',
  '1 year 2 months 3 days 4 hours 5 minutes 6.789123456 seconds',
  ARRAY['1 year 2 months 3 days 4 hours 5 minutes 6.789123456 seconds', '1 year 1 months 1 days 1 hours 1 minutes 1 seconds', '200 years', '200.200 seconds']::interval[],
  '9876543.21',
  (null, null, null, null, null, null, null, null),
  ((3, '456', 'red', 'aed18400-2a92-46df-8204-b70c728b3520', 'BAR_FOO', 'one', interval '6 hours', 93), (null, null, null, null, null, null, null, null), 7),
  null,
  null,
  point(1,3),
  null,
  '192.168.0.0',
  '192.168.0.0/24',
  'feed.dead.beef',
  'b.guid_fn', 
  'b.guid_fn(b.guid)', 
  '>>=',
  '*(integer,integer)', 
  'b.types', 
  'int', 
  'english', 
  'simple',
  ARRAY['1 year', '2 months', '3 days']::text[],
  ARRAY[1, 2, 2098288669218571760],
  decode('12340000AAAAFFFF9876', 'base64'),
  array[decode('AAAA123400xXyYzZAAAA', 'base64'), decode('1234AAAA567890abcdefGHIJKAAA', 'base64')]::bytea[]
);

insert into c.edge_case values
  (default, 20, 1),
  (true, null, 2),
  (false, -512, 3),
  (default, null, 4);

insert into a.similar_table_1 (id, col1, col2, col3) values
  (1, null, 6, 3),
  (2, null, null, -3),
  (3, -78, 4, 20),
  (4, 86, null, 362),
  (5, null, 1, 14);

insert into a.similar_table_2 (id, col4, col5, col3) values
  (1, null, 6, 3),
  (2, null, null, -3),
  (3, -78, 4, 20),
  (4, 86, null, 362),
  (5, null, 1, 14);

insert into a.default_value (id, null_value) values
  (1, 'someValue!');

insert into a.view_table (id, col1, col2) values
  (1, 11, 21),
  (2, 12, 22),
  (3, 13, 23);

insert into c.my_table(id, json_data) values
  (1, '{"stringField":"test"}'),
  (2, '{"stringField":"test","otherField":"whatever"}'),
  (3, '{"stringField":"notTest"}');

alter sequence c.my_table_id_seq restart with 10;

insert into c.null_test_record (id, nullable_text, nullable_int, non_null_text) values
  (1, 'Hello', 99, 'World'),
  (2, null, 98, 'Ninety eight'),
  (3, null, null, 'Ninety seven'),
  (4, 'Hey', null, 'Ninety six'),
  (5, 'Hey', 95, 'Ninety five');

-- Begin tests for smart comments

insert into d.person (id, first_name, last_name) values
  (1, 'John', 'Smith'),
  (2, 'Sara', 'Smith');

update d.person set
  col_no_create = col_no_create || id::text,
  col_no_update = col_no_update || id::text,
  col_no_order = col_no_order || id::text,
  col_no_filter = col_no_filter || id::text,
  col_no_create_update = col_no_create_update || id::text,
  col_no_create_update_order_filter = col_no_create_update_order_filter || id::text,
  col_no_anything = col_no_anything || id::text;

alter sequence d.person_id_seq restart with 10;


-- Begin data for smart_comment_relations


insert into smart_comment_relations.streets (id, name) values
  (1, 'My Street'),
  (2, 'Our Street'),
  (3, 'Dunroamin');

insert into smart_comment_relations.properties (id, street_id, name_or_number) values
  (1, 1, 'My House'),
  (2, 1, '10'),
  (3, 2, 'The middle'),
  (4, 3, 'Your house');

insert into smart_comment_relations.street_property (str_id, prop_id, current_owner) values
  (1, 1, 'Me'),
  (2, 3, 'Us'),
  (3, 4, 'You');

insert into smart_comment_relations.buildings (id, property_id, name, floors, is_primary) values
  (1, 3, 'Our House', 3, true),
  (2, 3, 'Dunroamin', 1, false),
  (3, 3, 'Our shed', 1, false),
  (4, 1, 'Home sweet home', 2, true),
  (5, 4, 'The Tower', 200, true);

insert into large_bigint.large_node_id (id, text) values (9007199254740990, 'Should be fine');
insert into large_bigint.large_node_id (id, text) values (2098288669218571760, 'Graphile Engine issue #491');

insert into network_types.network values
  (1, '192.168.0.0', '192.168.0.0/16', '08:00:2b:01:02:03'),
  (2, '192.168.0.1', '192.168', '08-00-2b-01-02-03'),
  (3, '172.16.0.0/12', '172.16.0.0/12', '08002b:010203'),
  (4, '172.16.0.1/12', '172.16.0', '08002b-010203'),
  (5, '2001:4f8:3:ba::', '2001:4f8:3:ba::/64', '0800.2b01.0203'),
  (6, '2001:4f8:3:ba:2e0:81ff:fe22:d1f1', '2001:4f8:3:ba:2e0:81ff:fe22:d1f1/128', '08002b010203');

alter sequence network_types.network_id_seq restart with 7;


insert into named_query_builder.categories (id, name) values
  (1, 'Dinosaurs'),
  (2, 'Science'),
  (3, 'Military');
insert into named_query_builder.toys (id, name) values
  (1, 'Rex'),
  (2, 'Toy Soldiers'),
  (3, 'Dino-Rocket Launcher'),
  (4, 'History of Dinosaurs book');
insert into named_query_builder.toy_categories(toy_id, category_id, approved) values
  (1, 1, true),
  (2, 3, true),
  (3, 1, true),
  (3, 3, true),
  (4, 1, true),
  (4, 2, true),
  (1, 3, false);

--------------------------------------------------------------------------------
alter sequence enum_tables.letter_descriptions_id_seq restart with 101;
insert into enum_tables.letter_descriptions(letter, letter_via_view, description) values
  ('A', 'A', 'The first letter in the alphabet'),
  ('B', 'B', 'Following closely behind the first letter, this is a popular choice'),
  ('C', 'C', 'Pronounced like ''sea'''),
  ('D', 'D', 'The first letter omitted from the ''ABC'' phrase');

alter sequence enum_tables.referencing_table_id_seq restart with 432;
insert into enum_tables.referencing_table(enum_1, enum_2, enum_3, simple_enum) values
  ('a1', null, null, null),
  ('a3', 'b2', 'c1', 'Baz'),
  (null, null, 'c3', 'Qux');

--------------------------------------------------------------------------------

alter sequence geometry.geom_id_seq restart with 101;
insert into geometry.geom(
  point, line, lseg, box, open_path, closed_path, polygon, circle
) values (
  point(4, 2),
  line(point(7, 11), point(13, 17)),
  lseg(point(7, 11), point(13, 17)),
  box(point(7, 11), point(13, 17)),
  '[(1,3),(3,4),(4,1)]',
  '((1,3),(3,4),(4,1))',
  '((1,3),(3,4),(4,1))',
  '<(10, 10), 7>'
);


--------------------------------------------------------------------------------

alter sequence ranges.range_test_id_seq restart with 934;
insert into ranges.range_test(
  num, int8, ts, tstz
) values (
  numrange(-1234567890123456789.123456789012, 1111111111111111111.111111111111),
  int8range( -98765432109876543, 22222222222222222),
  tsrange( '2019-01-10 21:45:56.356022'::timestamp, null),
  tstzrange('2019-01-10 21:45:56.356022+00'::timestamptz, null)
);


--------------------------------------------------------------------------------

insert into polymorphic.people (person_id, username) values
  (1, 'Alice'),
  (2, 'Benjie'),
  (3, 'Caroline'),
  (4, 'Dave'), -- No apps!
  (5, 'Ellie'),
  (6, 'Fred'),
  (7, 'Georgina'),
  (8, 'Harry'),
  (9, 'Idris'),
  (10, 'Jem');

insert into polymorphic.organizations (organization_id, name) values
  (1, 'Acme'),
  (2, 'Stark Industries'),
  (3, 'Weyland-Yutani'),
  (4, 'Wayne Enterprises'),
  (5, 'Cyberdyne Systems'),
  (6, 'Umbrella Corporation'),
  (7, 'Delos Incorporated'),
  (8, 'Aperture Science');

insert into polymorphic.log_entries (id, person_id, organization_id, text) values
  (1, 1, null, 'Please let me in'),
  (2, null, 6, 'Spotless safety records continue at all facilities'),
  (3, null, 5, 'I''ll be back'),
  (4, 4, null, 'Beer brewing complete'),
  (5, 4, null, 'Cider brewing commencing'),
  (6, null, 7, 'Rumours of sentient androids are greatly exaggerated'),
  (7, null, 5, 'Rumours of robot sentience are greatly exaggerated'),
  (8, null, 4, 'Rumours of man-shaped bats are greatly exaggerated'),
  (9, 2, null, 'Just a few more test fixtures to write, almost there!'),
  (10, null, 2, 'Rest in peace, Tony.'),
  (11, null, 6, 'Please can Alice report to Raccoon City for testing'),
  (12, null, 8, 'Hello-o! Are you still there?'),
  (13, 8, null, 'I''d like to introduce my wife'),
  (14, 8, null, 'I''m moving to America');
  
insert into polymorphic.priorities (id, title) values
  (1, 'High'),
  (2, 'Medium'),
  (3, 'Low');

insert into polymorphic.single_table_items 
  (id, type,             parent_id, author_id, position, created_at,             updated_at,             is_explicitly_archived, archived_at,            color,   title, description, note, priority_id) values
  (1,  'TOPIC',          null,      2,         0,        '2020-01-28T11:00:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'PostGraphile version 5', null, null, null),
  (2,  'TOPIC',          null,      1,         0,        '2020-03-26T13:00:00Z', '2020-03-26T14:00:00Z', true,                   '2020-03-26T14:00:00Z', null,    'Temporary test topic', null, null, null),
  (3,  'DIVIDER',        1,         2,         0,        '2020-01-28T11:00:00Z', '2021-07-30T14:24:00Z', false,                  null,                   'green', 'Headline features', null, null, null),
  (4,  'POST',           1,         2,         1,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Better planning', null, null, 1),
  (5,  'POST',           1,         2,         2,        '2020-01-28T11:02:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Easier to code', null, null, 2),
  (6,  'POST',           1,         2,         3,        '2020-01-28T11:03:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'More features', 'E.g. interfaces and unions', 'Also things like querying from multiple databases', 3),
  (7,  'POST',           1,         2,         4,        '2020-01-28T11:04:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Better performance', null, null, 1),
  (8,  'DIVIDER',        1,         2,         5,        '2020-01-28T11:05:00Z', '2021-07-30T14:24:00Z', false,                  null,                   'blue',  'Timescale', null, null, null),
  (9,  'POST',           1,         2,         6,        '2020-01-28T11:06:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'When have I ever committed to a timescale?', ':D', 'It''ll be done when it''s done, I prefer longer development time and longer stable time than multiple major releases in a year or two.', 2),
  (10, 'TOPIC',          1,         2,         7,        '2020-01-28T11:07:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Notes', null, null, null),
  (11, 'TOPIC',          10,        2,         0,        '2020-01-28T11:08:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Other aims', null, null, null),
  (12, 'POST',           11,        2,         0,        '2020-01-28T11:09:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Fix legacy issues', null, null, null),
  (13, 'POST',           11,        2,         1,        '2020-01-28T11:10:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Full TypeScript conversion', null, null, null),
  (14, 'POST',           11,        2,         2,        '2020-01-28T11:11:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Monorepo', null, null, null),
  (15, 'POST',           2,         1,         0,        '2020-01-28T11:11:00Z', '2021-07-30T14:24:00Z', false,                  '2020-03-26T14:00:00Z', null,    'Just a test', null, null, null),
  (16, 'CHECKLIST',      4,         2,         0,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Planning goals', null, null, null),
  (17, 'CHECKLIST_ITEM', 16,        2,         0,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Follows pattern of GraphQL resolver flow', null, null),
  (18, 'CHECKLIST_ITEM', 16,        3,         1,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Has an optimisation phase', null, 1),
  (19, 'CHECKLIST_ITEM', 16,        2,         2,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Plan deduplication at the field level', null, 2),
  (20, 'CHECKLIST_ITEM', 16,        2,         3,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Garbage-collection of unused plans', null, 3),
  (21, 'CHECKLIST_ITEM', 16,        1,         4,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Supports newest GraphQL features', null, null);

with recursive cte as (
  select
    id as rti,
    id
  from polymorphic.single_table_items
  where parent_id is null
union all
  select
    rti,
    single_table_items.id
  from polymorphic.single_table_items, cte
  where single_table_items.parent_id = cte.id
)
update polymorphic.single_table_items
  set root_topic_id = rti
  from cte
  where single_table_items.id = cte.id
  and cte.id != cte.rti;

insert into polymorphic.single_table_item_relations
  (id,  parent_id, child_id) values
  (1,   1,         3),
  (2,   1,         4),
  (3,   1,         5),
  (4,   1,         6),
  (5,   1,         7),
  (6,   1,         8),
  (7,   1,         9),
  (8,   1,         10),
  (9,   10,        11),
  (10,  11,        12),
  (11,  11,        13),
  (12,  11,        14),
  (13,  2,         15),
  (14,  4,         16),
  (15,  16,        17),
  (16,  16,        18),
  (17,  16,        19),
  (18,  16,        20),
  (19,  16,        21);
alter sequence polymorphic.single_table_item_relations_id_seq restart with 9999;

insert into polymorphic.relational_items
  (id, type,             parent_id, author_id, position, created_at,             updated_at,             is_explicitly_archived, archived_at) values
  (1,  'TOPIC',          null,      2,         0,        '2020-01-28T11:00:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (2,  'TOPIC',          null,      1,         0,        '2020-03-26T13:00:00Z', '2020-03-26T14:00:00Z', true,                   '2020-03-26T14:00:00Z'),
  (3,  'DIVIDER',        1,         2,         0,        '2020-01-28T11:00:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (4,  'POST',           1,         2,         1,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (5,  'POST',           1,         2,         2,        '2020-01-28T11:02:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (6,  'POST',           1,         2,         3,        '2020-01-28T11:03:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (7,  'POST',           1,         2,         4,        '2020-01-28T11:04:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (8,  'DIVIDER',        1,         2,         5,        '2020-01-28T11:05:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (9,  'POST',           1,         2,         6,        '2020-01-28T11:06:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (10, 'TOPIC',          1,         2,         7,        '2020-01-28T11:07:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (11, 'TOPIC',          10,        2,         0,        '2020-01-28T11:08:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (12, 'POST',           11,        2,         0,        '2020-01-28T11:09:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (13, 'POST',           11,        2,         1,        '2020-01-28T11:10:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (14, 'POST',           11,        2,         2,        '2020-01-28T11:11:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (15, 'POST',           2,         1,         0,        '2020-01-28T11:11:00Z', '2021-07-30T14:24:00Z', false,                  '2020-03-26T14:00:00Z'),
  (16, 'CHECKLIST',      4,         2,         0,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (17, 'CHECKLIST_ITEM', 16,        2,         0,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (18, 'CHECKLIST_ITEM', 16,        3,         1,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (19, 'CHECKLIST_ITEM', 16,        2,         2,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (20, 'CHECKLIST_ITEM', 16,        2,         3,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (21, 'CHECKLIST_ITEM', 16,        1,         4,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null);

insert into polymorphic.relational_topics (topic_item_id, title)  values
  (1, 'PostGraphile version 5'),
  (2, 'Temporary test topic'),
  (10, 'Notes'),
  (11, 'Other aims');

with recursive cte as (
  select
    id as rti,
    id
  from polymorphic.relational_items
  where parent_id is null
union all
  select
    rti,
    relational_items.id
  from polymorphic.relational_items, cte
  where relational_items.parent_id = cte.id
)
update polymorphic.relational_items
  set root_topic_id = rti
  from cte
  where relational_items.id = cte.id
  and cte.id != cte.rti;

insert into polymorphic.relational_posts (post_item_id, title, description, note)  values
  (4, 'Better planning', null, null),
  (5, 'Easier to code', null, null),
  (6, 'More features', 'E.g. interfaces and unions', 'Also things like querying from multiple databases'),
  (7, 'Better performance', null, null),
  (9, 'When have I ever committed to a timescale?', ':D', 'It''ll be done when it''s done, I prefer longer development time and longer stable time than multiple major releases in a year or two.'),
  (12, 'Fix legacy issues', null, null),
  (13, 'Full TypeScript conversion', null, null),
  (14, 'Monorepo', null, null),
  (15, 'Just a test', null, null);

insert into polymorphic.relational_dividers (divider_item_id, title, color)  values
  (3, 'Headline features', 'green'),
  (8, 'Timescale', 'blue');

insert into polymorphic.relational_checklists (checklist_item_id, title)  values
  (16, 'Planning goals');

insert into polymorphic.relational_checklist_items (checklist_item_item_id, description, note)  values
  (17, 'Follows pattern of GraphQL resolver flow', null),
  (18, 'Has an optimisation phase', null),
  (19, 'Plan deduplication at the field level', null),
  (20, 'Garbage-collection of unused plans', null),
  (21, 'Supports newest GraphQL features', null);

insert into polymorphic.relational_item_relations
  (id,  parent_id, child_id) values
  (1,   1,         3),
  (2,   1,         4),
  (3,   1,         5),
  (4,   1,         6),
  (5,   1,         7),
  (6,   1,         8),
  (7,   1,         9),
  (8,   1,         10),
  (9,   10,        11),
  (10,  11,        12),
  (11,  11,        13),
  (12,  11,        14),
  (13,  2,         15),
  (14,  4,         16),
  (15,  16,        17),
  (16,  16,        18),
  (17,  16,        19),
  (18,  16,        20),
  (19,  16,        21);
alter sequence polymorphic.relational_item_relations_id_seq restart with 9999;


insert into polymorphic.aws_applications (id, person_id, organization_id, name, last_deployed, aws_id) values
  (1, null, 1, 'AWS App 1', null, 'AWS-0001'),
  (2, 2, null, 'AWeSome', '2021-06-05T04:03:02.010Z', 'AWS-0002'), -- NO VULNERABILITIES!
  (3, null, 1, 'AWS App 3', null, 'AWS-0003'),
  (4, 1, null, 'AWS App 4', null, 'AWS-0004'),
  (5, 1, null, 'AWS App 5', null, 'AWS-0005'),
  (6, 1, null, 'AWS App 6', null, 'AWS-0006'),
  (7, null, 5, 'SAC-NORAD AI', null, 'AWSKYNET'),
  (8, 2, null, 'AWfulS', '2022-07-06T05:04:03.020Z', 'AWS-0008');
insert into polymorphic.gcp_applications (id, person_id, organization_id, name, last_deployed, gcp_id) values
  (1, null, 1, 'GCP App 1', null, 'GCP_0_1'),
  (2, 3, null, 'Grand Crayon Pasta', '2022-10-10T10:10:10.101Z', 'GCP_0_2'),
  (3, 2, null, 'Great Creative Project', null, 'GCP_0_3'),
  (4, 2, null, 'Gargantual Crap Pile', null, 'GCP_0_4'),
  (5, 1, null, 'Gigacellerator Pro', null, 'GCP_0_5');

insert into polymorphic.first_party_vulnerabilities (id, name, cvss_score, team_name) values
  (1, 'Off-by-one', 3.0, 'Accounting'),
  (2, 'Index-out-of-bounds', 7.2, 'Retention'),
  (3, 'Exponential backtracking', 7.7, 'Continuity'),
  (4, 'Information disclosure', 7.2, 'Retention'),
  (5, 'Timing attack', 7.2, 'Retention'),
  (6, 'Race condition', 5.0, 'Reliability'); -- NO VULNERABLE APPS

insert into polymorphic.third_party_vulnerabilities (id, name, cvss_score, vendor_name) values
  (1, 'CSRF', 7.5, '98-Factor-Login'),
  (2, 'XSS', 9.1, 'Frog-Render-Lib'),
  (3, 'SQL injection', 10.0, 'Eval-Sequel-Corp'),
  (4, 'Malware', 7.2, 'Frog-Render-Lib'),
  (5, 'License', 7.2, 'Frog-Render-Lib');

insert into polymorphic.aws_application_first_party_vulnerabilities (aws_application_id, first_party_vulnerability_id) values
  (1, 1),
  (1, 3),
  (1, 4),
  (1, 5),
  (3, 1),
  (3, 3),
  (3, 4),
  (4, 3),
  (4, 4),
  (5, 3),
  (5, 5),
  (6, 1),
  (7, 1),
  (7, 5),
  (8, 3);
insert into polymorphic.aws_application_third_party_vulnerabilities (aws_application_id, third_party_vulnerability_id) values
  (1, 1),
  (1, 2),
  (1, 4),
  (1, 5),
  (3, 1),
  (3, 4),
  (4, 1),
  (5, 4),
  (6, 2),
  (6, 4),
  (6, 5),
  (7, 2),
  (7, 4),
  (8, 1),
  (8, 2),
  (8, 4),
  (8, 5);
insert into polymorphic.gcp_application_first_party_vulnerabilities (gcp_application_id, first_party_vulnerability_id) values
  (1, 2),
  (2, 2),
  (2, 3),
  (1, 4),
  (1, 5),
  (2, 4),
  (2, 5),
  (3, 2),
  (4, 1),
  (4, 3),
  (4, 4),
  (4, 5),
  (5, 3);
insert into polymorphic.gcp_application_third_party_vulnerabilities (gcp_application_id, third_party_vulnerability_id) values
  (1, 3),
  (2, 1),
  (2, 3),
  (1, 4),
  (1, 5),
  (2, 4),
  (2, 5),
  (3, 3),
  (3, 1),
  (4, 2),
  (5, 5),
  (5, 4);

--------------------------------------------------------------------------------

alter sequence js_reserved.building_id_seq restart with 1;
alter sequence js_reserved.machine_id_seq restart with 1;

insert into js_reserved.building
  (constructor,  name) values
  ('Cable',      'Copper Plant'), 
  ('Concrete',   'Limestone Quarry'),
  ('Iron Plate', 'Iron Mine');

insert into js_reserved.machine
  (constructor,  input) values
  ('Cable',      'Wire'), 
  ('Concrete',   'Limestone'),
  ('Iron Plate', 'Iron Ingot');

alter sequence js_reserved.relational_items_id_seq restart with 6;

insert into js_reserved.relational_items
  (id, type,     constructor   ) values
  (1,  'TOPIC',  'Cable'       ),
  (2,  'TOPIC',  'Concrete'    ),
  (3,  'STATUS', 'Iron Plate'  ),
  (5,  'TOPIC',  'Cable'       ),
  (4,  'STATUS', 'Iron Plate'  );

insert into js_reserved.relational_topics
  (id, title)  values
  (1, 'Upgrade'),
  (2, 'Maintenance'),
  (5, 'Emergency');

insert into js_reserved.relational_status
  (id, note,        description           )  values
  (3, 'Stopped',    'Best look into that' ),
  (4, 'Scheduled',  null                  );

alter sequence js_reserved.project_id_seq restart with 1;
alter sequence js_reserved.crop_id_seq restart with 1;

insert into js_reserved.project
  (__proto__,  brand     ) values
  ('DynaTAC',  'Motorola'),
  ('VCS',      'Atari'   ),
  ('Model T',  'Ford'    );

insert into js_reserved.crop
  (yield,   amount) values
  ('wheat', 100   ),
  ('corn',  200   ),
  ('oat',   555   );

alter sequence js_reserved.material_id_seq restart with 1;

insert into js_reserved.material
  (class,      "valueOf" ) values
  ('concrete', 'rough' ),
  ('glass',    'smooth'),
  ('rubber',   'spongy');

alter sequence js_reserved.constructor_id_seq restart with 1;

insert into js_reserved.constructor
  (name,               export) values
  ('Copper Plant',     'Copper Wire'),
  ('Limestone Quarry', 'Concrete'),
  ('Iron Mine',        'Iron Plates');

alter sequence js_reserved.yield_id_seq restart with 1;

insert into js_reserved.yield
  (crop,    export) values
  ('wheat', 'UK'),
  ('corn',  'IE'),
  ('oat',   'FR');

alter sequence js_reserved.__proto___id_seq restart with 1;

insert into js_reserved.__proto__
  (name,        brand     ) values
  ('DynaTAC',  'Motorola'),
  ('VCS',      'Atari'   ),
  ('Model T',  'Ford'    );

alter sequence js_reserved.null_id_seq restart with 1;

insert into js_reserved.null
  ("hasOwnProperty", break) values
  ('apartment', '10 am'),
  ('flat', 'noon'),
  ('house', '3 pm');

alter sequence js_reserved.reserved_id_seq restart with 1;

insert into js_reserved.reserved
  ("null",                            "case",          "do") values
  ('No Limit',                       '2 Unlimited',    '1993'),
  ('No More Mr Nice Guy',            'Alice Cooper',   '1973'),
  ('No Woman No Cry',                'Bob Marley',     '1974'),
  ('(I Can''t Get No) Satisfaction', 'Rolling Stones', '1965');

alter sequence partitions.users_id_seq restart with 1;
insert into partitions.users
  (name) values
  ('Alice'),
  ('Bob'),
  ('Caroline'),
  ('Dave');


insert into partitions.measurements
  (timestamp, key, value, user_id) values
  ('2022-03-04T01:02:03Z', 'temp', '22.5', 1),
  ('2022-03-04T01:02:03Z', 'humidity', '70', 2),
  ('2023-02-04T11:02:03Z', 'temp', '18.3', 1),
  ('2023-08-04T11:02:03Z', 'temp', '39.2', 3),
  ('2023-08-04T11:02:03Z', 'humidity', '100', 2);

insert into nested_arrays.t
  (k, v) values
  (1, '{"{\"(1,2,3,4)\"}","{\"(5,6,7,8)\"}","{}","{}","{}","{}","{}","{}"}'),
  (2, '{"{\"(2,3,4,5)\"}","{\"(6,7,8,9)\"}","{}","{}","{}","{}","{}","{}"}');

alter sequence nested_arrays.t_k_seq restart with 3;

truncate composite_domains.posts restart identity;

insert into composite_domains.posts (user_id, content, thread_content, created_at)
  values (
    1,
    (
      ARRAY[
        ARRAY[
          (
            'TEXT'::composite_domains.user_update_line_node_type,
            'blah1'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node,
          (
            'MENTION'::composite_domains.user_update_line_node_type,
            'blah2'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node
        ]::composite_domains.user_update_content_line,
        ARRAY[
          (
            'TEXT'::composite_domains.user_update_line_node_type,
            'blah3'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node,
          (
            'MENTION'::composite_domains.user_update_line_node_type,
            'blah4'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node
        ]::composite_domains.user_update_content_line
      ]::composite_domains.user_update_content_line[],
      'https://placekitten.com/200/300'
    )::composite_domains.user_update_content,
    ARRAY[
    (
      ARRAY[
        ARRAY[
          (
            'TEXT'::composite_domains.user_update_line_node_type,
            'blah5'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node,
          (
            'MENTION'::composite_domains.user_update_line_node_type,
            'blah6'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node
        ]::composite_domains.user_update_content_line,
        ARRAY[
          (
            'TEXT'::composite_domains.user_update_line_node_type,
            'blah7'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node,
          (
            'MENTION'::composite_domains.user_update_line_node_type,
            'blah8'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node
        ]::composite_domains.user_update_content_line
      ]::composite_domains.user_update_content_line[],
      'https://placekitten.com/200/300'
    )::composite_domains.user_update_content,
    (
      ARRAY[
        ARRAY[
          (
            'TEXT'::composite_domains.user_update_line_node_type,
            'blah9'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node,
          (
            'MENTION'::composite_domains.user_update_line_node_type,
            'blah10'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node
        ]::composite_domains.user_update_content_line,
        ARRAY[
          (
            'TEXT'::composite_domains.user_update_line_node_type,
            'blah11'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node,
          (
            'MENTION'::composite_domains.user_update_line_node_type,
            'blah12'::composite_domains.line_node_text
          )::composite_domains.user_update_content_line_node
        ]::composite_domains.user_update_content_line
      ]::composite_domains.user_update_content_line[],
      'https://placekitten.com/200/300'
    )::composite_domains.user_update_content

    ]::composite_domains.user_update_content[],
  '2023-09-29T09:13:28.571996-04:00'
  );
