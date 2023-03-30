import "graphile-config";
import "./PgCodecsPlugin.js";
import "./PgProceduresPlugin.js";
import "./PgRelationsPlugin.js";
import "./PgTablesPlugin.js";

import type {
  PgCodec,
  PgCodecAny,
  PgCodecExtensions,
  PgCodecPolymorphism,
  PgCodecPolymorphismRelational,
  PgCodecPolymorphismRelationalTypeSpec,
  PgCodecPolymorphismSingle,
  PgCodecPolymorphismSingleTypeColumnSpec,
  PgCodecPolymorphismSingleTypeSpec,
  PgCodecRef,
  PgCodecRelation,
  PgRefDefinition,
  PgResource,
  PgResourceOptions,
  PgTypeColumn,
} from "@dataplan/pg";
import { arraysMatch, ExecutableStep } from "grafast";
import type {
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
} from "graphql";

import { getBehavior } from "../behavior.js";
import {
  parseDatabaseIdentifierFromSmartTag,
  parseSmartTagsOptsString,
} from "../utils.js";
import { version } from "../version.js";

function isNotNullish<T>(v: T | null | undefined): v is T {
  return v != null;
}

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgPolymorphism: Record<string, never>;
    }
  }
  namespace GraphileBuild {
    interface ScopeInterface {
      pgCodec?: PgCodec<any, any, any, any>;
      isPgPolymorphicTableType?: boolean;
      pgPolymorphism?: PgCodecPolymorphism<string>;
    }
    interface ScopeObject {
      pgPolymorphism?: PgCodecPolymorphism<string>;
      pgPolymorphicSingleTableType?: {
        typeIdentifier: string;
        name: string;
        columns: ReadonlyArray<PgCodecPolymorphismSingleTypeColumnSpec<any>>;
      };
      pgPolymorphicRelationalType?: {
        typeIdentifier: string;
        name: string;
      };
    }
  }
}

function parseColumn(
  colSpec: string,
): PgCodecPolymorphismSingleTypeColumnSpec<any> {
  let spec = colSpec;
  let isNotNull = false;
  if (spec.endsWith("!")) {
    spec = spec.substring(0, spec.length - 1);
    isNotNull = true;
  }
  const [a, b] = spec.split(">");
  return {
    column: a,
    isNotNull,
    rename: b,
  };
}

