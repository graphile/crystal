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

alter sequence a.post_id_seq restart with 12;

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
  '1 year 2 months 3 days 4 hours 5 minutes 6 seconds',
  ARRAY['1 year 2 months 3 days 4 hours 5 minutes 6 seconds', '1 year 1 months 1 days 1 hours 1 minutes 1 seconds']::interval[],
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
  '1 year 2 months 3 days 4 hours 5 minutes 6 seconds',
  ARRAY['1 year 2 months 3 days 4 hours 5 minutes 6 seconds', '1 year 1 months 1 days 1 hours 1 minutes 1 seconds']::interval[],
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
  '!',
  '*(integer,integer)', 
  'b.types', 
  'int', 
  'english', 
  'simple',
  ARRAY['1 year', '2 months', '3 days']::text[],
  ARRAY[1, 2, 2098288669218571760]
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
insert into enum_tables.letter_descriptions(letter, description) values
  ('A', 'The first letter in the alphabet'),
  ('B', 'Following closely behind the first letter, this is a popular choice'),
  ('C', 'Pronounced like ''sea'''),
  ('D', 'The first letter omitted from the ''ABC'' phrase');

alter sequence enum_tables.referencing_table_id_seq restart with 432;
insert into enum_tables.referencing_table(enum_1, enum_2, enum_3) values
  ('a1', null, null),
  ('a3', 'b2', 'c1'),
  (null, null, 'c3');

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
