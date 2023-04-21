const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(":memory:");
const NAMES = [
  "Alice",
  "Bob",
  "Caroline",
  "Dave",
  "Ellie",
  "Fred",
  "Georgina",
  "Harry",
  "India",
  "Jack",
  "Kay",
  "Leonard",
  "Mandy",
];

function makeBio(key) {
  return `Hi, my name is ${NAMES[key]} but you can call me Dr. ${NAMES[key][0]}; I enjoy long walks in the park and dancing in the moonlight. Opinions are my own. #blessed`;
}

db.serialize(() => {
  db.run(`\
CREATE TABLE users (
  id int primary key,
  full_name text not null,
  username text not null,
  bio text,
  created_at int not null default CURRENT_TIMESTAMP,
  updated_at int
);
`);
  db.run(
    `\
CREATE TABLE friendships (
  id int primary key,
  user_id int not null,
  friend_id int not null,
  created_at int not null default CURRENT_TIMESTAMP,
  updated_at int
);
`,
  );

  {
    const stmt = db.prepare(
      "INSERT INTO users (id, full_name, username, bio) VALUES (?, ?, ?, ?)",
    );
    for (let nameIndex = 0; nameIndex < NAMES.length; nameIndex++) {
      stmt.run(
        nameIndex + 1,
        NAMES[nameIndex],
        NAMES[nameIndex].toLowerCase(),
        makeBio(nameIndex),
      );
    }
    stmt.finalize();
  }

  {
    const stmt = db.prepare(
      "INSERT INTO friendships (id, user_id, friend_id) VALUES (?, ?, ?)",
    );
    let id = 0;
    for (let nameIndex = 0; nameIndex < NAMES.length; nameIndex++) {
      // A stable list of friendIds
      const friendIndexes = NAMES.map((_, idx) => idx).filter(
        (idx) => idx % (nameIndex + 1) === 0,
      );
      for (const friendIndex of friendIndexes) {
        stmt.run(++id, nameIndex + 1, friendIndex + 1);
      }
    }
    stmt.finalize();
  }
});

// db.close();

exports.db = db;
