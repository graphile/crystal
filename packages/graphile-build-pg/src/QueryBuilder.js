// @flow
import * as sql from "pg-sql2";
import type { SQL } from "pg-sql2";
import isSafeInteger from "lodash/isSafeInteger";
import chunk from "lodash/chunk";
import type { PgClass, PgType } from "./plugins/PgIntrospectionPlugin";

// eslint-disable-next-line flowtype/no-weak-types
type GraphQLContext = any;

const isDev = process.env.POSTGRAPHILE_ENV === "development";

type GenContext = {
  queryBuilder: QueryBuilder,
};
type Gen<T> = (context: GenContext) => T;

// Importantly, this cannot include a function
type CallResult = null | string | number | boolean | SQL;

function callIfNecessary<T: CallResult>(o: Gen<T> | T, context: GenContext): T {
  if (typeof o === "function") {
    return o(context);
  } else {
    return o;
  }
}

function callIfNecessaryArray<T: CallResult>(
  o: Array<Gen<T> | T>,
  context: GenContext
): Array<T> {
  if (Array.isArray(o)) {
    return o.map(v => callIfNecessary(v, context));
  } else {
    return o;
  }
}

export type RawAlias = Symbol | string;
type SQLAlias = SQL;
type SQLGen = Gen<SQL> | SQL;
type NumberGen = Gen<number> | number;
type CursorValue = Array<mixed>;
type CursorComparator = (val: CursorValue, isAfter: boolean) => void;

export type QueryBuilderOptions = {
  supportsJSONB?: boolean, // Defaults to true
};

function escapeLarge(sqlFragment: SQL, type: PgType) {
  const actualType = type.domainBaseType || type;
  if (actualType.category === "N") {
    if (
      [
        "21" /* int2 */,
        "23" /* int4 */,
        "700" /* float4 */,
        "701" /* float8 */,
      ].includes(actualType.id)
    ) {
      // No need for special handling
      return sqlFragment;
    }
    // Otherwise force the id to be a string
    return sql.fragment`((${sqlFragment})::numeric)::text`;
  }
  return sqlFragment;
}

class QueryBuilder {
  parentQueryBuilder: QueryBuilder | void;
  context: GraphQLContext;
  rootValue: any; // eslint-disable-line flowtype/no-weak-types
  supportsJSONB: boolean;
  locks: {
    [string]: false | true | string,
  };
  finalized: boolean;
  selectedIdentifiers: boolean;
  data: {
    cursorPrefix: Array<string>,
    fixedSelectExpression: ?SQLGen,
    select: Array<[SQLGen, RawAlias]>,
    selectCursor: ?SQLGen,
    from: ?[SQLGen, SQLAlias],
    join: Array<SQLGen>,
    where: Array<SQLGen>,
    whereBound: {
      lower: Array<SQLGen>,
      upper: Array<SQLGen>,
    },
    orderBy: Array<[SQLGen, boolean, boolean | null]>,
    orderIsUnique: boolean,
    limit: ?NumberGen,
    offset: ?NumberGen,
    first: ?number,
    last: ?number,
    beforeLock: {
      [string]: Array<() => void> | null,
    },
    cursorComparator: ?CursorComparator,
    liveConditions: Array<
      // eslint-disable-next-line flowtype/no-weak-types
      [(data: {}) => (record: any) => boolean, { [key: string]: SQL } | void]
    >,
  };
  compiledData: {
    cursorPrefix: Array<string>,
    fixedSelectExpression: ?SQL,
    select: Array<[SQL, RawAlias]>,
    selectCursor: ?SQL,
    from: ?[SQL, SQLAlias],
    join: Array<SQL>,
    where: Array<SQL>,
    whereBound: {
      lower: Array<SQL>,
      upper: Array<SQL>,
    },
    orderBy: Array<[SQL, boolean, boolean | null]>,
    orderIsUnique: boolean,
    limit: ?number,
    offset: ?number,
    first: ?number,
    last: ?number,
    cursorComparator: ?CursorComparator,
  };
  lockContext: {
    queryBuilder: QueryBuilder,
  };
  _children: Map<RawAlias, QueryBuilder>;

