// @flow
import * as sql from "pg-sql2";
import type { SQL } from "pg-sql2";
import isSafeInteger from "lodash/isSafeInteger";

const isDev = process.env.POSTGRAPHILE_ENV === "development";

type GenContext = {
  queryBuilder: QueryBuilder,
};
type Gen<T> = (context: GenContext) => T;

function callIfNecessary<T>(o: Gen<T> | T, context: GenContext): T {
  if (typeof o === "function") {
    return o(context);
  } else {
    return o;
  }
}

function callIfNecessaryArray<T>(
  o: Array<Gen<T> | T>,
  context: GenContext
): Array<T> {
  if (Array.isArray(o)) {
    return o.map(v => callIfNecessary(v, context));
  } else {
    return o;
  }
}

type RawAlias = Symbol | string;
type SQLAlias = SQL;
type SQLGen = Gen<SQL> | SQL;
type NumberGen = Gen<number> | number;
type CursorValue = {};
type CursorComparator = (val: CursorValue, isAfter: boolean) => void;

class QueryBuilder {
  locks: {
    [string]: true | string,
  };
  finalized: boolean;
  data: {
    cursorPrefix: Array<string>,
    select: Array<[SQLGen, RawAlias]>,
    selectCursor: ?SQLGen,
    from: ?[SQLGen, SQLAlias],
    join: Array<SQLGen>,
    where: Array<SQLGen>,
    whereBound: {
      lower: Array<SQLGen>,
      upper: Array<SQLGen>,
    },
    orderBy: Array<[SQLGen, boolean]>,
    orderIsUnique: boolean,
    limit: ?NumberGen,
    offset: ?NumberGen,
    first: ?number,
    last: ?number,
    beforeLock: {
      [string]: Array<() => void>,
    },
    cursorComparator: ?CursorComparator,
  };
  compiledData: {
    cursorPrefix: Array<string>,
    select: Array<[SQL, RawAlias]>,
    selectCursor: ?SQL,
    from: ?[SQL, SQLAlias],
    join: Array<SQL>,
    where: Array<SQL>,
    whereBound: {
      lower: Array<SQL>,
      upper: Array<SQL>,
    },
    orderBy: Array<[SQL, boolean]>,
    orderIsUnique: boolean,
    limit: ?number,
    offset: ?number,
    first: ?number,
    last: ?number,
    cursorComparator: ?CursorComparator,
  };

  constructor() {
    this.locks = {};
    this.finalized = false;
    this.data = {
      // TODO: refactor `cursorPrefix`, it shouldn't be here (or should at least have getters/setters)
      cursorPrefix: ["natural"],
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
      orderIsUnique: false,
      limit: null,
      offset: null,
      first: null,
      last: null,
      beforeLock: {},
      cursorComparator: null,
    };
    this.compiledData = {
      cursorPrefix: ["natural"],
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
      orderIsUnique: false,
      limit: null,
      offset: null,
      first: null,
      last: null,
      cursorComparator: null,
    };
    this.beforeLock("select", () => {
      this.lock("selectCursor");
      if (this.compiledData.selectCursor) {
        this.select(this.compiledData.selectCursor, "__cursor");
      }
    });
    // 'whereBound' and 'natural' order might set offset/limit
    this.beforeLock("where", () => {
      this.lock("whereBound");
    });
    this.beforeLock("offset", () => {
      this.lock("whereBound");
    });
    this.beforeLock("limit", () => {
      this.lock("whereBound");
    });
    this.beforeLock("first", () => {
      this.lock("limit");
      this.lock("offset");
    });
    this.beforeLock("last", () => {
      this.lock("limit");
      this.lock("offset");
    });
  }

  // ----------------------------------------

