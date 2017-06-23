const sql = require("./sql");

const callIfNecessary = o => {
  if (typeof o === "function") {
    return o();
  } else if (Array.isArray(o)) {
    return o.map(callIfNecessary);
  } else {
    return o;
  }
};

class QueryBuilder {
  constructor() {
    this.select = [];
    this.from = null;
    this.join = [];
    this.where = [];
    this.orderBy = [];
    this.limit = null;
    this.offset = null;
  }

  // ----------------------------------------

  select(exprGen, alias) {
    this.checkLock("select");
    this.select.push([exprGen, alias]);
  }
  from(expr, alias) {
    this.checkLock("from");
    this.from = [expr, alias];
    this.lock("from");
  }
  // XXX: join
  where(exprGen) {
    this.checkLock("where");
    this.where.push(exprGen);
  }
  orderBy(exprGen, ascending) {
    this.checkLock("orderBy");
    this.orderBy.push([exprGen, ascending]);
  }
  limit(limit) {
    this.checkLock("limit");
    this.limit = limit;
    this.lock("limit");
  }

  // ----------------------------------------

  getOrderByExpressionsAndDirections() {
    this.lockedOrderBy = true;
    return this.orderBy;
  }
  buildSelectFields() {
    return sql.join(
      this.select.map(
        ({ sqlFragment, alias }) =>
          sql.fragment`${sqlFragment} as ${sql.identifier(alias)}`
      ),
      ", "
    );
  }
  buildSelectJson() {
    return sql.fragment`json_build_object(${sql.join(
      this.select.map(
        ({ sqlFragment, alias }) =>
          sql.fragment`${sql.literal(alias)}, ${sqlFragment}`
      ),
      ", "
    )})`;
  }
  build({ asJson = false } = {}) {
    this.lockEverything();
    return sql.fragment`
      select ${asJson ? this.buildSelectJson() : this.buildSelectFields()}
      ${this.from &&
        sql.fragment`from ${this.from[0]} as ${sql.identifier(this.from[1])}`}
      ${this.join && sql.join(this.join, " ")}
      where true and (${sql.join(this.where, " AND ")})
      ${this.orderBy.length
        ? `order by ${sql.join(
            this.orderBy.map(
              ([expr, ascending]) =>
                sql.fragment`${expr} ${ascending
                  ? sql.fragment`ASC`
                  : sql.fragment`DESC`}`
            ),
            ","
          )}`
        : ""}
      ${this.limit && `limit ${this.limit}`}
      ${this.offset && `offset ${this.offset}`}
    `;
  }

  // ----------------------------------------

  lock(type) {
    if (this[`${type}Locked`]) return;
    this[`${type}Locked`] = true;
    this[type] = callIfNecessary(this[type]);
  }
  checkLock(type) {
    if (this[`${type}Locked`]) {
      throw new Error("orderBy has already been locked");
    }
  }
  lockEverything() {
    // We must execute everything after `from` so we have the alias to reference
    this.lock("from");
    this.lock("join");
    this.lock("offset");
    this.lock("limit");
    this.lock("orderBy");
    // We must execute where after orderBy because cursor queries require all orderBy columns
    this.lock("where");
    // We must execute select after orderBy otherwise we cannot generate a cursor
    this.lock("select");
  }
}

module.exports = QueryBuilder;
