import "graphile-build";

import type { PgSourceColumns, PgTypeCodec } from "@dataplan/pg";
import {
  domainOfCodec,
  enumType,
  getCodecByPgCatalogTypeName,
  listOfType,
  rangeOfCodec,
  recordType,
  TYPES,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin, PluginGatherConfig } from "graphile-plugin";
import sql from "pg-sql2";

import { version } from "../index";

interface State {
  codecByTypeIdByDatabaseName: Map<
    string,
    Map<string, Promise<PgTypeCodec<any, any, any, any> | null>>
  >;
  codecByClassIdByDatabaseName: Map<
    string,
    Map<string, Promise<PgTypeCodec<any, any, any, any> | null>>
  >;
}
declare global {
  namespace GraphileEngine {
    interface Inflection {
      scalarCodecTypeName(
        this: Inflection,
        codec: PgTypeCodec<undefined, any, any, undefined>,
      ): string;
    }
  }
}

declare module "graphile-plugin" {
  interface GatherHelpers {
    pgCodecs: {
      getCodecFromClass(
        databaseName: string,
        pgClassId: string,
      ): Promise<PgTypeCodec<any, any, any> | null>;
      getCodecFromType(
        databaseName: string,
        pgTypeId: string,
        pgTypeModifier?: number | null,
      ): Promise<PgTypeCodec<any, any, any, any> | null>;
    };
  }
}

