import type { Transformer } from "../src/index.js";
import sql from "../src/index.js";

const numberToValue: Transformer<number> = (sql, value) => {
  if (typeof value === "number") {
    return sql.value(value);
  } else {
    return value;
  }
};

it("sql.withTransformer(numberToValue, cb)", () => {
  const stmt = sql.withTransformer(
    numberToValue,
    (sql) => sql`select * from users where id = ${42}`,
  );
  const compiled = sql.compile(stmt);
  expect(compiled.text).toEqual(`select * from users where id = $1`);
  expect(compiled.values).toEqual([42]);
});
