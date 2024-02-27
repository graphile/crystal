/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";
import sqlite3 from "sqlite3";

import type {
  ExecutionDetails,
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
} from "../dist/index.js";
import {
  access,
  context,
  ExecutableStep,
  grafast,
  makeGrafastSchema,
} from "../dist/index.js";

declare global {
  namespace Grafast {
    interface Context {
      db: sqlite3.Database;
    }
  }
}

function query<T>(db: sqlite3.Database, sql: string, values: any[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    return db.all<T>(sql, values, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function run(db: sqlite3.Database, sql: string, values: any[] = []) {
  return new Promise<void>((resolve, reject) => {
    return db.run(sql, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

class GetRecordsStep<T extends Record<string, any>> extends ExecutableStep {
  depIdByIdentifier: Record<string, number>;
  dbDepId: string | number;
  constructor(
    private tableName: string,
    identifiers: Record<string, ExecutableStep> = Object.create(null),
  ) {
    super();
    this.dbDepId = this.addUnaryDependency(context().get("db"));
    this.depIdByIdentifier = Object.fromEntries(
      Object.entries(identifiers).map(([col, $step]) => [
        col,
        this.addDependency($step),
      ]),
    );
  }

  toStringMeta(): string | null {
    const entries = Object.entries(this.depIdByIdentifier);
    return (
      this.tableName +
      (entries.length > 0
        ? `{${entries.map(([k, v]) => `${k}=${this.getDep(v)}`).join(",")}}`
        : "")
    );
  }

  // Unary Dep Id
  private firstUDI: string | number;
  setFirst($first: ExecutableStep) {
    this.firstUDI = this.addUnaryDependency($first);
  }

  async executeV2({
    count,
    values,
    unaries,
  }: ExecutionDetails): Promise<GrafastResultsList<any>> {
    const db = unaries[this.dbDepId] as sqlite3.Database;
    const first = this.firstUDI != null ? unaries[this.firstUDI] : null;

    const identifierCols = Object.keys(this.depIdByIdentifier);

    // Note: This SQL is not safe from SQL injection, it makes no effort to
    // escape table or column names. Do not use this in production, this is a
    // test file!
    const otherOrders = [];
    const otherConditions = [];
    const orderBy = `${[...identifierCols, ...otherOrders].join(", ")}`;
    const sql = `\
select *
from ${this.tableName} t
where
${
  identifierCols.length > 0
    ? `(
  (
    ${identifierCols.join(", ")}
  ) in (
    select ${identifierCols
      .map((ident) => `value->>'${ident}' as ${ident}`)
      .join(", ")}
    from json_each(?)
  )
)`
    : true
}
${
  first != null && identifierCols.length > 0
    ? `
and (
  row_number() over (
    partition by ${identifierCols.join(", ")}
    order by ${orderBy}
  ) <= ${first}
)`
    : ``
}
${otherConditions.length ? `and (${otherConditions.join(")\nand (")})` : ``}
${orderBy ? `order by ${orderBy}` : ""}
`;
    const sqlValues: any[] = [];
    if (identifierCols.length > 0) {
      const json: any[] = [];
      for (let i = 0; i < count; i++) {
        const obj = Object.fromEntries(
          Object.entries(this.depIdByIdentifier).map(([col, depId]) => [
            col,
            values[depId] ? values[depId][i] : unaries[depId],
          ]),
        );
        json.push(obj);
      }
      sqlValues.push(JSON.stringify(json));
    }
    const dbResults = await query<T>(db, sql, sqlValues);
    const results: T[][] = [];
    const entries = Object.entries(this.depIdByIdentifier);
    for (let i = 0; i < count; i++) {
      // This could be more optimal by leveraging they're already in order
      results[i] = dbResults.filter((r) => {
        return entries.every(
          ([col, depId]) =>
            r[col] === (values[depId] ? values[depId][i] : unaries[depId]),
        );
      });
    }
    return results;
  }
  listItem($item: ExecutableStep) {
    return access($item);
  }
}

const makeSchema = () => {
  return makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        allPeople: [Person]
      }
      type Person {
        name: String
        pets(first: Int): [Pet]
      }
      type Pet {
        name: String
      }
    `,
    plans: {
      Query: {
        allPeople(_) {
          return getRecords("people");
        },
      },
      Person: {
        pets($owner, { $first }) {
          const $ownerId = $owner.get("id");
          const $pets = getRecords("pets", { owner_id: $ownerId });
          $pets.setFirst($first);
          return $pets;
        },
      },
    },
    enableDeferStream: false,
  });
};

function getRecords(
  tableName: string,
  identifiers?: Record<string, ExecutableStep>,
) {
  return new GetRecordsStep(tableName, identifiers);
}

async function withDb<T>(callback: (db: sqlite3.Database) => Promise<T>) {
  const db = new sqlite3.Database(":memory:");
  try {
    await run(db, `drop table if exists pets;`);
    await run(db, `drop table if exists people;`);
    await run(
      db,
      `create table people (
    id serial primary key,
    name text
);`,
    );
    await run(
      db,
      `create table pets (
    id serial primary key,
    name text,
    owner_id int
);`,
    );
    await run(
      db,
      `insert into people (id, name) values
  (1, 'Alice'),
  (2, 'Fred'),
  (3, 'Kat');`,
    );
    await run(
      db,
      `insert into pets (id, owner_id, name) values
  (1, 1, 'Animal 1'),
  (2, 1, 'Animal 2'),
  (3, 1, 'Animal 3'),
  (4, 2, 'Fox 1'),
  (5, 2, 'Fox 2'),
  (6, 3, 'Cat 1'),
  (7, 3, 'Cat 2'),
  (8, 3, 'Cat 3');
`,
    );
    return await callback(db);
  } finally {
    db.close();
  }
}

it("works", () =>
  withDb(async (db) => {
    const schema = makeSchema();
    const source = /* GraphQL */ `
      query Q {
        allPeople {
          name
          pets {
            name
          }
        }
      }
    `;
    const variableValues = {};
    const result = (await grafast(
      {
        schema,
        source,
        variableValues,
        contextValue: {
          db,
        },
      },
      {},
      {},
    )) as ExecutionResult;
    expect(result.errors).to.be.undefined;
    expect(result.data).to.deep.equal({
      allPeople: [
        {
          name: "Alice",
          pets: [
            { name: "Animal 1" },
            { name: "Animal 2" },
            { name: "Animal 3" },
          ],
        },
        {
          name: "Fred",
          pets: [{ name: "Fox 1" }, { name: "Fox 2" }],
        },
        {
          name: "Kat",
          pets: [{ name: "Cat 1" }, { name: "Cat 2" }, { name: "Cat 3" }],
        },
      ],
    });
  }));
