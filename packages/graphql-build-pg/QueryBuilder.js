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
    this.data = {
      select: [],
      from: null,
      join: [],
      where: [],
      orderBy: [],
      limit: null,
      offset: null,
    };
  }

  // ----------------------------------------

  select(exprGen, alias) {
    this.checkLock("select");
    this.data.select.push([exprGen, alias]);
  }
  from(expr, alias) {
    this.checkLock("from");
    this.data.from = [expr, alias];
    this.lock("from");
  }
  // XXX: join
  where(exprGen) {
    this.checkLock("where");
    this.data.where.push(exprGen);
  }
  orderBy(exprGen, ascending) {
    this.checkLock("orderBy");
    this.data.orderBy.push([exprGen, ascending]);
  }
  limit(limit) {
    this.checkLock("limit");
    this.data.limit = limit;
    this.lock("limit");
  }

  // ----------------------------------------

  getTableAlias() {
    this.lock("from");
    this.data.from[1];
  }
  getOrderByExpressionsAndDirections() {
    this.lock("orderBy");
    return this.data.orderBy;
  }
  buildSelectFields() {
    return sql.join(
      this.data.select.map(
        ([sqlFragment, alias]) =>
          sql.fragment`${sqlFragment} as ${sql.identifier(alias)}`
      ),
      ", "
    );
  }
  buildSelectJson(aggregate = false) {
    const buildObject = sql.fragment`json_build_object(${sql.join(
      this.data.select.map(
        ([sqlFragment, alias]) =>
          sql.fragment`${sql.literal(alias)}, ${sqlFragment}`
      ),
      ", "
    )})`;
    if (aggregate) {
      return sql.fragment`json_agg(${buildObject})`;
    } else {
      return buildObject;
    }
  }
  build({ asJson = false, asJsonAggregate = false } = {}) {
    this.lockEverything();
    return sql.fragment`
      select ${asJson || asJsonAggregate
        ? this.buildSelectJson(asJsonAggregate)
        : this.buildSelectFields()}
      ${this.data.from &&
        sql.fragment`from ${this.data.from[0]} as ${sql.identifier(
          this.data.from[1]
        )}`}
      ${this.data.join && sql.join(this.data.join, " ")}
      ${this.data.where.length &&
        sql.fragment`where ${sql.join(this.data.where, " AND ")}`}
      ${this.data.orderBy.length
        ? `order by ${sql.join(
            this.data.orderBy.map(
              ([expr, ascending]) =>
                sql.fragment`${expr} ${ascending
                  ? sql.fragment`ASC`
                  : sql.fragment`DESC`}`
            ),
            ","
          )}`
        : ""}
      ${this.data.limit && `limit ${this.data.limit}`}
      ${this.data.offset && `offset ${this.data.offset}`}
    `;
  }

  // ----------------------------------------

  lock(type) {
    if (this[`${type}Locked`]) return;
    this[`${type}Locked`] = true;
    this.data[type] = callIfNecessary(this.data[type]);
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
