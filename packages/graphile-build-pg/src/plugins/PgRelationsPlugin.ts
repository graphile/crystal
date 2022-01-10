import "graphile-build";

import {
  PgSelectSinglePlan,
  PgSource,
  PgSourceBuilder,
  PgSourceRelation,
  PgTypeCodec,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";

import { version } from "../index.js";
import { GraphQLObjectType } from "graphql";

declare global {
  namespace GraphileEngine {
    interface Inflection {
      singleRelation(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
          codec: PgTypeCodec<any, any, any>;
          identifier: string;
          relation: PgSourceRelation<any, any>;
        },
      ): string;
    }
  }
}

export const PgRelationsPlugin: Plugin = {
  name: "PgRelationsPlugin",
  description: "Creates links between types representing PostgreSQL tables",
  version,
  schema: {
    hooks: {
      inflection(inflection, build) {
        return build.extend(
          inflection,
          {
            singleRelation(details) {
              return this.camelCase(details.identifier);
            },
          },
          "Adding inflectors from PgForwardRelationPlugin",
        );
      },
      GraphQLObjectType_fields(fields, build, context) {
        const { extend } = build;
        const {
          Self,
          scope: { isPgTableType, pgCodec: codec },
          fieldWithHooks,
        } = context;
        if (!isPgTableType || !codec) {
          return fields;
        }
        const source = build.input.pgSources.find((s) => s.codec === codec);
        if (!source) {
          return fields;
        }
        const relations: {
          [identifier: string]: PgSourceRelation<any, any>;
        } = source.getRelations();
        return Object.entries(relations).reduce(
          (memo, [identifier, relation]) => {
            const {
              isUnique,
              localColumns,
              remoteColumns,
              source: otherSourceOrBuilder,
            } = relation;
            const otherSource =
              otherSourceOrBuilder instanceof PgSourceBuilder
                ? otherSourceOrBuilder.get()
                : otherSourceOrBuilder;
            const otherCodec = otherSource.codec;
            const typeName = build.inflection.tableType(otherCodec);
            const OtherType = build.getOutputTypeByName(typeName);
            if (!OtherType) {
              return memo;
            }
            let fields = memo;
            // TODO: add behaviour check here!
            if (isUnique) {
              const fieldName = build.inflection.singleRelation({
                source,
                codec,
                identifier,
                relation,
              });
              fields = extend(
                fields,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
                    },
                    {
                      type: OtherType as GraphQLObjectType,
                      plan: EXPORTABLE(
                        (localColumns, otherSource, remoteColumns) =>
                          function plan(
                            $message: PgSelectSinglePlan<any, any, any, any>,
                          ) {
                            const spec = remoteColumns.reduce(
                              (memo, remoteColumnName, i) => {
                                memo[remoteColumnName] = $message.get(
                                  localColumns[i] as string,
                                );
                                return memo;
                              },
                              {},
                            );
                            return otherSource.get(spec);
                          },
                        [localColumns, otherSource, remoteColumns],
                      ),
                    },
                  ),
                },
                `Adding '${identifier}' relation to ${Self.name}`,
              );
            }
            return fields;
          },
          fields,
        );
      },
    },
  },
};
