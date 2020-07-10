import sql, { SQL } from "pg-sql2";
import { Plan } from "../src";
import { FutureValue } from "../src/future";

export class ConnectionPlan extends Plan {
  constructor(public readonly subplan: Plan) {
    super();
  }

  executeWith(deps: any) {
    /*
     * Connection doesn't do anything itself; so `connection { __typename }` is
     * basically a no-op. However subfields will need access to the deps so
     * that they may determine which fetched rows relate to them.
     */
    return { ...deps };
  }
}

export class PgConnectionPlan extends ConnectionPlan {
  constructor(public readonly subplan: PgSelectPlan) {
    super(subplan);
  }
}

class PgSelectPlan extends Plan {
  private selections: SQL[];
  private whereClauses: SQL[];

  private valuesSymbol: symbol;
  private aliasSymbol: symbol;
  public alias: SQL;

  constructor(
    public readonly sourceName: string,
    private readonly source: SQL = sql.identifier(sourceName),
  ) {
    super();

    this.aliasSymbol = Symbol(sourceName);
    this.alias = sql.identifier(this.aliasSymbol);
    this.valuesSymbol = Symbol(sourceName + "_values");

    this.selections = [];
    this.whereClauses = [];
  }

  select(field) {
    this.selections.push(sql.identifier(this.aliasSymbol, field));
  }

  identify(
    identifiersSubquery: SQL,
    clauseCallback: (identifiersTable: SQL) => SQL,
  ) {
    // TODO: MUST ONLY IDENTIFY ONCE!
    const identifiersSubqueryAlias = sql.identifier(
      Symbol(this.sourceName + "_identifiers"),
    );

    this.innerJoin(
      identifiersSubquery,
      identifiersSubqueryAlias,
      clauseCallback(identifiersSubqueryAlias),
    );
  }

  addValue(name: string, value: FutureValue) {
    this.enableValues();
    throw new Error("TODO");
    /* TODO */
  }

  where(clause: SQL) {
    this.whereClauses.push(clause);
  }

  values(name: string) {
    return sql.identifier(this.valuesSymbol, name);
  }

  enableValues() {
    this.joins.push(
      sql`(select unnest(${todoValues})) as ${sql.identifier(
        this.valuesSymbol,
      )} (${todoNames})`,
    );
    /*

    Two types of values:

    From raw data:

      select reqs.id, ... 
      from messages, 
      (select unnest($1[, $2])) values(id[, etc])
      where values.id = messages.forum_id

    From other queries:

      select reqs.id, ... 
      from messages, 
      (select id from __forums_0__) values(id)
      where values.id = messages.forum_id

    We might end up with both.

    */
  }
}

class SQLCapableFutureValue<TEntry = unknown> extends FutureValue<TEntry> {
  private aliasSymbol: symbol;
  private alias: SQL;

  constructor(selection, private source: SQL) {
    super(selection);
    this.aliasSymbol = Symbol("TODO");
    this.alias = sql.identifier(this.aliasSymbol);
  }

  toSQL(): SQL {
    return sql.fragment`select ${sql.join(
      this.selection.map((field) =>
        sql.identifier(this.aliasSymbol, field as string),
      ),
    )} from ${this.source} as ${this.alias}`;
  }

  get<TNewKeys extends keyof TEntry>(
    newSelection: Array<TNewKeys>,
  ): SQLCapableFutureValue<Pick<TEntry, TNewKeys>> {
    return new SQLCapableFutureValue(newSelection, this.source);
  }

  eval(): Promise<ReadonlyArray<TEntry>> {
    /* TODO */
    return Promise.resolve([]);
  }
}

function isSQLCapable<TEntry, T extends FutureValue<TEntry>>(
  val: T,
): val is SQLCapableFutureValue<TEntry> {
  return "toSQL" in val && typeof val.toSQL === "function";
}

export const toSQL = ($val: FutureValue): SQL | Promise<SQL> => {
  if (isSQLCapable($val)) {
    return $val.toSQL();
  } else {
    return $val
      .eval()
      .then(
        (entries) =>
          sql.fragment`select i from json_array_elements(${sql.value(
            JSON.stringify(entries),
          )})`,
      );
  }
};