export const PgPolymorphismPlugin: GraphileConfig.Plugin = {
  name: "PgPolymorphismPlugin",
  description: "Adds polymorphism",
  version,
  after: ["smart-tags", "PgTablesPlugin", "PgCodecsPlugin"],
  gather: {
    namespace: "pgPolymorphism",
    helpers: {},
    hooks: {
      async pgCodecs_recordType_spec(info, event) {
        const { pgClass, spec, databaseName } = event;
        const extensions: PgCodecExtensions =
          spec.extensions ?? Object.create(null);
        if (!spec.extensions) {
          spec.extensions = extensions;
        }
        const interfaceTag =
          extensions.tags.interface ?? pgClass.getTags().interface;
        if (interfaceTag) {
          if (typeof interfaceTag !== "string") {
            throw new Error(
              "Invalid 'interface' smart tag; string expected. Did you add too many?",
            );
          }
          const { params } = parseSmartTagsOptsString<"type" | "mode" | "name">(
            interfaceTag,
            0,
          );
          switch (params.mode) {
            case "single": {
              const { type = "type" } = params;
              const attr = pgClass.getAttribute({ name: type });
              if (!attr) {
                throw new Error(
                  `Invalid '@interface' smart tag - there is no '${type}' column on ${
                    pgClass.getNamespace()!.nspname
                  }.${pgClass.relname}`,
                );
              }

              const rawTypeTags = extensions.tags.type;
              const typeTags = Array.isArray(rawTypeTags)
                ? rawTypeTags.map((t) => String(t))
                : [String(rawTypeTags)];

              const attributeNames = pgClass
                .getAttributes()
                .filter((a) => a.attnum >= 1)
                .map((a) => a.attname);

              const types: PgCodecPolymorphismSingle<any>["types"] =
                Object.create(null);
              const specificColumns = new Set<string>();
              for (const typeTag of typeTags) {
                const {
                  args: [typeValue],
                  params: { name, columns },
                } = parseSmartTagsOptsString<"name" | "columns">(typeTag, 1);
                if (!name) {
                  throw new Error(`Every type must have a name`);
                }
                types[typeValue] = {
                  name,
                  columns: columns?.split(",").map(parseColumn) ?? [],
                };
                for (const col of types[typeValue].columns) {
                  specificColumns.add(col.column);
                }
              }

              const commonColumns = attributeNames.filter(
                (n) => !specificColumns.has(n),
              );
              spec.polymorphism = {
                mode: "single",
                commonColumns,
                typeColumns: [type],
                types,
              };
              break;
            }
            case "relational": {
              const { type = "type" } = params;
              const attr = pgClass.getAttribute({ name: type });
              if (!attr) {
                throw new Error(
                  `Invalid '@interface' smart tag - there is no '${type}' column on ${
                    pgClass.getNamespace()!.nspname
                  }.${pgClass.relname}`,
                );
              }

              const rawTypeTags = extensions.tags.type;
              const typeTags = Array.isArray(rawTypeTags)
                ? rawTypeTags.map((t) => String(t))
                : [String(rawTypeTags)];

              const types: PgCodecPolymorphismRelational<any>["types"] =
                Object.create(null);
              for (const typeTag of typeTags) {
                const {
                  args: [typeValue],
                  params: { references },
                } = parseSmartTagsOptsString<"references">(typeTag, 1);
                if (!references) {
                  throw new Error(
                    `@type of an @interface(mode:relational) must have a 'references:' parameter`,
                  );
                }
                const [namespaceName, tableName] =
                  parseDatabaseIdentifierFromSmartTag(
                    references,
                    2,
                    pgClass.getNamespace()?.nspname,
                  );
                const referencedClass =
                  await info.helpers.pgIntrospection.getClassByName(
                    databaseName,
                    namespaceName,
                    tableName,
                  );
                if (!referencedClass) {
                  throw new Error(
                    `Could not find referenced class '${namespaceName}.${tableName}'`,
                  );
                }
                const pk = pgClass
                  .getConstraints()
                  .find((c) => c.contype === "p");
                const remotePk = referencedClass
                  .getConstraints()
                  .find((c) => c.contype === "p");
                const pgConstraint = referencedClass.getConstraints().find(
                  (c) =>
                    // TODO: this isn't safe, we should also check that the columns match up
                    c.contype === "f" && c.confrelid === pgClass._id,
                );
                if (!pk || !remotePk || !pgConstraint) {
                  throw new Error(
                    "Could not build polymorphic reference due to missing primary key or foreign key constraint",
                  );
                }
                const codec = await info.helpers.pgCodecs.getCodecFromClass(
                  databaseName,
                  referencedClass._id,
                );
                types[typeValue] = {
                  name: info.inflection.tableType(codec!),
                  references,
                  relationName: info.inflection.resourceRelationName({
                    databaseName,
                    isReferencee: true,
                    isUnique: true,
                    localClass: pgClass,
                    localColumns: pk.getAttributes()!,
                    foreignClass: referencedClass,
                    foreignColumns: remotePk.getAttributes()!,
                    pgConstraint,
                  }),
                };
              }

              spec.polymorphism = {
                mode: "relational",
                typeColumns: [type],
                types,
              };
              break;
            }
            case "union": {
              spec.polymorphism = {
                mode: "union",
              };
              break;
            }
            default: {
              throw new Error(`Unsupported (or not provided) @interface mode`);
            }
          }
        }
      },
      async pgBasics_PgRegistryBuilder_finalize(info, event) {
        const { registryBuilder } = event;
        const registry = registryBuilder.getRegistryConfig();
        for (const source of Object.values(
          registry.pgResources,
        ) as PgResourceOptions<any, any, any, any>[]) {
          if (source.parameters || !source.codec.columns) {
            continue;
          }
          if (!source.extensions?.pg) {
            continue;
          }
          const {
            schemaName: sourceSchemaName,
            databaseName,
            name: sourceClassName,
          } = source.extensions.pg;

          const pgClass = await info.helpers.pgIntrospection.getClassByName(
            databaseName,
            sourceSchemaName,
            sourceClassName,
          );
          if (!pgClass) {
            continue;
          }

          const poly = (source.codec as PgCodecAny).polymorphism;
          if (poly?.mode === "relational") {
            // Copy common attributes to implementations
            for (const spec of Object.values(poly.types)) {
              const [schemaName, tableName] =
                parseDatabaseIdentifierFromSmartTag(
                  spec.references,
                  2,
                  sourceSchemaName,
                );
              const pgRelatedClass =
                await info.helpers.pgIntrospection.getClassByName(
                  databaseName,
                  schemaName,
                  tableName,
                );
              if (!pgRelatedClass) {
                throw new Error(
                  `Invalid reference to '${spec.references}' - cannot find that table (${schemaName}.${tableName})`,
                );
              }
              const otherCodec = await info.helpers.pgCodecs.getCodecFromClass(
                databaseName,
                pgRelatedClass._id,
              );
              if (!otherCodec) {
                continue;
              }
              const pk = pgRelatedClass
                .getConstraints()
                .find((c) => c.contype === "p");
              if (!pk) {
                throw new Error(
                  `Invalid polymorphic relation; ${pgRelatedClass.relname} has no primary key`,
                );
              }
              const remotePk = pgClass
                .getConstraints()
                .find((c) => c.contype === "p");
              if (!remotePk) {
                throw new Error(
                  `Invalid polymorphic relation; ${pgClass.relname} has no primary key`,
                );
              }
              const pgConstraint = pgRelatedClass
                .getConstraints()
                .find(
                  (c) =>
                    c.contype === "f" &&
                    c.confrelid === pgClass._id &&
                    arraysMatch(
                      c.getForeignAttributes()!,
                      remotePk.getAttributes()!,
                    ) &&
                    arraysMatch(c.getAttributes()!, pk.getAttributes()!),
                );
              if (!pgConstraint) {
                throw new Error(
                  `Invalid polymorphic relation; could not find matching relation between ${pgClass.relname} and ${pgRelatedClass.relname}`,
                );
              }
              const sharedRelationName = info.inflection.resourceRelationName({
                databaseName,
                isReferencee: false,
                isUnique: true,
                localClass: pgRelatedClass,
                localColumns: pk.getAttributes()!,
                foreignClass: pgClass,
                foreignColumns: remotePk.getAttributes()!,
                pgConstraint,
              });

              for (const [colName, colSpec] of Object.entries(
                source.codec.columns,
              ) as Array<[string, PgTypeColumn]>) {
                if (otherCodec.columns[colName]) {
                  otherCodec.columns[colName].identicalVia = sharedRelationName;
                } else {
                  otherCodec.columns[colName] = {
                    codec: colSpec.codec,
                    notNull: colSpec.notNull,
                    hasDefault: colSpec.hasDefault,
                    via: sharedRelationName,
                    restrictedAccess: colSpec.restrictedAccess,
                    description: colSpec.description,
                    extensions: { ...colSpec.extensions },
                  };
                }
              }
            }
          }
        }
      },

      async pgBasics_PgRegistry(info, event) {
        // We're creating 'refs' for the polymorphism. This needs to use the
        // same relationship names as we will in the GraphQL schema, so we need
        // to use the final PgRegistry, not the PgRegistryBuilder.

        const { registry } = event;
        for (const resource of Object.values(
          registry.pgResources,
        ) as PgResource<any, any, any, any, any>[]) {
          if (resource.parameters || !resource.codec.columns) {
            continue;
          }
          if (!resource.extensions?.pg) {
            continue;
          }
          const {
            schemaName: sourceSchemaName,
            databaseName,
            name: sourceClassName,
          } = resource.extensions.pg;

          const pgClass = await info.helpers.pgIntrospection.getClassByName(
            databaseName,
            sourceSchemaName,
            sourceClassName,
          );
          if (!pgClass) {
            continue;
          }

          const relations = registry.pgRelations[resource.codec.name] as {
            [relationName: string]: PgCodecRelation<any, any>;
          };
          const poly = (resource.codec as PgCodecAny).polymorphism;
          if (poly?.mode === "relational") {
            // Copy common attributes to implementations
            for (const spec of Object.values(poly.types)) {
              const [schemaName, tableName] =
                parseDatabaseIdentifierFromSmartTag(
                  spec.references,
                  2,
                  sourceSchemaName,
                );
              const pgRelatedClass =
                await info.helpers.pgIntrospection.getClassByName(
                  databaseName,
                  schemaName,
                  tableName,
                );
              if (!pgRelatedClass) {
                throw new Error(
                  `Invalid reference to '${spec.references}' - cannot find that table (${schemaName}.${tableName})`,
                );
              }
              const otherCodec = await info.helpers.pgCodecs.getCodecFromClass(
                databaseName,
                pgRelatedClass._id,
              );
              if (!otherCodec) {
                continue;
              }
              const pk = pgRelatedClass
                .getConstraints()
                .find((c) => c.contype === "p");
              if (!pk) {
                throw new Error(
                  `Invalid polymorphic relation; ${pgRelatedClass.relname} has no primary key`,
                );
              }
              const remotePk = pgClass
                .getConstraints()
                .find((c) => c.contype === "p");
              if (!remotePk) {
                throw new Error(
                  `Invalid polymorphic relation; ${pgClass.relname} has no primary key`,
                );
              }
              const pgConstraint = pgRelatedClass
                .getConstraints()
                .find(
                  (c) =>
                    c.contype === "f" &&
                    c.confrelid === pgClass._id &&
                    arraysMatch(
                      c.getForeignAttributes()!,
                      remotePk.getAttributes()!,
                    ) &&
                    arraysMatch(c.getAttributes()!, pk.getAttributes()!),
                );
              if (!pgConstraint) {
                throw new Error(
                  `Invalid polymorphic relation; could not find matching relation between ${pgClass.relname} and ${pgRelatedClass.relname}`,
                );
              }
              const sharedRelationName = info.inflection.resourceRelationName({
                databaseName,
                isReferencee: false,
                isUnique: true,
                localClass: pgRelatedClass,
                localColumns: pk.getAttributes()!,
                foreignClass: pgClass,
                foreignColumns: remotePk.getAttributes()!,
                pgConstraint,
              });

              const otherResourceOptions =
                await info.helpers.pgTables.getResourceOptions(
                  databaseName,
                  pgRelatedClass,
                );

              for (const [relationName, relationSpec] of Object.entries(
                relations,
              )) {
                const behavior =
                  getBehavior([
                    relationSpec.remoteResource.codec.extensions,
                    relationSpec.remoteResource.extensions,
                    relationSpec.extensions,
                  ]) ?? "";
                const relationDetails: GraphileBuild.PgRelationsPluginRelationDetails =
                  {
                    resource,
                    relationName,
                  };
                const singleRecordFieldName = relationSpec.isReferencee
                  ? info.inflection.singleRelationBackwards(relationDetails)
                  : info.inflection.singleRelation(relationDetails);
                const connectionFieldName =
                  info.inflection.manyRelationConnection(relationDetails);
                const listFieldName =
                  info.inflection.manyRelationList(relationDetails);
                const definition: PgRefDefinition = {
                  singular: relationSpec.isUnique,
                  singleRecordFieldName,
                  listFieldName,
                  connectionFieldName,
                  extensions: {
                    tags: {
                      behavior,
                    },
                  },
                };
                const ref: PgCodecRef = {
                  definition,
                  paths: [
                    [
                      {
                        relationName: sharedRelationName,
                      },
                      { relationName },
                    ],
                  ],
                };
                if (!otherResourceOptions!.codec.refs) {
                  otherResourceOptions!.codec.refs = Object.create(
                    null,
                  ) as Record<string, any>;
                }
                otherResourceOptions!.codec.refs[relationName] = ref;
              }
            }
          }
        }
      },
    },
  },
  schema: {
    hooks: {
      init(_, build, _context) {
        const {
          inflection,
          options: { pgForbidSetofFunctionsToReturnNull, simpleCollections },
          setGraphQLTypeForPgCodec,
        } = build;
        const unionsToRegister = new Map<
          string,
          PgCodec<any, any, any, any, any, any, any>[]
        >();
        for (const codec of build.pgCodecMetaLookup.keys()) {
          if (!codec.columns) {
            // Only apply to codecs that define columns
            continue;
          }

          // We're going to scan for interfaces, and then unions. Each block is
          // separately recoverable so an interface failure doesn't cause
          // unions to fail.

          // Detect interface
          build.recoverable(null, () => {
            const polymorphism = codec.polymorphism;
            if (!polymorphism) {
              // Don't build polymorphic types as objects
              return;
            }

            const behavior = getBehavior(codec.extensions);
            const defaultBehavior = [
              "select",
              "table",
              ...(!codec.isAnonymous ? ["insert", "update"] : []),
              ...(simpleCollections === "both"
                ? ["connection", "list"]
                : simpleCollections === "only"
                ? ["list"]
                : ["connection"]),
            ].join(" ");

            const isTable = build.behavior.matches(
              behavior,
              "table",
              defaultBehavior,
            );
            if (!isTable || codec.isAnonymous) {
              return;
            }

            const selectable = build.behavior.matches(
              behavior,
              "select",
              defaultBehavior,
            );

            if (selectable) {
              if (
                polymorphism.mode === "single" ||
                polymorphism.mode === "relational"
              ) {
                const interfaceTypeName = inflection.tableType(codec);
                build.registerInterfaceType(
                  interfaceTypeName,
                  {
                    pgCodec: codec,
                    isPgPolymorphicTableType: true,
                    pgPolymorphism: polymorphism,
                  },
                  () => ({
                    description: codec.extensions?.description,
                  }),
                  `PgPolymorphismPlugin single/relational interface type for ${codec.name}`,
                );
                setGraphQLTypeForPgCodec(codec, ["output"], interfaceTypeName);
                build.registerCursorConnection({
                  typeName: interfaceTypeName,
                  connectionTypeName: inflection.tableConnectionType(codec),
                  edgeTypeName: inflection.tableEdgeType(codec),
                  scope: {
                    isPgConnectionRelated: true,
                    pgCodec: codec,
                  },
                  nonNullNode: pgForbidSetofFunctionsToReturnNull,
                });
                for (const [typeIdentifier, spec] of Object.entries(
                  polymorphism.types,
                ) as Array<
                  [
                    string,
                    (
                      | PgCodecPolymorphismSingleTypeSpec<string>
                      | PgCodecPolymorphismRelationalTypeSpec
                    ),
                  ]
                >) {
                  const tableTypeName = spec.name;
                  if (polymorphism.mode === "single") {
                    build.registerObjectType(
                      tableTypeName,
                      {
                        pgCodec: codec,
                        isPgTableType: true,
                        pgPolymorphism: polymorphism,
                        pgPolymorphicSingleTableType: {
                          typeIdentifier,
                          name: spec.name,
                          columns: (
                            spec as PgCodecPolymorphismSingleTypeSpec<string>
                          ).columns,
                        },
                      },
                      // TODO: we actually allow a number of different plans; should we make this an array? See: PgClassSingleStep
                      ExecutableStep, // PgClassSingleStep<any, any, any, any>
                      () => ({
                        description: codec.extensions?.description,
                        interfaces: [
                          build.getTypeByName(
                            interfaceTypeName,
                          ) as GraphQLInterfaceType,
                        ],
                      }),
                      `PgPolymorphismPlugin single table type for ${codec.name}`,
                    );
                  }
                  build.registerCursorConnection({
                    typeName: tableTypeName,
                    connectionTypeName:
                      inflection.connectionType(tableTypeName),
                    edgeTypeName: inflection.edgeType(tableTypeName),
                    scope: {
                      isPgConnectionRelated: true,
                      pgCodec: codec,
                    },
                    nonNullNode: pgForbidSetofFunctionsToReturnNull,
                  });
                }
              } else if (polymorphism.mode === "union") {
                const interfaceTypeName = inflection.tableType(codec);
                build.registerInterfaceType(
                  interfaceTypeName,
                  {
                    pgCodec: codec,
                    isPgPolymorphicTableType: true,
                    pgPolymorphism: polymorphism,
                  },
                  () => ({
                    description: codec.extensions?.description,
                  }),
                  `PgPolymorphismPlugin union interface type for ${codec.name}`,
                );
                setGraphQLTypeForPgCodec(codec, ["output"], interfaceTypeName);
                build.registerCursorConnection({
                  typeName: interfaceTypeName,
                  connectionTypeName: inflection.tableConnectionType(codec),
                  edgeTypeName: inflection.tableEdgeType(codec),
                  scope: {
                    isPgConnectionRelated: true,
                    pgCodec: codec,
                  },
                  nonNullNode: pgForbidSetofFunctionsToReturnNull,
                });
              }
            }
          });

          // Detect union membership
          build.recoverable(null, () => {
            const rawUnionMember = codec.extensions?.tags?.unionMember;
            if (rawUnionMember) {
              const memberships = Array.isArray(rawUnionMember)
                ? rawUnionMember
                : [rawUnionMember];
              for (const membership of memberships) {
                // Register union
                const unionName = membership.trim();
                const list = unionsToRegister.get(unionName);
                if (!list) {
                  unionsToRegister.set(unionName, [codec]);
                } else {
                  list.push(codec);
                }
              }
            }
          });
        }

        for (const [unionName, codecs] of unionsToRegister.entries()) {
          build.recoverable(null, () => {
            build.registerUnionType(
              unionName,
              { isPgUnionMemberUnion: true },
              () => ({
                types: () =>
                  codecs
                    .map(
                      (codec) =>
                        build.getTypeByName(
                          build.inflection.tableType(codec),
                        ) as GraphQLObjectType | undefined,
                    )
                    .filter(isNotNullish),
              }),
              "PgPolymorphismPlugin @unionMember unions",
            );
          });
        }
        return _;
      },
      GraphQLObjectType_interfaces(interfaces, build, context) {
        const { inflection } = build;
        const {
          scope: { pgCodec, isPgTableType },
        } = context;
        const rawImplements = pgCodec?.extensions?.tags?.implements;
        if (rawImplements && isPgTableType) {
          const interfaceNames = Array.isArray(rawImplements)
            ? rawImplements
            : [rawImplements];
          for (const interfaceName of interfaceNames) {
            const interfaceType = build.getTypeByName(String(interfaceName));
            if (!interfaceType) {
              console.error(`'${interfaceName}' type not found`);
            } else if (!build.graphql.isInterfaceType(interfaceType)) {
              console.error(
                `'${interfaceName}' is not an interface type (it's a ${interfaceType.constructor.name})`,
              );
            } else {
              interfaces.push(interfaceType);
            }
          }
        }
        for (const codec of build.pgCodecMetaLookup.keys()) {
          const polymorphism = codec.polymorphism;
          if (
            !codec.columns ||
            !polymorphism ||
            polymorphism.mode !== "relational"
          ) {
            continue;
          }
          const typeNames = Object.values(polymorphism.types).map(
            (t) => t.name,
          );
          if (typeNames.includes(context.Self.name)) {
            const interfaceTypeName = inflection.tableType(codec);
            interfaces.push(
              build.getTypeByName(interfaceTypeName) as GraphQLInterfaceType,
            );
          }
        }
        return interfaces;
      },
      GraphQLSchema_types(types, build, _context) {
        for (const type of Object.values(build.getAllTypes())) {
          if (build.graphql.isInterfaceType(type)) {
            const scope = build.scopeByType.get(type) as
              | GraphileBuild.ScopeInterface
              | undefined;
            if (scope) {
              const polymorphism = scope.pgPolymorphism;
              if (polymorphism) {
                switch (polymorphism.mode) {
                  case "relational":
                  case "single": {
                    for (const type of Object.values(polymorphism.types)) {
                      // Force the type to be built
                      const t = build.getTypeByName(
                        type.name,
                      ) as GraphQLNamedType;
                      types.push(t);
                    }
                  }
                }
              }
            }
          }
        }
        return types;
      },
    },
  },
};
