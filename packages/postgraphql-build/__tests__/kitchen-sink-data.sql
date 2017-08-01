insert into c.person (id, name, email, about, created_at) values
  (1, 'John Smith', 'john.smith@email.com', null, null),
  (2, 'Sara Smith', 'sara.smith@email.com', null, null),
  (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null),
  (4, 'Kathryn Ramirez', 'kathryn.ramirez@email.com', null, null),
  (5, 'Joe Tucker', 'joe.tucker@email.com', null, null),
  (6, 'Twenty Seventwo', 'graphql-build.issue.27.exists@example.com', null, null);

alter sequence c.person_id_seq restart with 10;

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

insert into b.types values (
  12,
  50,
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
  1000,
  (1, '2', 'blue', '4be8a712-3ff7-432e-aa34-fdb43fbd838d', 8),
  ((3, '456', 'red', 'aed18400-2a92-46df-8204-b70c728b3520', 93), (42, 'Hello, world!', 'blue', 'd34df5e0-83f1-11e6-8dd0-abee917ffd1e', -5), 7)
);

insert into c.edge_case values
  (default, 20, 1),
  (true, null, 2),
  (false, -512, 3);

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
