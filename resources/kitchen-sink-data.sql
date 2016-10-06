-- We don’t have a `begin`/`commit` in here to let the users of this query
-- control the data lifecycle.

insert into c.person (id, name, email, about, created_at) values
  (1, 'John Smith', 'john.smith@email.com', null, null),
  (2, 'Sara Smith', 'sara.smith@email.com', null, null),
  (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null),
  (4, 'Kathryn Ramirez', 'kathryn.ramirez@email.com', null, null),
  (5, 'Johnny Tucker', 'johnny.tucker@email.com', null, null);

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

insert into b.types (id, "bigint", "boolean", "varchar", "enum", "domain", "domain2", "text_array", "compound_type", "nested_compound_type") values
  (50, 200, true, 'xyz', 'green', 5, 6, array['hey', 'i', 'just', 'met', 'you'], (1, '2', 'blue', '4be8a712-3ff7-432e-aa34-fdb43fbd838d', 8), ((3, '456', 'red', 'aed18400-2a92-46df-8204-b70c728b3520', 93), (42, 'Hello, world!', 'blue', 'd34df5e0-83f1-11e6-8dd0-abee917ffd1e', -5), 7));
