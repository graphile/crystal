import "graphile-build";
import "graphile-config";

import type { PgSelectSinglePlan } from "@dataplan/pg";
import type { ListPlan } from "dataplanner";
import { access, constant, list } from "dataplanner";
import { EXPORTABLE, isSafeIdentifier } from "graphile-export";

import { getBehavior } from "../behavior";
import { version } from "../index";

export const PgTableNodePlugin: GraphileConfig.Plugin = {
  name: "PgTableNodePlugin",
  description: "Add the 'Node' interface to table types",
  version: version,

  schema: {
    hooks: {
      init(_, build) {
        const tableSources = build.input.pgSources.filter((source) => {
          if (source.codec.isAnonymous) return false;
          if (!source.codec.columns) return false;
          if (source.parameters) return false;
          if (!source.uniques) return false;
          if (!source.uniques[0]) return false;
          const behavior = getBehavior(source.extensions);
          if (behavior && !behavior.includes("node")) {
            return false;
          }
          return true;
        });

        const sourcesByCodec = new Map();
        for (const source of tableSources) {
          let list = sourcesByCodec.get(source.codec);
          if (!list) {
            list = [];
            sourcesByCodec.set(source.codec, list);
          }
          list.push(source);
        }

        for (const [codec, sources] of sourcesByCodec.entries()) {
          const tableTypeName = build.inflection.tableType(codec);
          if (sources.length !== 1) {
            console.warn(
              `Found multiple table sources for codec '${codec.name}'; we don't currently support that but we _could_ - get in touch if you need this.`,
            );
            continue;
          }
          const pgSource = sources[0];
          const pk = pgSource.uniques[0].columns as string[];

          const clean =
            isSafeIdentifier(tableTypeName) &&
            pk.every((columnName) => isSafeIdentifier(columnName));

          build.registerNodeIdHandler(tableTypeName, {
            codecName: "base64JSON",
            plan: clean
              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                EXPORTABLE(
                  new Function(
                    "list",
                    "constant",
                    `return $record => list([constant(${JSON.stringify(
                      tableTypeName,
                    )}), ${pk
                      .map(
                        (columnName) =>
                          `$record.get(${JSON.stringify(columnName)})`,
                      )
                      .join(", ")}])`,
                  ) as any,
                  [list, constant],
                )
              : EXPORTABLE(
                  (constant, list, pk, tableTypeName) =>
                    ($record: PgSelectSinglePlan<any, any, any, any>) => {
                      return list([
                        constant(tableTypeName),
                        ...pk.map((column) => $record.get(column)),
                      ]);
                    },
                  [constant, list, pk, tableTypeName],
                ),
            get: clean
              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                EXPORTABLE(
                  new Function(
                    "pgSource",
                    "access",
                    `return $list => pgSource.get({ ${pk.map(
                      (columnName, index) =>
                        `${columnName}: access($list, [${index + 1}])`,
                    )} })`,
                  ) as any,
                  [pgSource, access],
                )
              : EXPORTABLE(
                  (access, pgSource, pk) => ($list: ListPlan<any[]>) => {
                    const spec = pk.reduce((memo, column, index) => {
                      memo[column] = access($list, [index + 1]);
                      return memo;
                    }, {});
                    return pgSource.get(spec);
                  },
                  [access, pgSource, pk],
                ),
            match: EXPORTABLE(
              (tableTypeName) => (obj) => {
                return obj[0] === tableTypeName;
              },
              [tableTypeName],
            ),
          });
        }

        return _;
      },
    },
  },
};
