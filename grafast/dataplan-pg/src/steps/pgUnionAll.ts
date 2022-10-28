import { ExecutableStep, PolymorphicStep } from "grafast";
import { GraphQLObjectType } from "graphql";
import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgTypeColumns } from "../codecs.js";
import { TYPES } from "../codecs.js";
import type { PgSource, PgSourceUnique } from "../datasource.js";
import type { PgTypeCodec } from "../interfaces.js";
import { PgClassExpressionStep } from "./pgClassExpression.js";
import { PgPolymorphicStep } from "./pgPolymorphic.js";

type PgUnionAllStepSelect<TAttributes extends string> =
  | { type: "attribute"; attribute: TAttributes }
  | { type: "pk" }
  | { type: "type" };

interface PgUnionAllStepConfig<TAttributes extends string> {
  attributes: {
    [attributeName in TAttributes]: {
      codec: PgTypeCodec<any, any, any>;
    };
  };
  sources: {
    [sourceName: string]: {
      source: PgSource<any, ReadonlyArray<PgSourceUnique<any>>, any, any>;
    };
  };
}

interface PgUnionAllStepCondition<TAttributes extends string> {
  attribute: TAttributes;
  callback: (fragment: SQL) => SQL;
}

interface PgUnionAllStepOrder<TAttributes extends string> {
  attribute: TAttributes;
  direction: "ASC" | "DESC";
}

/**
 * Represents a `UNION ALL` statement, which can have multiple table-like
 * sources, but must return a consistent data shape.
 */
export class PgUnionAllStep<TAttributes extends string> extends ExecutableStep {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgUnionAllStep",
  };
  private selects: PgUnionAllStepSelect<TAttributes>[] = [];
  private conditions: PgUnionAllStepCondition<TAttributes>[] = [];
  private orders: PgUnionAllStepOrder<TAttributes>[] = [];

  constructor(private spec: PgUnionAllStepConfig<TAttributes>) {
    super();
  }

  select<TAttribute extends TAttributes>(key: TAttribute): number {
    if (!Object.prototype.hasOwnProperty.call(this.spec.attributes, key)) {
      throw new Error(`Attribute '${key}' unknown`);
    }
    const existingIndex = this.selects.findIndex(
      (s) => s.type === "attribute" && s.attribute === key,
    );
    if (existingIndex >= 0) {
      return existingIndex;
    }
    const index = this.selects.push({ type: "attribute", attribute: key }) - 1;
    return index;
  }

  selectPk(): number {
    const existingIndex = this.selects.findIndex((s) => s.type === "pk");
    if (existingIndex >= 0) {
      return existingIndex;
    }
    const index = this.selects.push({ type: "pk" }) - 1;
    return index;
  }

  selectType(): number {
    const existingIndex = this.selects.findIndex((s) => s.type === "type");
    if (existingIndex >= 0) {
      return existingIndex;
    }
    const index = this.selects.push({ type: "type" }) - 1;
    return index;
  }

  where(spec: PgUnionAllStepCondition<TAttributes>): void {
    this.conditions.push(spec);
  }

  orderBy(spec: PgUnionAllStepOrder<TAttributes>): void {
    this.orders.push(spec);
  }

  finalize() {
    const outerOrderExpressions = this.orders.map((o) => {
      return sql`${sql.identifier(String(this.select(o.attribute)))} ${
        o.direction === "DESC" ? sql`desc` : sql`asc`
      }`;
    });
    const typeIdx = this.selectType();
    const rowNumberAlias = "n";
    const rowNumberIdent = sql.identifier(rowNumberAlias);

    const tables: SQL[] = [];

    for (const [identifier, sourceSpec] of Object.entries(this.spec.sources)) {
      const sqlSource = sql.isSQL(sourceSpec.source.source)
        ? sourceSpec.source.source
        : null; // sourceSpec.source.source(/* TODO: ADD PARAMETERS! */);
      if (!sqlSource) {
        throw new Error(`${this}: parameterized sources not yet supported`);
      }

      // In future we'll allow mapping columns to different attributes/types
      const sourceSpecificExpressionFromAttributeName = (name: string): SQL => {
        return sql.identifier(name);
      };

      const tableAlias = sql.identifier(identifier);
      const pk = sourceSpec.source.uniques?.find((u) => u.isPrimary === true);
      const outerSelects: SQL[] = [];
      const innerSelects = this.selects.map((s, selectIndex) => {
        const [frag, codec] = ((): [SQL, PgTypeCodec<any, any, any, any>] => {
          switch (s.type) {
            case "attribute": {
              const attr = this.spec.attributes[s.attribute];
              return [
                sql`${tableAlias}.${sourceSpecificExpressionFromAttributeName(
                  s.attribute,
                )}`,
                attr.codec,
              ];
            }
            case "type": {
              return [sql.literal(identifier), TYPES.text];
            }
            case "pk": {
              if (!pk) {
                throw new Error(`No PK for ${identifier} source in ${this}`);
              }
              return [
                sql`json_build_array(${sql.join(
                  pk.columns.map(
                    (c) => sql`(${tableAlias}.${sql.identifier(c)})::text`,
                  ),
                  ",",
                )})`,
                TYPES.json,
              ];
            }
          }
        })();
        const alias = String(selectIndex);
        const ident = sql.identifier(alias);
        const fullIdent = sql`${tableAlias}.${ident}`;
        outerSelects.push(
          codec.castFromPg?.(fullIdent) ?? sql`${fullIdent}::text`,
        );
        return sql`${frag} as ${ident}`;
      });
      outerSelects.push(rowNumberIdent);
      innerSelects.push(
        sql`row_number() over (partition by 1) as ${rowNumberIdent}`,
      );

      const conditions = this.conditions.map((c) => {
        const ident = sql`${tableAlias}.${sourceSpecificExpressionFromAttributeName(
          c.attribute,
        )}`;
        return c.callback(ident);
      });

      const orders = this.orders.map((c) => {
        const ident = sql`${tableAlias}.${sourceSpecificExpressionFromAttributeName(
          c.attribute,
        )}`;
        return sql`${ident} ${c.direction === "DESC" ? sql`desc` : sql`asc`}`;
      });

      const query = sql.indent`\
select
${sql.indent(sql.join(outerSelects, ",\n"))}
from (${sql.indent`
select
${sql.indent(sql.join(innerSelects, ",\n"))}
from ${sqlSource} as ${tableAlias}
${
  conditions.length > 0
    ? sql`where ${sql.join(conditions, `\nand `)}\n`
    : sql.blank
}\
${orders.length > 0 ? sql`where ${sql.join(orders, `,\n`)}\n` : sql.blank}\
limit ...\
`}
) as ${tableAlias}\
`;
      tables.push(query);
    }

    const finalQuery = sql`${sql.join(
      tables,
      `
union all
`,
    )}
order by${sql.indent`
${
  outerOrderExpressions.length
    ? sql`${sql.join(outerOrderExpressions, ",\n")}},\n`
    : sql.blank
}\
${rowNumberIdent} asc,
${sql.identifier(String(typeIdx))} asc\
`}
limit ...
offset ...
`;
  }

  execute() {}
}

export function pgUnionAll<TAttributes extends string>(
  spec: PgUnionAllStepConfig<TAttributes>,
): PgUnionAllStep<TAttributes> {
  return new PgUnionAllStep(spec);
}