export const forumLoader = {
  fetchMany() {
    return new PgSelectPlan("forums");
  },
};

export const messageLoader = {
  fetchMany() {
    return new PgSelectPlan("messages");
  },
};

export const userLoader = {
  fetchMany() {
    return new PgSelectPlan("users");
  },
  fetchById($id: FutureValue) {
    const plan = new PgSelectPlan("users");
    plan.select("id");
    plan.where(sql`${plan.alias}.id in (${toSQL($id)})`);
    /*
      select
        __local_8__.id,
        __local_8__."name"
      from "public"."genres" as __local_8__
      where __local_8__."id" in (
        -- Single record, direct PK lookup
        select genre_id from "@trackByTrackId"
      )
    */
  },
};

/*

argPlan:

  $stripeCustomerId = stripeCustomerIdForForum($r.get("id"))
  $activeStripePlan = Dataloader.stripeCustomer($stripeCustomerId).getPlans()
  p.addValue("stripe_plan_active", $activeStripePlan)
  p.clause(sql`${p.values("stripe_plan_active")} = true`)

forums:
  $forums = forumLoader.fetchMany()

  name:
    <deps> $forums.req(["name"])

  messagesConnection:
    <deps> $forums.req(["id"]) 

    $messagesPlan = messagesLoader.fetchMany()
    $messagesPlan.addValue("id", $r.get("id"))
    $messagesPlan.where(sql`messages.forum_id = ${$messagesPlan.dep("id")}`) (dependency "id")
    $messageConnectionPlan = connection(p)

    <implicit> $r = $forums.futureRecord()

    <planAugmentation>
    $stripeCustomerId = stripeCustomerIdForForum($r.get("id"))
    $stripeCustomer = stripeLoader.fetchCustomer($stripeCustomerId) -> nextTick -> $stripeCustomerId.eval()
    $activeStripePlan = $stripeCustomer.fetchActivePlan()
    $activeStripePlanExists = $activeStripePlan.exists();
    $messageConnectionPlan.subplan.addValue($r, "stripe_plan_active", $activeStripePlanExists) -> nextTick -> $activeStripePlan.eval()
    $messageConnectionPlan.subplan.where(sql`${p.values("stripe_plan_active")} is true`)



// "deps" is the identifier; it's used to group everything, and is later used to
// ungroup from the dataloader again. **only** the deps for that specific field
// are used.


// THIS IS WRONG - the limit is in the wrong place, it should be per-deps:

select row_to_json(deps) as @@deps, row_number() over (partition by 1) as @@row, ...
from messages
inner join (
  select distinct -- distinct is an optimization (maybe)
    id
  from __forums_0__
) as deps (id)
on (messages.forum_id = deps.id)
left join (
  select distinct on (values->id) -- distinct may be require to guarantee exactly one match per id
    values->id,
    values->stripe_plan_active
  from json_array_elements($1) values
) as values (id, stripe_plan_active)
on (values.id = deps.id)
where ...
order by ...
limit ...
offset ...


select json_object_agg(row_to_json(identifiers)::string, (
  select json_agg(
    json_build_object(...)
    order by ...
  )
  from messages
  left join (
    select distinct on (values->id) -- distinct may be require to guarantee exactly one match per id
      values->id,
      values->stripe_plan_active
    from json_array_elements($1) values
  ) as values (id, stripe_plan_active)
  on (values.id = identifiers.id)
  where (messages.forum_id = identifiers.id) -- JOIN CLAUSE
  limit ...
  offset ...
)
from (
  select distinct -- distinct is an optimization (maybe)
    id
  from __forums_0__
) as identifiers (id)


select row_to_json(identifiers) as @@identifiers, row_number() over (partition by 1) as @@row, ...
from messages
inner join (
  select distinct -- distinct is an optimization (maybe)
    id
  from __forums_0__
) as identifiers (id)
on (messages.forum_id = identifiers.id)
left join (
  select distinct on (values->id) -- distinct may be require to guarantee exactly one match per id
    values->id,
    values->stripe_plan_active
  from json_array_elements($1) values
) as values (id, stripe_plan_active)
on (values.id = identifiers.id)
where ...
order by ...
limit ...
offset ...


*/
