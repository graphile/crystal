import "graphile-config";
import "./PgCodecsPlugin.js";
import "./PgProceduresPlugin.js";
import "./PgRelationsPlugin.js";
import "./PgTablesPlugin.js";

import type {
  PgTypeCodec,
  PgTypeCodecPolymorphism,
  PgTypeCodecPolymorphismRelational,
  PgTypeCodecPolymorphismRelationalTypeSpec,
  PgTypeCodecPolymorphismSingle,
  PgTypeCodecPolymorphismSingleTypeColumnSpec,
  PgTypeCodecPolymorphismSingleTypeSpec,
  PgTypeColumn,
  PgSourceRef,
} from "@dataplan/pg";
import { ExecutableStep } from "grafast";
import type { GraphQLInterfaceType, GraphQLNamedType } from "graphql";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";
import {
  parseDatabaseIdentifierFromSmartTag,
  parseSmartTagsOptsString,
} from "../utils.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgPolymorphism: Record<string, never>;
    }
  }
  namespace GraphileBuild {
    interface ScopeInterface {
      pgCodec?: PgTypeCodec<any, any, any, any>;
      isPgPolymorphicTableType?: boolean;
      pgPolymorphism?: PgTypeCodecPolymorphism<string>;
    }
    interface ScopeObject {
      pgPolymorphism?: PgTypeCodecPolymorphism<string>;
      pgPolymorphicSingleTableType?: {
        typeIdentifier: string;
        name: string;
        columns: ReadonlyArray<
          PgTypeCodecPolymorphismSingleTypeColumnSpec<any>
        >;
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
): PgTypeCodecPolymorphismSingleTypeColumnSpec<any> {
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
  after: ["PgSmartCommentsPlugin", "PgV4SmartTagsPlugin"],
  gather: {
    namespace: "pgPolymorphism",
    helpers: {},
    hooks: {
      async pgCodecs_recordType_extensions(info, event) {
        const { pgClass, extensions, databaseName } = event;
        const interfaceTag =
          extensions.tags.interface ??
          pgClass.getTagsAndDescription().tags.interface;
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

              const types: PgTypeCodecPolymorphismSingle<any>["types"] =
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
              extensions.polymorphism = {
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

              const types: PgTypeCodecPolymorphismRelational<any>["types"] =
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
                  relationName: info.inflection.sourceRelationName({
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

              extensions.polymorphism = {
                mode: "relational",
                typeColumns: [type],
                types,
              };
              break;
            }
            case "union": {
              extensions.polymorphism = {
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
      async pgTables_PgSource(info, event) {
        const { pgClass, databaseName, source, relations } = event;
        const poly = source.codec.extensions?.polymorphism;
        if (poly?.mode === "relational") {
          // Copy common attributes to implementations
          for (const spec of Object.values(poly.types)) {
            const [schemaName, tableName] = parseDatabaseIdentifierFromSmartTag(
              spec.references,
              2,
              pgClass.getNamespace()!.nspname,
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
            const pgConstraint = pgRelatedClass.getConstraints().find(
              (c) =>
                // TODO: this isn't safe, we should also check that the columns match up
                c.contype === "f" && c.confrelid === pgClass._id,
            );
            const remotePk = pgClass
              .getConstraints()
              .find((c) => c.contype === "p");
            if (!pk || !remotePk || !pgConstraint) {
              throw new Error("Invalid relational something something");
            }
            const sharedRelationName = info.inflection.sourceRelationName({
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

            const otherSourceBuilder =
              await info.helpers.pgTables.getSourceBuilder(
                databaseName,
                pgRelatedClass,
              );

            for (const [relationName, relationSpec] of Object.entries(
              relations,
            )) {
              const behavior =
                getBehavior(relationSpec.source.extensions) +
                " " +
                getBehavior(relationSpec.extensions);
              const relationDetails: GraphileBuild.PgRelationsPluginRelationDetails =
                {
                  source,
                  codec: source.codec,
                  identifier: relationName,
                  relation: relationSpec,
                };
              const singleRecordFieldName = relationDetails.relation
                .isReferencee
                ? info.inflection.singleRelationBackwards(relationDetails)
                : info.inflection.singleRelation(relationDetails);
              const connectionFieldName =
                info.inflection.manyRelationConnection(relationDetails);
              const listFieldName =
                info.inflection.manyRelationList(relationDetails);
              const ref: PgSourceRef = {
                singular: relationSpec.isUnique,
                singleRecordFieldName,
                listFieldName,
                connectionFieldName,
                extensions: {
                  tags: {
                    behavior,
                  },
                },
                paths: [
                  [
                    {
                      relationName: sharedRelationName,
                    },
                    { relationName },
                  ],
                ],
              };
              otherSourceBuilder!.refs[relationName] = ref;
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
        for (const codec of build.pgCodecMetaLookup.keys()) {
          build.recoverable(null, () => {
            if (!codec.columns) {
              // Only apply to codecs that define columns
              return;
            }
            const polymorphism = codec.extensions?.polymorphism;
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
                  `PgPolymorphismPlugin single interface type for ${codec.name}`,
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
                      | PgTypeCodecPolymorphismSingleTypeSpec<string>
                      | PgTypeCodecPolymorphismRelationalTypeSpec
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
                            spec as PgTypeCodecPolymorphismSingleTypeSpec<string>
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
              }
            }
          });
        }
        return _;
      },
      GraphQLObjectType_interfaces(interfaces, build, context) {
        const { inflection } = build;
        for (const codec of build.pgCodecMetaLookup.keys()) {
          const polymorphism = codec.extensions?.polymorphism;
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
