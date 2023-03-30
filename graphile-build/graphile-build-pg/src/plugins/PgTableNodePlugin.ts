import "graphile-build";
import "graphile-config";

import type {
  PgCodec,
  PgResource,
  PgResourceUnique,
  PgSelectSingleStep,
} from "@dataplan/pg";
import type { ListStep } from "grafast";
import { access, constant, list } from "grafast";
import { EXPORTABLE } from "graphile-export";
import te, { isSafeObjectPropertyName } from "tamedevil";

import { getBehavior } from "../behavior.js";
import { tagToString } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
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
        if (!build.registerNodeIdHandler) {
          return _;
        }
        const tableSources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((source) => {
          if (source.codec.isAnonymous) return false;
          if (!source.codec.columns) return false;
          if (source.codec.polymorphism) return false;
          if (source.parameters) return false;
          if (!source.uniques) return false;
          if (!source.uniques[0]) return false;
          const behavior = getBehavior([
            source.codec.extensions,
            source.extensions,
          ]);
          // Needs the 'select' and 'node' behaviours for compatibility
          return (
            !!build.behavior.matches(behavior, "node", "node") &&
            !!build.behavior.matches(behavior, "select", "select")
          );
        });

        const sourcesByCodec = new Map<
          PgCodec<any, any, any, any, any, any, any>,
          PgResource<any, any, any, any, any>[]
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
          const primaryKey = (pgSource.uniques as PgResourceUnique[]).find(
            (u) => u.isPrimary === true,
          );
          if (!primaryKey) {
            continue;
          }
          const pk = primaryKey.columns;

          const identifier =
            // Yes, this behaviour in V4 was ridiculous. Alas.
            build.options.pgV4UseTableNameForNodeIdentifier &&
            pgSource.extensions?.pg?.name
              ? build.inflection.pluralize(pgSource.extensions.pg.name)
              : tableTypeName;

          const clean =
            isSafeObjectPropertyName(identifier) &&
            pk.every((columnName) => isSafeObjectPropertyName(columnName));

          const firstSource = sources.find((s) => !s.parameters);

          build.registerNodeIdHandler({
            typeName: tableTypeName,
            codecName: "base64JSON",
            deprecationReason: tagToString(
              codec.extensions?.tags?.deprecation ??
                firstSource?.extensions?.tags?.deprecated,
            ),
            plan: clean
              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                EXPORTABLE(
                  te.run`\
return function (list, constant) {
  return $record => list([constant(${te.lit(identifier)}), ${te.join(
                    pk.map(
                      (columnName) => te`$record.get(${te.lit(columnName)})`,
                    ),
                    ", ",
                  )}]);
}` as any,
                  [list, constant],
                )
              : EXPORTABLE(
                  (constant, identifier, list, pk) =>
                    ($record: PgSelectSingleStep<any>) => {
                      return list([
                        constant(identifier),
                        ...pk.map((column) => $record.get(column)),
                      ]);
                    },
                  [constant, identifier, list, pk],
                ),
            getSpec: clean
              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                EXPORTABLE(
                  te.run`\
return function (access) {
  return $list => ({ ${te.join(
    pk.map(
      (columnName, index) =>
        te`${te.dangerousKey(columnName)}: access($list, [${te.lit(
          index + 1,
        )}])`,
    ),
    ", ",
  )} });
}` as any,
                  [access],
                )
              : EXPORTABLE(
                  (access, pk) => ($list: ListStep<any[]>) => {
                    const spec = pk.reduce((memo, column, index) => {
                      memo[column] = access($list, [index + 1]);
                      return memo;
                    }, Object.create(null));
                    return spec;
                  },
                  [access, pk],
                ),
            get: EXPORTABLE(
              (pgSource) => (spec: any) => pgSource.get(spec),
              [pgSource],
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
