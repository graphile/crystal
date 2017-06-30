const sql = require("./sql");
const isDev = ["test", "development"].includes(process.env.NODE_ENV);

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
      selectCursor: null,
      from: null,
      join: [],
      where: [],
      whereBound: {
        lower: [],
        upper: [],
      },
      orderBy: [],
      limit: null,
      offset: null,
      flip: false,
      beforeLock: {},
      cursorComparator: null,
    };
    this.beforeLock("select", () => {
      this.lock("selectCursor");
      if (this.data.selectCursor) {
        this.select(this.data.selectCursor, "__cursor");
      }
    });
    this.beforeLock("where", () => {
      this.lock("whereBound");
    });
  }

  // ----------------------------------------

  beforeLock(field, fn) {
    this.checkLock(field);
    this.data.beforeLock[field] = this.data.beforeLock[field] || [];
    this.data.beforeLock[field].push(fn);
  }
  setCursorComparator(fn) {
    this.checkLock("cursorComparator");
    this.data.cursorComparator = fn;
    this.lock("cursorComparator");
  }
  cursorCondition(cursorValue, isAfter) {
    return this.data.cursorComparator(cursorValue, isAfter);
  }
  select(exprGen, alias) {
    this.checkLock("select");
    this.data.select.push([exprGen, alias]);
  }
  selectCursor(exprGen) {
    this.checkLock("selectCursor");
    this.data.selectCursor = exprGen;
  }
  from(expr, alias = sql.identifier(Symbol())) {
    this.checkLock("from");
    if (!expr) {
      throw new Error("No from table source!");
    }
    if (!alias) {
      throw new Error("No from alias!");
    }
    this.data.from = [expr, alias];
    this.lock("from");
  }
  // XXX: join
  where(exprGen) {
    this.checkLock("where");
    this.data.where.push(exprGen);
  }
  whereBound(exprGen, isLower) {
    if (typeof isLower !== "boolean") {
      throw new Error("isLower must be specified as a boolean");
    }
    this.checkLock("whereBound");
    this.data.whereBound[isLower ? "lower" : "upper"].push(exprGen);
  }
  orderBy(exprGen, ascending = true) {
    this.checkLock("orderBy");
    this.data.orderBy.push([exprGen, ascending]);
  }
  limit(limit) {
    this.checkLock("limit");
    this.data.limit = limit;
    this.lock("limit");
  }
  offset(offset) {
    this.checkLock("offset");
    this.data.offset = offset;
    this.lock("offset");
  }
  flip() {
    this.checkLock("flip");
    this.data.flip = true;
    this.lock("flip");
  }

  // ----------------------------------------

  getTableAlias() {
    this.lock("from");
    return this.data.from[1];
  }
  getOffset() {
    this.lock("offset");
    return this.data.offset || 0;
  }
  getOrderByExpressionsAndDirections() {
    this.lock("orderBy");
    return this.data.orderBy;
  }
  buildSelectFields() {
    this.lockEverything();
    return sql.join(
      this.data.select.map(
        ([sqlFragment, alias]) =>
          sql.fragment`${sqlFragment} as ${sql.identifier(alias)}`
      ),
      ", "
    );
  }
  buildSelectJson({ addNullCase }) {
    this.lockEverything();
    let buildObject = this.data.select.length
      ? sql.fragment`json_build_object(${sql.join(
          this.data.select.map(
            ([sqlFragment, alias]) =>
              sql.fragment`${sql.literal(alias)}, ${sqlFragment}`
          ),
          ", "
        )})`
      : sql.fragment`to_json(${this.getTableAlias()}.*)`;
    if (addNullCase) {
      buildObject = sql.fragment`(case when ${this.getTableAlias()} is null then null else ${buildObject} end)`;
    }
    return buildObject;
  }
  buildWhereBoundClause(isLower) {
    this.lock("whereBound");
    const clauses = this.data.whereBound[isLower ? "lower" : "upper"];
    if (clauses.length) {
      return sql.fragment`(${sql.join(clauses, " AND ")})`;
    } else {
      return sql.literal(true);
    }
  }
  buildWhereClause(includeLowerBound = true, includeUpperBound = true) {
    this.lock("where");
    const clauses = [
      ...this.data.where,
      ...(includeLowerBound ? [this.buildWhereBoundClause(true)] : []),
      ...(includeUpperBound ? [this.buildWhereBoundClause(false)] : []),
    ];
    return clauses.length
      ? sql.fragment`${sql.join(clauses, " AND ")}`
      : sql.fragment`1 = 1`;
  }
  build(
    {
      asJson = false,
      asJsonAggregate = false,
      onlyJsonField = false,
      addNullCase = false,
    } = {}
  ) {
    this.lockEverything();
    if (onlyJsonField) {
      return this.buildSelectJson({ addNullCase });
    }
    const fields = asJson || asJsonAggregate
      ? sql.fragment`${this.buildSelectJson({ addNullCase })} as object`
      : this.buildSelectFields();
    let fragment = sql.fragment`
      select ${fields}
      ${this.data.from &&
        sql.fragment`from ${this.data.from[0]} as ${this.getTableAlias()}`}
      ${this.data.join.length && sql.join(this.data.join, " ")}
      where ${this.buildWhereClause(true, true)}
      ${this.data.orderBy.length
        ? sql.fragment`order by ${sql.join(
            this.data.orderBy.map(
              ([expr, ascending]) =>
                sql.fragment`${expr} ${ascending ^ this.data.flip
                  ? sql.fragment`ASC`
                  : sql.fragment`DESC`}`
            ),
            ","
          )}`
        : ""}
      ${this.data.limit && sql.fragment`limit ${sql.literal(this.data.limit)}`}
      ${this.data.offset &&
        sql.fragment`offset ${sql.literal(this.data.offset)}`}
    `;
    if (this.data.flip) {
      const flipAlias = Symbol();
      fragment = sql.fragment`
        with ${sql.identifier(flipAlias)} as (
          ${fragment}
        )
        select *
        from ${sql.identifier(flipAlias)}
        order by (row_number() over (partition by 1)) desc
        `;
    }
    if (asJsonAggregate) {
      const aggAlias = Symbol();
      fragment = sql.fragment`select json_agg(${sql.identifier(
        aggAlias,
        "object"
      )}) from (${fragment}) as ${sql.identifier(aggAlias)}`;
      fragment = sql.fragment`select coalesce((${fragment}), '[]'::json)`;
    }
    return fragment;
  }

  // ----------------------------------------

  _finalize() {
    this.finalized = true;
  }
  lock(type) {
    if (this[`${type}Locked`]) return;
    for (const fn of this.data.beforeLock[type] || []) {
      fn();
    }
    this[`${type}Locked`] = isDev
      ? new Error("Initally locked here").stack
      : true;
    if (type === "cursorComparator") {
      // It's meant to be a function
    } else if (type === "whereBound") {
      // Handle properties separately
      this.data[type].lower = callIfNecessary(this.data[type].lower);
      this.data[type].upper = callIfNecessary(this.data[type].upper);
    } else {
      this.data[type] = callIfNecessary(this.data[type]);
    }
  }
  checkLock(type) {
    if (this[`${type}Locked`]) {
      if (isDev) {
        throw new Error(
          "orderBy has already been locked\n    " +
            this[`${type}Locked`].replace(/\n/g, "\n    ") +
            "\n"
        );
      }
      throw new Error("orderBy has already been locked");
    }
  }
  lockEverything() {
    this._finalize();
    // We must execute everything after `from` so we have the alias to reference
    this.lock("from");
    this.lock("flip");
    this.lock("join");
    this.lock("offset");
    this.lock("limit");
    this.lock("orderBy");
    // We must execute where after orderBy because cursor queries require all orderBy columns
    this.lock("cursorComparator");
    this.lock("where");
    // We must execute select after orderBy otherwise we cannot generate a cursor
    this.lock("selectCursor");
    this.lock("select");
  }
}

module.exports = QueryBuilder;
