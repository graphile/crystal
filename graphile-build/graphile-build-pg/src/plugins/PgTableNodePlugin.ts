import "graphile-config";

import type {
  PgCodec,
  PgCodecWithAttributes,
  PgResource,
  PgResourceUnique,
  PgSelectSingleStep,
} from "@dataplan/pg";
import {
  access,
  constant,
  inhibitOnNull,
  list,
  type ListStep,
  type NodeIdCodec,
  type NodeIdHandler,
} from "grafast";
import { EXPORTABLE } from "graphile-build";

import { tagToString } from "../utils.ts";
import { version } from "../version.ts";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgTableNodePlugin: true;
    }
  }

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
  after: ["PgTablesPlugin", "PgPolymorphismPlugin"],

  schema: {
    behaviorRegistry: {
      add: {
        "type:node": {
          entities: ["pgCodec"],
          description:
            "should the GraphQLObjectType (`type`) this codec represents implement the GraphQL Global Object Identification specification",
        },
      },
    },
    entityBehavior: {
      pgCodec: {
        inferred: {
          provides: ["default"],
          before: ["inferred"],
          callback(behavior, codec, build) {
            const newBehavior = [behavior];
            if (
              !codec.isAnonymous &&
              !!codec.attributes &&
              (!codec.polymorphism ||
                codec.polymorphism.mode === "single" ||
                codec.polymorphism.mode === "relational")
            ) {
              const resource = build.pgTableResource(
                codec as PgCodecWithAttributes,
              );
              if (resource && resource.uniques?.length >= 1) {
                if (codec.polymorphism) {
                  newBehavior.push("interface:node");
                } else {
                  newBehavior.push("type:node");
                }
              } else {
                // Meh
              }
            }
            return newBehavior;
          },
        },
      },
    },
    hooks: {
      init(_, build) {
        if (!build.registerNodeIdHandler) {
          return _;
        }
        const {
          grafast: { access, constant, inhibitOnNull, list },
        } = build;
        const tableResources = Object.values(build.pgResources).filter(
          (resource) => {
            // TODO: if (!resourceCanSupportNode(resource)) return false;

            // Needs the 'select' and 'node' behaviours for compatibility
            return (
              !resource.parameters &&
              !resource.isUnique &&
              !resource.isVirtual &&
              !!build.behavior.pgCodecMatches(resource.codec, "type:node") &&
              !!build.behavior.pgResourceMatches(resource, "resource:select")
            );
          },
        );

        const resourcesByCodec = new Map<
          PgCodec,
          PgResource<any, any, any>[]
        >();
        for (const resource of tableResources) {
          let resourcesList = resourcesByCodec.get(resource.codec);
          if (!resourcesList) {
            resourcesList = [];
            resourcesByCodec.set(resource.codec, resourcesList);
          }
          resourcesList.push(resource);
        }

        for (const [codec, resources] of resourcesByCodec.entries()) {
          const tableTypeName = build.inflection.tableType(codec);
          const meta = build.getTypeMetaByName(tableTypeName);
          if (!meta) {
            console.trace(
              `Attempted to register node handler for '${tableTypeName}' (codec=${codec.name}), but that type wasn't registered (yet)`,
            );
            continue;
          }
          if (meta.Constructor !== build.graphql.GraphQLObjectType) {
            // Must be an interface? Skip!
            continue;
          }
          if (resources.length !== 1) {
            console.warn(
              `Found multiple table resources for codec '${codec.name}'; we don't currently support that but we _could_ - get in touch if you need this.`,
            );
            continue;
          }
          const tableResources = resources.filter((s) => !s.parameters);
          if (tableResources.length !== 1) {
            console.warn(
              `Multiple tables were found representing ${codec.name}; since we don't know which one to use, we won't use any.`,
            );
            continue;
          }
          const pgResource = tableResources[0];
          const primaryKey = (pgResource.uniques as PgResourceUnique[]).find(
            (u) => u.isPrimary === true,
          );
          if (!primaryKey) {
            continue;
          }
          const pk = primaryKey.attributes;

          const identifier =
            // Yes, this behaviour in V4 was ridiculous. Alas.
            build.options.pgV4UseTableNameForNodeIdentifier &&
            pgResource.extensions?.pg?.name
              ? build.inflection.pluralize(pgResource.extensions.pg.name)
              : tableTypeName;

          const deprecationReason = tagToString(
            codec.extensions?.tags?.deprecation ??
              pgResource?.extensions?.tags?.deprecated,
          );
          const nodeIdCodec = build.getNodeIdCodec!(
            codec.extensions?.tags?.nodeIdCodec ??
              pgResource?.extensions?.tags?.nodeIdCodec ??
              build.options?.defaultNodeIdCodec ??
              "base64JSON",
          );
          build.registerNodeIdHandler(
            EXPORTABLE(
              (
                deprecationReason,
                identifier,
                makeTableNodeIdHandler,
                nodeIdCodec,
                pgResource,
                pk,
                tableTypeName,
              ) =>
                makeTableNodeIdHandler({
                  typeName: tableTypeName,
                  identifier,
                  nodeIdCodec,
                  resource: pgResource,
                  pk,
                  ...(deprecationReason ? { deprecationReason } : null),
                }),
              [
                deprecationReason,
                identifier,
                makeTableNodeIdHandler,
                nodeIdCodec,
                pgResource,
                pk,
                tableTypeName,
              ],
            ),
          );
        }
        return _;
      },
    },
  },
};

const makeTableNodeIdHandler = EXPORTABLE(
  (access, constant, inhibitOnNull, list) =>
    ({
      typeName,
      nodeIdCodec,
      resource,
      identifier,
      pk,
      deprecationReason,
    }: {
      typeName: string;
      nodeIdCodec: NodeIdCodec;
      resource: PgResource;
      identifier: string;
      pk: readonly string[];
      deprecationReason?: string;
    }): NodeIdHandler => {
      return {
        typeName,
        codec: nodeIdCodec,
        plan($record: PgSelectSingleStep) {
          return list([
            constant(identifier, false),
            ...pk.map((attribute) => $record.get(attribute)),
          ]);
        },
        getSpec($list: ListStep<any[]>) {
          return Object.fromEntries(
            pk.map((attribute, index) => [
              attribute,
              inhibitOnNull(access($list, [index + 1])),
            ]),
          );
        },
        getIdentifiers(value) {
          return value.slice(1);
        },
        get(spec) {
          return resource.get(spec);
        },
        match(obj) {
          return obj[0] === identifier;
        },
        deprecationReason,
      };
    },
  [access, constant, inhibitOnNull, list],
);