  constructor(
    options: QueryBuilderOptions = {},
    context: GraphQLContext = {},
    rootValue?: any // eslint-disable-line flowtype/no-weak-types
  ) {
    this.context = context || {};
    this.rootValue = rootValue;
    this.supportsJSONB =
      typeof options.supportsJSONB === "undefined" ||
      options.supportsJSONB === null
        ? true
        : !!options.supportsJSONB;

    this.locks = {
      // As a performance optimisation, we're going to list a number of lock
      // types so that V8 doesn't need to mutate the object too much
      cursorComparator: false,
      fixedSelectExpression: false,
      select: false,
      selectCursor: false,
      from: false,
      join: false,
      whereBound: false,
      where: false,
      orderBy: false,
      orderIsUnique: false,
      first: false,
      last: false,
      limit: false,
      offset: false,
    };
    this.finalized = false;
    this.selectedIdentifiers = false;
    this.data = {
      // TODO: refactor `cursorPrefix`, it shouldn't be here (or should at least have getters/setters)
      cursorPrefix: ["natural"],
      fixedSelectExpression: null,
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
      beforeLock: {
        // As a performance optimisation, we're going to list a number of lock
        // types so that V8 doesn't need to mutate the object too much
        cursorComparator: [],
        fixedSelectExpression: [],
        select: [],
        selectCursor: [],
        from: [],
        join: [],
        whereBound: [],
        where: [],
        orderBy: [],
        orderIsUnique: [],
        first: [],
        last: [],
        limit: [],
        offset: [],
      },
      cursorComparator: null,
      liveConditions: [],
    };
    this.compiledData = {
      cursorPrefix: ["natural"],
      fixedSelectExpression: null,
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
    this._children = new Map();
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
    this.lockContext = Object.freeze({
      queryBuilder: this,
    });
  }

  // ----------------------------------------

  // Helper function
  jsonbBuildObject(fields: Array<[SQL, RawAlias]>) {
    if (this.supportsJSONB && fields.length > 50) {
      const fieldsChunks = chunk(fields, 50);
      const chunkToJson = fieldsChunk =>
        sql.fragment`jsonb_build_object(${sql.join(
          fieldsChunk.map(
            ([expr, alias]) =>
              sql.fragment`${sql.literal(alias)}::text, ${expr}`
          ),
          ", "
        )})`;
      return sql.fragment`(${sql.join(
        fieldsChunks.map(chunkToJson),
        " || "
      )})::json`;
    } else {
      // PG9.4 will have issues with more than 100 parameters (50 keys)
      return sql.fragment`json_build_object(${sql.join(
        fields.map(
          ([expr, alias]) => sql.fragment`${sql.literal(alias)}::text, ${expr}`
        ),
        ", "
      )})`;
    }
  }

  // ----------------------------------------

  beforeLock(field: string, fn: () => void) {
    this.checkLock(field);
    if (!this.data.beforeLock[field]) {
      this.data.beforeLock[field] = [];
    }
    // $FlowFixMe: this is guaranteed to be set, due to the if statement above
    this.data.beforeLock[field].push(fn);
  }

  makeLiveCollection(
    table: PgClass,
    // eslint-disable-next-line flowtype/no-weak-types
    cb?: (checker: (data: any) => (record: any) => boolean) => void
  ) {
    /* the actual condition doesn't matter hugely, 'select' should work */
    if (!this.rootValue || !this.rootValue.liveConditions) return;
    const liveConditions = this.data.liveConditions;
    const checkerGenerator = data => {
      // Compute this once.
      const checkers = liveConditions.map(([checkerGenerator]) =>
        checkerGenerator(data)
      );
      return record => checkers.every(checker => checker(record));
    };
    if (this.parentQueryBuilder) {
      const parentQueryBuilder = this.parentQueryBuilder;
      if (cb) {
        throw new Error(
          "Either use parentQueryBuilder or pass callback, not both."
        );
      }
      parentQueryBuilder.beforeLock("select", () => {
        const id = this.rootValue.liveConditions.push(checkerGenerator) - 1;
        // BEWARE: it's easy to override others' conditions, and that will cause issues. Be sensible.
        const allRequirements = this.data.liveConditions.reduce(
          (memo, [_checkerGenerator, requirements]) =>
            requirements ? Object.assign(memo, requirements) : memo,
          {}
        );
        parentQueryBuilder.select(
          sql.fragment`\
json_build_object('__id', ${sql.value(id)}::int
${sql.join(
  Object.keys(allRequirements).map(
    key => sql.fragment`, ${sql.literal(key)}::text, ${allRequirements[key]}`
  ),
  ""
)})`,
          "__live"
        );
      });
    } else if (cb) {
      cb(checkerGenerator);
    } else {
      throw new Error(
        "makeLiveCollection was called without parentQueryBuilder and without callback"
      );
    }
  }

  addLiveCondition(
    // eslint-disable-next-line flowtype/no-weak-types
    checkerGenerator: (data: {}) => (record: any) => boolean,
    requirements?: { [key: string]: SQL }
  ) {
    if (requirements && !this.parentQueryBuilder) {
      throw new Error(
        "There's no parentQueryBuilder, so there cannot be requirements"
      );
    }
    this.data.liveConditions.push([checkerGenerator, requirements]);
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
  /** this method is experimental */
  fixedSelectExpression(exprGen: SQLGen) {
    this.checkLock("fixedSelectExpression");
    this.lock("select");
    this.lock("selectCursor");
    if (this.data.select.length > 0) {
      throw new Error("Cannot use .fixedSelectExpression() with .select()");
    }
    if (this.data.selectCursor) {
      throw new Error(
        "Cannot use .fixedSelectExpression() with .selectCursor()"
      );
    }
    this.data.fixedSelectExpression = exprGen;
  }
  select(exprGen: SQLGen, alias: RawAlias) {
    this.checkLock("select");
    this.lock("fixedSelectExpression");
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
      if (/^(\$+|@+|[_A-Za-z])[_0-9A-Za-z]*$/.test(alias) !== true) {
        throw new Error(`Disallowed alias '${alias}'.`);
      }
    }
    this.data.select.push([exprGen, alias]);
  }
  selectIdentifiers(table: PgClass) {
    if (this.selectedIdentifiers) return;
    const primaryKey = table.primaryKeyConstraint;
    if (!primaryKey) return;
    const primaryKeys = primaryKey.keyAttributes;
    this.select(
      sql.fragment`json_build_array(${sql.join(
        primaryKeys.map(key =>
          escapeLarge(
            sql.fragment`${this.getTableAlias()}.${sql.identifier(key.name)}`,
            key.type
          )
        ),
        ", "
      )})`,
      "__identifiers"
    );
    this.selectedIdentifiers = true;
  }
  selectCursor(exprGen: SQLGen) {
    this.checkLock("selectCursor");
    this.lock("fixedSelectExpression");
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
  orderBy(
    exprGen: SQLGen,
    ascending: boolean = true,
    nullsFirst: boolean | null = null
  ) {
    this.checkLock("orderBy");
    this.data.orderBy.push([exprGen, ascending, nullsFirst]);
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
    if (this.compiledData.fixedSelectExpression) {
      return this.compiledData.fixedSelectExpression;
    }
    return sql.join(
      this.compiledData.select.map(
        ([sqlFragment, alias]) =>
          sql.fragment`to_json(${sqlFragment}) as ${sql.identifier(alias)}`
      ),
      ", "
    );
  }
  buildSelectJson({
    addNullCase,
    addNotDistinctFromNullCase,
  }: {
    addNullCase?: boolean,
    addNotDistinctFromNullCase?: boolean,
  }) {
    this.lockEverything();
    let buildObject = this.compiledData.select.length
      ? this.jsonbBuildObject(this.compiledData.select)
      : sql.fragment`to_json(${this.getTableAlias()})`;
    if (addNotDistinctFromNullCase) {
      /*
       * `is null` is not sufficient here because the record might exist but
       * have null as each of its values; so we use `is not distinct from null`
       * to assert that the record itself doesn't exist. This is typically used
       * with column values.
       */
      buildObject = sql.fragment`(case when (${this.getTableAlias()} is not distinct from null) then null else ${buildObject} end)`;
    } else if (addNullCase) {
      /*
       * `is null` is probably used here because it's the result of a function;
       * functions seem to have trouble differentiating between `null::my_type`
       * and  `(null,null,null)::my_type`, always opting for the latter which
       * then causes issues with the `GraphQLNonNull`s in the schema.
       */
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
    {
      addNullCase,
      addNotDistinctFromNullCase,
    }: { addNullCase?: boolean, addNotDistinctFromNullCase?: boolean }
  ) {
    this.lock("where");
    const clauses = [
      /*
       * Okay... so this is quite interesting. When we're talking about
       * composite types, `(foo is not null)` and `not (foo is null)` are NOT
       * equivalent! Here's why:
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
       * `is [not] distinct from null` does differentiate between these cases,
       * but when a function returns something like `select * from my_table
       * where false`, it actually returns `(null, null, null)::my_table`,
       * which will cause issues when we apply the `GraphQLNonNull` constraints
       * to the results - we want to treat this as null.
       *
       * So don't "simplify" the line below! We're probably checking if the
       * result of a function call returning a compound type was indeed null.
       */
      ...(addNotDistinctFromNullCase
        ? [sql.fragment`(${this.getTableAlias()} is distinct from null)`]
        : addNullCase
        ? [sql.fragment`not (${this.getTableAlias()} is null)`]
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
      addNotDistinctFromNullCase?: boolean,
      useAsterisk?: boolean,
    } = {}
  ) {
    this.lockEverything();

    if (this.compiledData.fixedSelectExpression) {
      if (Object.keys(options).length > 0) {
        throw new Error(
          "Do not pass options to QueryBuilder.build() when using `buildNamedChildSelecting`"
        );
      }
    }
    const {
      asJson = false,
      asJsonAggregate = false,
      onlyJsonField = false,
      addNullCase = false,
      addNotDistinctFromNullCase = false,
      useAsterisk = false,
    } = options;

    if (onlyJsonField) {
      return this.buildSelectJson({ addNullCase, addNotDistinctFromNullCase });
    }
    const { limit, offset, flip } = this.getFinalLimitAndOffset();
    const fields =
      asJson || asJsonAggregate
        ? sql.fragment`${this.buildSelectJson({
            addNullCase,
            addNotDistinctFromNullCase,
          })} as object`
        : this.buildSelectFields();

    let fragment = sql.fragment`\
select ${useAsterisk ? sql.fragment`${this.getTableAlias()}.*` : fields}
${
  this.compiledData.from &&
  sql.fragment`from ${this.compiledData.from[0]} as ${this.getTableAlias()}`
}
${this.compiledData.join.length && sql.join(this.compiledData.join, " ")}
where ${this.buildWhereClause(true, true, options)}
${
  this.compiledData.orderBy.length
    ? sql.fragment`order by ${sql.join(
        this.compiledData.orderBy.map(
          ([expr, ascending, nullsFirst]) =>
            sql.fragment`${expr} ${
              Number(ascending) ^ Number(flip)
                ? sql.fragment`ASC`
                : sql.fragment`DESC`
            }${
              nullsFirst === true
                ? sql.fragment` NULLS FIRST`
                : nullsFirst === false
                ? sql.fragment` NULLS LAST`
                : null
            }`
        ),
        ","
      )}`
    : ""
}
${isSafeInteger(limit) && sql.fragment`limit ${sql.literal(limit)}`}
${offset && sql.fragment`offset ${sql.literal(offset)}`}`;
    if (flip) {
      const flipAlias = Symbol();
      fragment = sql.fragment`\
with ${sql.identifier(flipAlias)} as (
  ${fragment}
)
select *
from ${sql.identifier(flipAlias)}
order by (row_number() over (partition by 1)) desc`; /* We don't need to factor useAsterisk into this row_number() usage */
    }
    if (useAsterisk) {
      /*
       * NOTE[useAsterisk/row_number]: since LIMIT/OFFSET is inside this
       * subquery, row_number() outside of this subquery WON'T include the
       * offset. We must add it back wherever row_number() is used.
       */
      fragment = sql.fragment`select ${fields} from (${fragment}) ${this.getTableAlias()}`;
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
    const context = this.lockContext;
    const { beforeLock } = this.data;
    let locks = beforeLock[type];
    if (locks) {
      beforeLock[type] = [];
      for (let i = 0, l = locks.length; i < l; i++) {
        locks[i]();
      }
    }
    if (type !== "select") {
      this.locks[type] = isDev ? new Error("Initally locked here").stack : true;
    }
    if (type === "cursorComparator") {
      // It's meant to be a function
      this.compiledData[type] = this.data[type];
    } else if (type === "whereBound") {
      // Handle properties separately
      this.compiledData[type].lower = callIfNecessaryArray(
        this.data[type].lower,
        context
      );
      this.compiledData[type].upper = callIfNecessaryArray(
        this.data[type].upper,
        context
      );
    } else if (type === "fixedSelectExpression") {
      this.compiledData[type] = callIfNecessary(this.data[type], context);
    } else if (type === "select") {
      /*
       * NOTICE: locking select can cause additional selects to be added, so the
       * length of this.data[type] may increase during the operation. This is
       * why we handle this.locks[type] separately.
       */

      // Assume that duplicate fields must be identical, don't output the same
      // key multiple times
      const seenFields: { [key: string | Symbol]: true } = {};
      const data = [];
      const selects = this.data[type];

      // DELIBERATE slow loop, see NOTICE above
      for (let i = 0; i < selects.length; i++) {
        const [valueOrGenerator, columnName] = selects[i];
        if (!seenFields[columnName]) {
          seenFields[columnName] = true;
          data.push([callIfNecessary(valueOrGenerator, context), columnName]);
          locks = beforeLock[type];
          if (locks) {
            beforeLock[type] = [];
            for (let i = 0, l = locks.length; i < l; i++) {
              locks[i]();
            }
          }
        }
      }
      this.locks[type] = isDev ? new Error("Initally locked here").stack : true;
      this.compiledData[type] = data;
    } else if (type === "orderBy") {
      this.compiledData[type] = this.data[type].map(([a, b, c]) => [
        callIfNecessary(a, context),
        b,
        c,
      ]);
    } else if (type === "from") {
      if (this.data.from) {
        const f = this.data.from;
        this.compiledData.from = [callIfNecessary(f[0], context), f[1]];
      }
    } else if (type === "join" || type === "where") {
      this.compiledData[type] = callIfNecessaryArray(this.data[type], context);
    } else if (type === "selectCursor") {
      this.compiledData[type] = callIfNecessary(this.data[type], context);
    } else if (type === "cursorPrefix") {
      this.compiledData[type] = this.data[type];
    } else if (type === "orderIsUnique") {
      this.compiledData[type] = this.data[type];
    } else if (type === "limit") {
      this.compiledData[type] = callIfNecessary(this.data[type], context);
    } else if (type === "offset") {
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
    this.lock("fixedSelectExpression");
    this.lock("selectCursor");
    this.lock("select");
  }
  /** this method is experimental */
  buildChild() {
    const options = { supportsJSONB: this.supportsJSONB };
    const child = new QueryBuilder(options, this.context, this.rootValue);
    child.parentQueryBuilder = this;
    return child;
  }
  /** this method is experimental */
  buildNamedChildSelecting(
    name: RawAlias,
    from: SQLGen,
    selectExpression: SQLGen,
    alias?: SQLAlias
  ) {
    if (this._children.has(name)) {
      throw new Error(
        `QueryBuilder already has a child named ${name.toString()}`
      );
    }
    const child = this.buildChild();
    child.from(from, alias);
    child.fixedSelectExpression(selectExpression);
    this._children.set(name, child);
    return child;
  }
  /** this method is experimental */
  getNamedChild(name: string) {
    return this._children.get(name);
  }
}

export default QueryBuilder;
