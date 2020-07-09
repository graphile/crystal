import sql, { SQL } from "pg-sql2";
import { Plan } from "../src";
import { FutureValue } from "../src/interfaces";

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
  private whereClauses: SQL[];
  private valuesSymbol: symbol;
  public alias: SQL;

  constructor(
    public readonly sourceName: string,
    private readonly source: SQL = sql.identifier(sourceName),
  ) {
    super();
    this.alias = sql.identifier(Symbol(sourceName));
    this.whereClauses = [];
    this.valuesSymbol = Symbol(sourceName + "_values");
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


*/
