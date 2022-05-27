import "graphile-build";
import "graphile-config";

import type { PgSelectSinglePlan, PgSource, PgTypeCodec } from "@dataplan/pg";
import type { ListPlan } from "dataplanner";
import { access, constant, list } from "dataplanner";
import { EXPORTABLE, isSafeIdentifier } from "graphile-export";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";

declare global {
  namespace GraphileBuild {
    interface GraphileBuildSchemaOptions {
      pgV4UseTableNameForNodeIdentifier?: boolean;
    }
  }
}

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
          return !!build.behavior.matches(behavior, "node", "node");
        });

        const sourcesByCodec = new Map<
          PgTypeCodec<any, any, any, any>,
          PgSource<any, any, any, any>[]
        >();
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

          const identifier =
            // Yes, this behaviour in V4 was ridiculous. Alas.
            build.options.pgV4UseTableNameForNodeIdentifier &&
            pgSource.extensions?.tags?.originalName
              ? build.inflection.pluralize(
                  pgSource.extensions?.tags?.originalName,
                )
              : tableTypeName;

          const clean =
            isSafeIdentifier(identifier) &&
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
                      identifier,
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
                  (constant, identifier, list, pk) =>
                    ($record: PgSelectSinglePlan<any, any, any, any>) => {
                      return list([
                        constant(identifier),
                        ...pk.map((column) => $record.get(column)),
                      ]);
                    },
                  [constant, identifier, list, pk],
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
              (identifier) => (obj) => {
                return obj[0] === identifier;
              },
              [identifier],
            ),
          });
        }

        return _;
      },
    },
  },
};