export const PgCodecsPlugin: Plugin = {
  name: "PgCodecsPlugin",
  description: "Turns types into codecs",
  version: version,
  // TODO: refactor TypeScript so this isn't necessary; maybe via `makePluginGatherConfig`?
  gather: <PluginGatherConfig<"pgCodecs", State>>{
    namespace: "pgCodecs",
    initialState: (): State => ({
      codecByTypeIdByDatabaseName: new Map(),
      codecByClassIdByDatabaseName: new Map(),
    }),
    helpers: {
      getCodecFromClass(info, databaseName, classId) {
        let map = info.state.codecByClassIdByDatabaseName.get(databaseName);
        if (!map) {
          map = new Map();
          info.state.codecByClassIdByDatabaseName.set(databaseName, map);
        }
        if (map.has(classId)) {
          return map.get(classId);
        }

        const promise = (async () => {
          const pgClass = await info.helpers.pgIntrospection.getClass(
            databaseName,
            classId,
          );
          if (!pgClass) {
            return null;
          }
          const namespace = await info.helpers.pgIntrospection.getNamespace(
            databaseName,
            pgClass.relnamespace,
          );
          if (!namespace) {
            throw new Error(
              `Could not retrieve namespace for table '${pgClass._id}'`,
            );
          }

          const columns: PgSourceColumns = {};
          const allAttributes =
            await info.helpers.pgIntrospection.getAttributesForClass(
              databaseName,
              pgClass._id,
            );
          const columnAttributes = allAttributes
            .filter((attr) => attr.attnum >= 1 && attr.attisdropped != true)
            .sort((a, z) => a.attnum - z.attnum);
          let hasAtLeastOneColumn = false;
          for (const columnAttribute of columnAttributes) {
            const columnCodec = await info.helpers.pgCodecs.getCodecFromType(
              databaseName,
              columnAttribute.atttypid,
              columnAttribute.atttypmod,
            );
            if (columnCodec) {
              hasAtLeastOneColumn = true;
              columns[columnAttribute.attname] = {
                codec: columnCodec,
                notNull: columnAttribute.attnotnull === true,
                // TODO: identicalVia,
                extensions: {
                  // TODO: tags
                },
              };
            }
          }
          if (!hasAtLeastOneColumn) {
            console.warn(
              `Skipped ${pgClass.relname} because we couldn't give it any columns`,
            );
            return null;
          }

          const nspName = namespace.nspname;
          const className = pgClass.relname;
          const codec = EXPORTABLE(
            (className, columns, nspName, recordType, sql) =>
              recordType(sql.identifier(nspName, className), columns),
            [className, columns, nspName, recordType, sql],
          );
          return codec;
        })();

        map.set(classId, promise);

        return promise;
      },

      getCodecFromType(info, databaseName, typeId, typeModifier) {
        let map = info.state.codecByTypeIdByDatabaseName.get(databaseName);
        if (!map) {
          map = new Map();
          info.state.codecByTypeIdByDatabaseName.set(databaseName, map);
        }
        if (map.has(typeId)) {
          return map.get(typeId);
        }

        const promise = (async () => {
          const type = await info.helpers.pgIntrospection.getType(
            databaseName,
            typeId,
          );
          if (!type) {
            return null;
          }

          const pgCatalog =
            await info.helpers.pgIntrospection.getNamespaceByName(
              databaseName,
              "pg_catalog",
            );
          if (!pgCatalog) {
            return null;
          }

          // Class types are handled via getCodecFromClass (they have to add columns)
          if (type.typtype === "c") {
            return info.helpers.pgCodecs.getCodecFromClass(
              databaseName,
              type.typrelid!,
            );
          }

          // Array types are just listOfType() of their inner type
          if (type.typcategory === "A") {
            const innerType = await info.helpers.pgIntrospection.getTypeByArray(
              databaseName,
              type._id,
            );

            if (innerType) {
              const innerCodec = await info.helpers.pgCodecs.getCodecFromType(
                databaseName,
                innerType._id,
                typeModifier, // TODO: is it correct to pass this through?
              );
              if (innerCodec) {
                return EXPORTABLE(
                  (innerCodec, listOfType) => listOfType(innerCodec),
                  [innerCodec, listOfType],
                );
              }
            }
          }

          // For the standard pg_catalog types, we have standard handling.
          // (In v4 we used OIDs for this, but using the name is safer for PostgreSQL-likes.)
          if (type.typnamespace == pgCatalog._id) {
            const knownType = getCodecByPgCatalogTypeName(type.typname);
            if (knownType) {
              return knownType;
            }
          }

          // TODO: this is technically unsafe; we should check the namespace
          // matches the citext extension namespace
          if (type.typname === "citext") {
            return TYPES.citext;
          } else if (type.typname === "hstore") {
            return TYPES.hstore;
          }

          const namespace = await info.helpers.pgIntrospection.getNamespace(
            databaseName,
            type.typnamespace,
          );
          if (!namespace) {
            throw new Error(`Could not get namespace '${type.typnamespace}'`);
          }

          // Enum type
          if (type.typtype === "e") {
            const enumValues =
              await info.helpers.pgIntrospection.getEnumsForType(
                databaseName,
                type._id,
              );
            const namespaceName = namespace.nspname;
            const typeName = type.typname;
            return enumType(
              sql.identifier(namespaceName, typeName),
              enumValues.map((e) => e.enumlabel),
            );
          }

          // Range type
          if (type.typtype === "r") {
            const range = await info.helpers.pgIntrospection.getRangeByType(
              databaseName,
              type._id,
            );
            if (!range) {
              throw new Error(
                `Failed to get range entry related to '${type._id}'`,
              );
            }
            const innerCodec = await info.helpers.pgCodecs.getCodecFromType(
              databaseName,
              range.rngsubtype!,
            );
            const namespaceName = namespace.nspname;
            const typeName = type.typname;
            if (!innerCodec) {
              console.warn(
                `PgTypeCodec could not build codec for '${namespaceName}.${typeName}', we don't know how to process the subtype`,
              );
              return null;
            }
            return EXPORTABLE(
              (innerCodec, namespaceName, rangeOfCodec, sql, typeName) =>
                rangeOfCodec(
                  innerCodec,
                  sql.identifier(namespaceName, typeName),
                  { extensions: {} },
                ),
              [innerCodec, namespaceName, rangeOfCodec, sql, typeName],
            );
          }

          // Domains are wrappers under an underlying type
          if (type.typtype === "d") {
            const {
              typnotnull: notNull,
              typbasetype: baseTypeOid,
              typtypmod: baseTypeModifier,
              typndims: _numberOfArrayDimensions,
              typcollation: _domainCollation,
              typdefaultbin: _defaultValueNodeTree,
            } = type;
            const innerCodec = baseTypeOid
              ? await info.helpers.pgCodecs.getCodecFromType(
                  databaseName,
                  baseTypeOid,
                  baseTypeModifier,
                )
              : null;
            const namespaceName = namespace.nspname;
            const typeName = type.typname;
            const extensions = {};
            if (innerCodec) {
              return EXPORTABLE(
                (
                  domainOfCodec,
                  extensions,
                  innerCodec,
                  namespaceName,
                  notNull,
                  sql,
                  typeName,
                ) =>
                  domainOfCodec(
                    innerCodec,
                    sql.identifier(namespaceName, typeName),
                    {
                      extensions,
                      notNull,
                    },
                  ),
                [
                  domainOfCodec,
                  extensions,
                  innerCodec,
                  namespaceName,
                  notNull,
                  sql,
                  typeName,
                ],
              );
            }
          }

          // TODO: basic type support
          console.warn(
            `Don't understand how to build type for ${type.typname}`,
          );

          return null;
        })();

        map.set(typeId, promise);

        return promise;
      },
    },
  },
  schema: {
    hooks: {
      inflection(inflection, build) {
        return build.extend(
          inflection,
          {
            scalarCodecTypeName(codec) {
              const fullName = sql.compile(codec.sqlType).text;
              return this.coerceToGraphQLName(
                fullName.replace(/"/g, "").replace(/[^0-9a-z]/gi, "_"),
              );
            },
          },
          "Adding inflectors from PgCodecsPlugin",
        );
      },
      init: {
        after: ["pg-standard-types"],
        callback: (_, build) => {
          const {
            inflection,
            options: { pgUseCustomNetworkScalars },
            graphql: {
              GraphQLScalarType,
              GraphQLEnumType,
              GraphQLObjectType,
              GraphQLInputObjectType,
            },
          } = build;
          const hstoreTypeName = inflection.builtin("KeyValueHash");

          const typeNameByTYPESKey: {
            [key in keyof typeof TYPES]:
              | string
              | { [situation: string]: string };
          } = {
            boolean: "Boolean",
            int2: "Int",
            int: "Int",
            bigint: inflection.builtin("BigInt"),
            float: "Float",
            float4: "Float",
            money: "Float",
            numeric: "BigFloat",
            citext: "String",
            text: "String",
            char: "String",
            varchar: "String",
            xml: inflection.builtin("XML"),
            json: inflection.builtin("JSON"),
            jsonb: inflection.builtin("JSON"),
            timestamp: inflection.builtin("Datetime"),
            timestamptz: inflection.builtin("Datetime"),
            date: inflection.builtin("Date"),
            time: inflection.builtin("Time"),
            timetz: inflection.builtin("Time"),
            uuid: inflection.builtin("UUID"),
            interval: {
              input: inflection.inputType(inflection.builtin("Interval")),
              output: inflection.builtin("Interval"),
            },
            bit: inflection.builtin("BitString"),
            varbit: inflection.builtin("BitString"),
            box: {
              input: inflection.inputType(inflection.builtin("Box")),
              output: inflection.builtin("Box"),
            },
            circle: {
              input: inflection.inputType(inflection.builtin("Circle")),
              output: inflection.builtin("Circle"),
            },
            line: {
              input: inflection.inputType(inflection.builtin("Line")),
              output: inflection.builtin("Line"),
            },
            lseg: {
              input: inflection.inputType(inflection.builtin("LineSegment")),
              output: inflection.builtin("LineSegment"),
            },
            path: {
              input: inflection.inputType(inflection.builtin("Path")),
              output: inflection.builtin("Path"),
            },
            point: {
              input: inflection.inputType(inflection.builtin("Point")),
              output: inflection.builtin("Point"),
            },
            polygon: {
              input: inflection.inputType(inflection.builtin("Polygon")),
              output: inflection.builtin("Polygon"),
            },
            hstore: hstoreTypeName,
            inet: inflection.builtin("InternetAddress"),
            regproc: inflection.builtin("RegProc"),
            regprocedure: inflection.builtin("RegProcedure"),
            regoper: inflection.builtin("RegOper"),
            regoperator: inflection.builtin("RegOperator"),
            regclass: inflection.builtin("RegClass"),
            regtype: inflection.builtin("RegType"),
            regrole: inflection.builtin("RegRole"),
            regnamespace: inflection.builtin("RegNamespace"),
            regconfig: inflection.builtin("RegConfig"),
            regdictionary: inflection.builtin("RegDictionary"),

            cidr:
              pgUseCustomNetworkScalars !== false
                ? inflection.builtin("CidrAddress")
                : "String",
            macaddr:
              pgUseCustomNetworkScalars !== false
                ? inflection.builtin("MacAddress")
                : "String",
            macaddr8:
              pgUseCustomNetworkScalars !== false
                ? inflection.builtin("MacAddress8")
                : "String",
          };
          for (const key in typeNameByTYPESKey) {
            const val = typeNameByTYPESKey[key];
            const typeNameSpec =
              typeof val === "string" ? { input: val, output: val } : val;
            for (const situation in typeNameSpec) {
              // Only register type if the user hasn't already done so
              if (!build.hasGraphQLTypeForPgCodec(TYPES[key], situation)) {
                build.setGraphQLTypeForPgCodec(
                  TYPES[key],
                  situation,
                  typeNameSpec[situation],
                );
              }
            }
          }

          // Now walk all the codecs and ensure that each on has an associated type
          function walkCodec(
            codec: PgTypeCodec<any, any, any, any>,
            visited: Set<PgTypeCodec<any, any, any, any>>,
          ): void {
            if (visited.has(codec)) {
              return;
            }
            visited.add(codec);

            // Process the inner type of list types, then exit.
            if (codec.arrayOfCodec) {
              walkCodec(codec, visited);

              // Array codecs don't get their own type, they just use GraphQLList or connection or whatever.
              return;
            }

            // Process all the columns (if any), then exit.
            if (codec.columns) {
              for (const columnName in codec.columns) {
                const columnCodec = (codec.columns as PgSourceColumns)[
                  columnName
                ].codec;
                walkCodec(columnCodec, visited);
              }

              // This will be handled by PgTablesPlugin; ignore.
              return;
            }

            // Process the underlying type for domains (if any)
            if (codec.domainOfCodec) {
              walkCodec(codec.domainOfCodec, visited);
            }

            if (build.hasGraphQLTypeForPgCodec(codec)) {
              // This type already has a codec; ignore
              return;
            }

            // There's currently no type registered for this scalar codec; let's sort that out.
            if (codec.domainOfCodec) {
              // This type is a "domain", so we can mimic the underlying type
              const underlyingOutputTypeName =
                build.getGraphQLTypeNameByPgCodec(
                  codec.domainOfCodec,
                  "output",
                );
              const underlyingInputTypeName = build.getGraphQLTypeNameByPgCodec(
                codec.domainOfCodec,
                "input",
              );
              const underlyingOutputMeta = underlyingOutputTypeName
                ? build.getTypeMetaByName(underlyingOutputTypeName)
                : null;
              const underlyingInputMeta = underlyingInputTypeName
                ? build.getTypeMetaByName(underlyingInputTypeName)
                : null;
              const typeName = inflection.scalarCodecTypeName(codec);
              const isSameInputOutputType =
                underlyingInputTypeName === underlyingOutputTypeName;

              // We just want to be a copy of the underlying type spec, but with a different name/description
              const copy = (underlyingTypeName: string) => (): any => {
                const baseType = build.getTypeByName(underlyingTypeName);
                const config = { ...baseType?.toConfig() };
                delete (config as any).name;
                delete (config as any).description;
                return config;
              };

              if (!underlyingOutputMeta) {
                console.warn(
                  `Failed to find output meta for '${underlyingOutputTypeName}' (${
                    sql.compile(codec.domainOfCodec.sqlType).text
                  })`,
                );
              }

              if (underlyingOutputMeta && underlyingOutputTypeName) {
                // Register the GraphQL type
                switch (underlyingOutputMeta.Constructor) {
                  case GraphQLScalarType: {
                    build.registerScalarType(
                      typeName,
                      {},
                      copy(underlyingOutputTypeName),
                      "PgCodecsPlugin",
                    );
                    break;
                  }
                  case GraphQLEnumType: {
                    build.registerEnumType(
                      typeName,
                      {},
                      copy(underlyingOutputTypeName),
                      "PgCodecsPlugin",
                    );
                    break;
                  }
                  case GraphQLObjectType: {
                    build.registerEnumType(
                      typeName,
                      {},
                      copy(underlyingOutputTypeName),
                      "PgCodecsPlugin",
                    );
                    break;
                  }
                  default: {
                    console.warn(
                      `PgTypeCodec output type for '${
                        sql.compile(codec.sqlType).text
                      }' not understood, we don't know how to copy a '${
                        underlyingOutputMeta.Constructor?.name
                      }'`,
                    );
                    return;
                  }
                }

                // Now link this type to the codec for output (and input if appropriate)
                build.setGraphQLTypeForPgCodec(codec, "output", typeName);
                if (isSameInputOutputType) {
                  build.setGraphQLTypeForPgCodec(codec, "input", typeName);
                }
              }
              if (
                underlyingInputMeta &&
                !isSameInputOutputType &&
                underlyingInputTypeName
              ) {
                const inputTypeName = inflection.inputType(typeName);

                // Register the GraphQL type
                switch (underlyingInputMeta.Constructor) {
                  case GraphQLInputObjectType: {
                    build.registerInputObjectType(
                      inputTypeName,
                      {},
                      copy(underlyingInputTypeName),
                      "PgCodecsPlugin",
                    );
                    break;
                  }
                  default: {
                    console.warn(
                      `PgTypeCodec input type for '${
                        sql.compile(codec.sqlType).text
                      }' not understood, we don't know how to copy a '${
                        underlyingInputMeta.Constructor?.name
                      }'`,
                    );
                    return;
                  }
                }

                // Now link this type to the codec for input
                build.setGraphQLTypeForPgCodec(codec, "input", inputTypeName);
              }
            } else {
              // We have no idea what this is or how to handle it.
              // TODO: add some default handling, like "behavesLike = TYPES.string"?
              console.warn(
                `PgTypeCodec for '${
                  sql.compile(codec.sqlType).text
                }' not understood, please set 'domainOfCodec' to indicate the underlying behaviour the type should have when exposed to GraphQL`,
              );
            }
          }

          const visited: Set<PgTypeCodec<any, any, any, any>> = new Set();
          for (const source of build.input.pgSources) {
            walkCodec(source.codec, visited);
          }

          return _;
        },
      },
    },
  },
};
