const sqlite3 = require("sqlite3").verbose();
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

db.serialize(() => {
  db.run(`\
CREATE TABLE users (
  id int primary key,
  full_name text not null
);
`);
  db.run(
    `\
CREATE TABLE friendships (
  id int primary key,
  user_id int not null,
  friend_id int not null
);
`,
  );

  {
    const stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
    for (let nameIndex = 0; nameIndex < NAMES.length; nameIndex++) {
      stmt.run(nameIndex + 1, NAMES[nameIndex]);
    }
    stmt.finalize();
  }

  {
    const stmt = db.prepare("INSERT INTO friendships VALUES (?, ?, ?)");
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