  beforeLock(field: string, fn: () => void) {
    this.checkLock(field);
    this.data.beforeLock[field] = this.data.beforeLock[field] || [];
    this.data.beforeLock[field].push(fn);
  }
  setCursorComparator(fn: CursorComparator) {
    this.checkLock("cursorComparator");
    this.data.cursorComparator = fn;
    this.lock("cursorComparator");
  }
  addCursorCondition(cursorValue: CursorValue, isAfter: boolean) {
    this.beforeLock("whereBound", () => {
      this.lock("cursorComparator");
      if (!this.compiledData.cursorComparator) {
        throw new Error("No cursor comparator was set!");
      }
      this.compiledData.cursorComparator(cursorValue, isAfter);
    });
  }
  select(exprGen: SQLGen, alias: RawAlias) {
    this.checkLock("select");
    if (typeof alias === "string") {
      // To protect against vulnerabilities such as
      //
      // https://github.com/brianc/node-postgres/issues/1408
      //
      // we need to ensure column names are safe. Turns out that GraphQL
      // aliases are fairly strict (`[_A-Za-z][_0-9A-Za-z]*`) anyway:
      //
      // https://github.com/graphql/graphql-js/blob/680685dd14bd52c6475305e150e5f295ead2aa7e/src/language/lexer.js#L551-L581
      //
      // so this should not cause any issues in practice.
      if (/^(@+|[_A-Za-z])[_0-9A-Za-z]*$/.test(alias) !== true) {
        throw new Error(`Disallowed alias '${alias}'.`);
      }
    }
    this.data.select.push([exprGen, alias]);
  }
  selectCursor(exprGen: SQLGen) {
    this.checkLock("selectCursor");
    this.data.selectCursor = exprGen;
  }
  from(expr: SQLGen, alias?: SQLAlias = sql.identifier(Symbol())) {
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
  where(exprGen: SQLGen) {
    this.checkLock("where");
    this.data.where.push(exprGen);
  }
  whereBound(exprGen: SQLGen, isLower: boolean) {
    if (typeof isLower !== "boolean") {
      throw new Error("isLower must be specified as a boolean");
    }
    this.checkLock("whereBound");
    this.data.whereBound[isLower ? "lower" : "upper"].push(exprGen);
  }
  setOrderIsUnique() {
    this.data.orderIsUnique = true;
  }
  orderBy(exprGen: SQLGen, ascending: boolean = true) {
    this.checkLock("orderBy");
    this.data.orderBy.push([exprGen, ascending]);
  }
  limit(limitGen: NumberGen) {
    this.checkLock("limit");

    if (this.data.limit != null) {
      throw new Error("Must only set limit once");
    }
    this.data.limit = limitGen;
  }
  offset(offsetGen: NumberGen) {
    this.checkLock("offset");
    if (this.data.offset != null) {
      // Add the offsets together (this should be able to recurse)
      const previous = this.data.offset;
      this.data.offset = context => {
        return (
          callIfNecessary(previous, context) +
          callIfNecessary(offsetGen, context)
        );
      };
    } else {
      this.data.offset = offsetGen;
    }
  }
  first(first: number) {
    this.checkLock("first");
    if (this.data.first != null) {
      throw new Error("Must only set first once");
    }
    this.data.first = first;
  }
  last(last: number) {
    this.checkLock("last");
    if (this.data.last != null) {
      throw new Error("Must only set last once");
    }
    this.data.last = last;
  }

  // ----------------------------------------

  isOrderUnique(lock?: boolean = true) {
    if (lock) {
      this.lock("orderBy");
      this.lock("orderIsUnique");
      return this.compiledData.orderIsUnique;
    } else {
      // This is useful inside `beforeLock("orderBy", ...)` calls
      return this.data.orderIsUnique;
    }
  }
  getTableExpression(): SQL {
    this.lock("from");
    if (!this.compiledData.from) {
      throw new Error("No from table has been supplied");
    }
    return this.compiledData.from[0];
  }
  getTableAlias(): SQL {
    this.lock("from");
    if (!this.compiledData.from) {
      throw new Error("No from table has been supplied");
    }
    return this.compiledData.from[1];
  }
  getSelectCursor() {
    this.lock("selectCursor");
    return this.compiledData.selectCursor;
  }
  getOffset() {
    this.lock("offset");
    return this.compiledData.offset || 0;
  }
  getFinalLimitAndOffset() {
    this.lock("offset");
    this.lock("limit");
    this.lock("first");
    this.lock("last");
    let limit = this.compiledData.limit;
    let offset = this.compiledData.offset || 0;
    let flip = false;
    if (this.compiledData.first != null) {
      if (limit != null) {
        limit = Math.min(limit, this.compiledData.first);
      } else {
        limit = this.compiledData.first;
      }
    }
    if (this.compiledData.last != null) {
      if (offset > 0 && limit != null) {
        throw new Error(
          "Issue within pagination, please report your query to graphile-build"
        );
      }
      if (limit != null) {
        if (this.compiledData.last < limit) {
          offset = limit - this.compiledData.last;
          limit = this.compiledData.last;
        } else {
          // no need to change anything
        }
      } else if (offset > 0) {
        throw new Error("Cannot combine 'last' and 'offset'");
      } else {
        if (this.compiledData.orderBy.length > 0) {
          flip = true;
          limit = this.compiledData.last;
        } else {
          throw new Error("Cannot do last of an unordered set");
        }
      }
    }
    return {
      limit,
      offset,
      flip,
    };
  }
  getFinalOffset() {
    return this.getFinalLimitAndOffset().offset;
  }
  getFinalLimit() {
    return this.getFinalLimitAndOffset().limit;
  }
  getOrderByExpressionsAndDirections() {
    this.lock("orderBy");
    return this.compiledData.orderBy;
  }
  getSelectFieldsCount() {
    this.lockEverything();
    return this.compiledData.select.length;
  }
  buildSelectFields() {
    this.lockEverything();
    return sql.join(
      this.compiledData.select.map(
        ([sqlFragment, alias]) =>
          sql.fragment`to_json(${sqlFragment}) as ${sql.identifier(alias)}`
      ),
      ", "
    );
  }
  buildSelectJson({ addNullCase }: { addNullCase?: boolean }) {
    this.lockEverything();
    let buildObject = this.compiledData.select.length
      ? sql.fragment`json_build_object(${sql.join(
          this.compiledData.select.map(
            ([sqlFragment, alias]) =>
              sql.fragment`${sql.literal(alias)}::text, ${sqlFragment}`
          ),
          ", "
        )})`
      : sql.fragment`to_json(${this.getTableAlias()})`;
    if (addNullCase) {
      buildObject = sql.fragment`(case when (${this.getTableAlias()} is null) then null else ${buildObject} end)`;
    }
    return buildObject;
  }
  buildWhereBoundClause(isLower: boolean) {
    this.lock("whereBound");
    const clauses = this.compiledData.whereBound[isLower ? "lower" : "upper"];
    if (clauses.length) {
      return sql.fragment`(${sql.join(clauses, ") and (")})`;
    } else {
      return sql.literal(true);
    }
  }
  buildWhereClause(
    includeLowerBound: boolean,
    includeUpperBound: boolean,
    { addNullCase }: { addNullCase?: boolean }
  ) {
    this.lock("where");
    const clauses = [
      ...(addNullCase
        ? /*
           * Okay... so this is quite interesting. When we're talking about
           * composite types, `(foo is not null)` and `not (foo is null)` are
           * NOT equivalent! Here's why:
           *
           * `(foo is null)`
           *   true if every field of the row is null
           *
           * `(foo is not null)`
           *   true if every field of the row is not null
           *
           * `not (foo is null)`
           *   true if there's at least one field that is not null
           *
           * So don't "simplify" the line below! We're probably checking if
           * the result of a function call returning a compound type was
           * indeed null.
           */
          [sql.fragment`not (${this.getTableAlias()} is null)`]
        : []),
      ...this.compiledData.where,
      ...(includeLowerBound ? [this.buildWhereBoundClause(true)] : []),
      ...(includeUpperBound ? [this.buildWhereBoundClause(false)] : []),
    ];
    return clauses.length
      ? sql.fragment`(${sql.join(clauses, ") and (")})`
      : sql.fragment`1 = 1`;
  }
  build(
    options: {
      asJson?: boolean,
      asJsonAggregate?: boolean,
      onlyJsonField?: boolean,
      addNullCase?: boolean,
    } = {}
  ) {
    const {
      asJson = false,
      asJsonAggregate = false,
      onlyJsonField = false,
      addNullCase = false,
    } = options;

    this.lockEverything();
    if (onlyJsonField) {
      return this.buildSelectJson({ addNullCase });
    }
    const { limit, offset, flip } = this.getFinalLimitAndOffset();
    const fields =
      asJson || asJsonAggregate
        ? sql.fragment`${this.buildSelectJson({ addNullCase })} as object`
        : this.buildSelectFields();

    let fragment = sql.fragment`
      select ${fields}
      ${this.compiledData.from &&
        sql.fragment`from ${
          this.compiledData.from[0]
        } as ${this.getTableAlias()}`}
      ${this.compiledData.join.length && sql.join(this.compiledData.join, " ")}
      where ${this.buildWhereClause(true, true, options)}
      ${
        this.compiledData.orderBy.length
          ? sql.fragment`order by ${sql.join(
              this.compiledData.orderBy.map(
                ([expr, ascending]) =>
                  sql.fragment`${expr} ${
                    Number(ascending) ^ Number(flip)
                      ? sql.fragment`ASC`
                      : sql.fragment`DESC`
                  }`
              ),
              ","
            )}`
          : ""
      }
      ${isSafeInteger(limit) && sql.fragment`limit ${sql.literal(limit)}`}
      ${offset && sql.fragment`offset ${sql.literal(offset)}`}
    `;
    if (flip) {
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
  lock(type: string) {
    if (this.locks[type]) return;
    const getContext = () => ({
      queryBuilder: this,
    });
    const beforeLocks = this.data.beforeLock[type];
    this.data.beforeLock[type] = [];
    for (const fn of beforeLocks || []) {
      fn();
    }
    this.locks[type] = isDev ? new Error("Initally locked here").stack : true;
    if (type === "cursorComparator") {
      // It's meant to be a function
      this.compiledData[type] = this.data[type];
    } else if (type === "whereBound") {
      // Handle properties separately
      const context = getContext();
      this.compiledData[type].lower = callIfNecessaryArray(
        this.data[type].lower,
        context
      );
      this.compiledData[type].upper = callIfNecessaryArray(
        this.data[type].upper,
        context
      );
    } else if (type === "select") {
      // Assume that duplicate fields must be identical, don't output the same key multiple times
      const seenFields = {};
      const context = getContext();
      this.compiledData[type] = this.data[type].reduce((memo, [a, b]) => {
        // $FlowFixMe
        if (!seenFields[b]) {
          // $FlowFixMe
          seenFields[b] = true;
          memo.push([callIfNecessary(a, context), b]);
        }
        return memo;
      }, []);
    } else if (type === "orderBy") {
      const context = getContext();
      this.compiledData[type] = this.data[type].map(([a, b]) => [
        callIfNecessary(a, context),
        b,
      ]);
    } else if (type === "from") {
      if (this.data.from) {
        const f = this.data.from;
        const context = getContext();
        this.compiledData.from = [callIfNecessary(f[0], context), f[1]];
      }
    } else if (type === "join" || type === "where") {
      const context = getContext();
      this.compiledData[type] = callIfNecessaryArray(this.data[type], context);
    } else if (type === "selectCursor") {
      const context = getContext();
      this.compiledData[type] = callIfNecessary(this.data[type], context);
    } else if (type === "cursorPrefix") {
      this.compiledData[type] = this.data[type];
    } else if (type === "orderIsUnique") {
      this.compiledData[type] = this.data[type];
    } else if (type === "limit") {
      const context = getContext();
      this.compiledData[type] = callIfNecessary(this.data[type], context);
    } else if (type === "offset") {
      const context = getContext();
      this.compiledData[type] = callIfNecessary(this.data[type], context);
    } else if (type === "first") {
      this.compiledData[type] = this.data[type];
    } else if (type === "last") {
      this.compiledData[type] = this.data[type];
    } else {
      throw new Error(`Wasn't expecting to lock '${type}'`);
    }
  }
  checkLock(type: string) {
    if (this.locks[type]) {
      if (typeof this.locks[type] === "string") {
        throw new Error(
          `'${type}' has already been locked\n    ` +
            this.locks[type].replace(/\n/g, "\n    ") +
            "\n"
        );
      }
      throw new Error(`'${type}' has already been locked`);
    }
  }
  lockEverything() {
    this._finalize();
    // We must execute everything after `from` so we have the alias to reference
    this.lock("from");
    this.lock("join");
    this.lock("orderBy");
    // We must execute where after orderBy because cursor queries require all orderBy columns
    this.lock("cursorComparator");
    this.lock("whereBound");
    this.lock("where");
    // 'where' -> 'whereBound' can affect 'offset'/'limit'
    this.lock("offset");
    this.lock("limit");
    this.lock("first");
    this.lock("last");
    // We must execute select after orderBy otherwise we cannot generate a cursor
    this.lock("selectCursor");
    this.lock("select");
  }
}

export default QueryBuilder;
