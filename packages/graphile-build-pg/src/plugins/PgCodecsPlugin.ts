import "graphile-build";

import type { PgEnumTypeCodec, PgTypeCodec, PgTypeColumns } from "@dataplan/pg";
import {
  domainOfCodec,
  enumType,
  getCodecByPgCatalogTypeName,
  isEnumCodec,
  listOfType,
  rangeOfCodec,
  recordType,
  TYPES,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-export";
import type { Plugin, PluginHook } from "graphile-plugin";
import type { PgClass, PgType } from "pg-introspection";
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
  namespace GraphileBuild {
    interface Inflection {
      classCodecName(details: {
        pgClass: PgClass;
        databaseName: string;
      }): string;

      typeCodecName(details: { pgType: PgType; databaseName: string }): string;

      scalarCodecTypeName(
        this: Inflection,
        codec: PgTypeCodec<undefined, any, any, undefined>,
      ): string;
      enumType(this: Inflection, codec: PgEnumTypeCodec<any>): string;
      enumValue(
        this: Inflection,
        value: string,
        codec: PgEnumTypeCodec<any>,
      ): string;
      rangeBoundType(input: {
        codec: PgTypeCodec<undefined, any, any, undefined>;
        underlyingTypeName: string;
      }): string;
      rangeType(input: {
        codec: PgTypeCodec<undefined, any, any, undefined>;
        underlyingTypeName: string;
      }): string;
    }

    interface ScopeGraphQLObjectType {
      isPgRangeType?: boolean;
      isPgRangeBoundType?: boolean;
    }

    interface ScopeGraphQLInputObjectType {
      isPgRangeInputType?: boolean;
      isPgRangeBoundInputType?: boolean;
      pgCodec?: PgTypeCodec<any, any, any, any>;
    }
  }
}

declare global {
  namespace GraphilePlugin {
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
    interface GatherHooks {
      pgCodecs_PgTypeCodec: PluginHook<
        (event: {
          pgCodec: PgTypeCodec<any, any, any, any>;
          databaseName: string;
          pgClass?: PgClass;
          pgType: PgType;
        }) => Promise<void>
      >;
    }
  }
}

export const PgCodecsPlugin: Plugin = {
  name: "PgCodecsPlugin",
  description: "Turns PostgreSQL types into @dataplan/pg codecs",
  version: version,

  inflection: {
    add: {
      classCodecName(options, { pgClass, databaseName }) {
        const pgNamespace = pgClass.getNamespace()!;
        const schemaPrefix = this._schemaPrefix({ pgNamespace, databaseName });
        return this.camelCase(`${schemaPrefix}${pgClass.relname}`);
      },
      typeCodecName(options, { pgType, databaseName }) {
        const pgNamespace = pgType.getNamespace()!;
        const schemaPrefix = this._schemaPrefix({ pgNamespace, databaseName });
        return this.camelCase(`${schemaPrefix}${pgType.typname}`);
      },
      scalarCodecTypeName(options, codec) {
        return this.upperCamelCase(this.coerceToGraphQLName(codec.name));
      },
      enumType(options, codec) {
        return this.scalarCodecTypeName(codec);
      },
      enumValue(options, inValue) {
        let value = inValue;

        if (value === "") {
          return "_EMPTY_";
        }

        // Some enums use asterisks to signify wildcards - this might be for
        // the whole item, or prefixes/suffixes, or even in the middle.  This
        // is provided on a best efforts basis, if it doesn't suit your
        // purposes then please pass a custom inflector as mentioned below.
        value = value
          .replace(/\*/g, "_ASTERISK_")
          .replace(/^(_?)_+ASTERISK/, "$1ASTERISK")
          .replace(/ASTERISK_(_?)_*$/, "ASTERISK$1");

        // This is a best efforts replacement for common symbols that you
        // might find in enums. Generally we only support enums that are
        // alphanumeric, if these replacements don't work for you, you should
        // pass a custom inflector that replaces this `enumName` method
        // with one of your own chosing.
        value =
          {
            // SQL comparison operators
            ">": "GREATER_THAN",
            ">=": "GREATER_THAN_OR_EQUAL",
            "=": "EQUAL",
            "!=": "NOT_EQUAL",
            "<>": "DIFFERENT",
            "<=": "LESS_THAN_OR_EQUAL",
            "<": "LESS_THAN",

            // PostgreSQL LIKE shortcuts
            "~~": "LIKE",
            "~~*": "ILIKE",
            "!~~": "NOT_LIKE",
            "!~~*": "NOT_ILIKE",

            // '~' doesn't necessarily represent regexps, but the three
            // operators following it likely do, so we'll use the word TILDE
            // in all for consistency.
            "~": "TILDE",
            "~*": "TILDE_ASTERISK",
            "!~": "NOT_TILDE",
            "!~*": "NOT_TILDE_ASTERISK",

            // A number of other symbols where we're not sure of their
            // meaning.  We give them common generic names so that they're
            // suitable for multiple purposes, e.g. favouring 'PLUS' over
            // 'ADDITION' and 'DOT' over 'FULL_STOP'
            "%": "PERCENT",
            "+": "PLUS",
            "-": "MINUS",
            "/": "SLASH",
            "\\": "BACKSLASH",
            _: "UNDERSCORE",
            "#": "POUND",
            "£": "STERLING",
            $: "DOLLAR",
            "&": "AMPERSAND",
            "@": "AT",
            "'": "APOSTROPHE",
            '"': "QUOTE",
            "`": "BACKTICK",
            ":": "COLON",
            ";": "SEMICOLON",
            "!": "EXCLAMATION_POINT",
            "?": "QUESTION_MARK",
            ",": "COMMA",
            ".": "DOT",
            "^": "CARET",
            "|": "BAR",
            "[": "OPEN_BRACKET",
            "]": "CLOSE_BRACKET",
            "(": "OPEN_PARENTHESIS",
            ")": "CLOSE_PARENTHESIS",
            "{": "OPEN_BRACE",
            "}": "CLOSE_BRACE",
          }[value] || value;
        return this.coerceToGraphQLName(value);
      },
      rangeBoundType(options, { underlyingTypeName }) {
        return `${underlyingTypeName}Bound`;
      },
      rangeType(options, { underlyingTypeName }) {
        return `${underlyingTypeName}Range`;
      },
    },
  },

  // TODO: refactor TypeScript so this isn't necessary; maybe via `makePluginGatherConfig`?
  gather: <GraphilePlugin.PluginGatherConfig<"pgCodecs", State>>{
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

          const columns: PgTypeColumns = {};
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
                hasDefault: columnAttribute.atthasdef ?? undefined,
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
          const codecName = info.inflection.classCodecName({
            databaseName,
            pgClass,
          });
          const codec = EXPORTABLE(
            (className, codecName, columns, nspName, recordType, sql) =>
              recordType(
                codecName,
                sql.identifier(nspName, className),
                columns,
              ),
            [className, codecName, columns, nspName, recordType, sql],
          );
          info.process("pgCodecs_PgTypeCodec", {
            pgCodec: codec,
            pgType: pgClass.getType()!,
            pgClass,
            databaseName,
          });
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

          const codec = await (async () => {
            const namespace = await info.helpers.pgIntrospection.getNamespace(
              databaseName,
              type.typnamespace,
            );
            if (!namespace) {
              throw new Error(`Could not get namespace '${type.typnamespace}'`);
            }
            const namespaceName = namespace.nspname;

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

            // Enum type
            if (type.typtype === "e") {
              const enumValues =
                await info.helpers.pgIntrospection.getEnumsForType(
                  databaseName,
                  type._id,
                );
              const typeName = type.typname;
              const codecName = info.inflection.typeCodecName({
                pgType: type,
                databaseName,
              });
              const enumLabels = enumValues.map((e) => e.enumlabel);
              return EXPORTABLE(
                (
                  codecName,
                  enumLabels,
                  enumType,
                  namespaceName,
                  sql,
                  typeName,
                ) =>
                  enumType(
                    codecName,
                    sql.identifier(namespaceName, typeName),
                    enumLabels,
                  ),
                [codecName, enumLabels, enumType, namespaceName, sql, typeName],
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
              const codecName = info.inflection.typeCodecName({
                pgType: type,
                databaseName,
              });
              return EXPORTABLE(
                (
                  codecName,
                  innerCodec,
                  namespaceName,
                  rangeOfCodec,
                  sql,
                  typeName,
                ) =>
                  rangeOfCodec(
                    innerCodec,
                    codecName,
                    sql.identifier(namespaceName, typeName),
                    { extensions: {} },
                  ),
                [
                  codecName,
                  innerCodec,
                  namespaceName,
                  rangeOfCodec,
                  sql,
                  typeName,
                ],
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
                const codecName = info.inflection.typeCodecName({
                  pgType: type,
                  databaseName,
                });
                return EXPORTABLE(
                  (
                    codecName,
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
                      codecName,
                      sql.identifier(namespaceName, typeName),
                      {
                        extensions,
                        notNull,
                      },
                    ),
                  [
                    codecName,
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

            // Array types are just listOfType() of their inner type
            if (type.typcategory === "A") {
              const innerType =
                await info.helpers.pgIntrospection.getTypeByArray(
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
                  const typeDelim = innerType.typdelim!;
                  return EXPORTABLE(
                    (innerCodec, listOfType, typeDelim) =>
                      listOfType(innerCodec, {}, typeDelim),
                    [innerCodec, listOfType, typeDelim],
                  );
                }
              }
              console.warn(
                `Could not build PgTypeCodec for '${namespaceName}.${type.typname}' due to issue with getting codec for underlying type`,
              );
              return null;
            }

            // TODO: basic type support
            console.warn(
              `Don't understand how to build type for ${type.typname}`,
            );

            return null;
          })();
          if (codec) {
            // Be careful not to call this for class codecs!
            info.process("pgCodecs_PgTypeCodec", {
              pgCodec: codec,
              pgType: type,
              databaseName,
            });
          }
          return codec;
        })();

        map.set(typeId, promise);

        return promise;
      },
    },
  },

  schema: {
    hooks: {
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
              GraphQLNonNull,
              GraphQLBoolean,
            },
          } = build;
          const hstoreTypeName = inflection.builtin("KeyValueHash");

          const typeNameByTYPESKey: {
            [key in keyof typeof TYPES]:
              | string
              | null
              | { [situation: string]: string | null };
          } = {
            void: null,
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
              walkCodec(codec.arrayOfCodec, visited);

              // Array codecs don't get their own type, they just use GraphQLList or connection or whatever.
              return;
            }

            // Process all the columns (if any), then exit.
            if (codec.columns) {
              for (const columnName in codec.columns) {
                const columnCodec = (codec.columns as PgTypeColumns)[columnName]
                  .codec;
                walkCodec(columnCodec, visited);
              }

              // This will be handled by PgTablesPlugin; ignore.
              return;
            }

            // Process the underlying type for domains (if any)
            if (codec.domainOfCodec) {
              walkCodec(codec.domainOfCodec, visited);
            }

            // Process the underlying type for ranges (if any)
            if (codec.rangeOfCodec) {
              walkCodec(codec.rangeOfCodec, visited);
            }

            if (build.hasGraphQLTypeForPgCodec(codec)) {
              // This type already has a codec; ignore
              return;
            }

            if (codec === TYPES.void) {
              return;
            }

            // There's currently no type registered for this scalar codec; let's sort that out.

            const underlyingType = codec.rangeOfCodec || codec.domainOfCodec;
            if (isEnumCodec(codec)) {
              const typeName = inflection.enumType(codec);
              const values = codec.values.reduce((memo, value) => {
                memo[inflection.enumValue(value, codec)] = {
                  // TODO: description
                  value: value,
                };
                return memo;
              }, {});
              build.registerEnumType(
                typeName,
                {},
                () => ({
                  values,
                }),
                "PgCodecsPlugin",
              );
              build.registerCursorConnection?.({
                typeName,
                nonNullNode: !build.options.pgForbidSetofFunctionsToReturnNull,
              });
              build.setGraphQLTypeForPgCodec(
                codec,
                ["input", "output"],
                typeName,
              );
            } else if (underlyingType) {
              // This type is a "domain", so we can mimic the underlying type
              const underlyingOutputTypeName =
                build.getGraphQLTypeNameByPgCodec(underlyingType, "output");
              const underlyingInputTypeName = build.getGraphQLTypeNameByPgCodec(
                underlyingType,
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

              if (!underlyingOutputMeta) {
                console.warn(
                  `Failed to find output meta for '${underlyingOutputTypeName}' (${underlyingType.name})`,
                );
                return;
              }

              if (codec.rangeOfCodec) {
                const rangeBoundTypeName = inflection.rangeBoundType({
                  codec,
                  underlyingTypeName: underlyingOutputTypeName!,
                });
                const rangeBoundInputTypeName =
                  inflection.inputType(rangeBoundTypeName);
                const rangeTypeName = inflection.rangeType({
                  codec,
                  underlyingTypeName: underlyingOutputTypeName!,
                });
                const rangeInputTypeName = inflection.inputType(rangeTypeName);

                build.registerObjectType(
                  rangeBoundTypeName,
                  {
                    isPgRangeBoundType: true,
                    pgCodec: codec,
                  },
                  null, // TODO
                  () => ({
                    description: build.wrapDescription(
                      "The value at one end of a range. A range can either include this value, or not.",
                      "type",
                    ),
                    fields: () => ({
                      value: {
                        description: build.wrapDescription(
                          "The value at one end of our range.",
                          "field",
                        ),
                        type: new GraphQLNonNull(
                          build.getOutputTypeByName(underlyingOutputTypeName!),
                        ),
                      },
                      inclusive: {
                        description: build.wrapDescription(
                          "Whether or not the value of this bound is included in the range.",
                          "field",
                        ),
                        type: new GraphQLNonNull(GraphQLBoolean),
                      },
                    }),
                  }),
                  "PgCodecsPlugin enum range bound output",
                );

                build.registerInputObjectType(
                  rangeBoundInputTypeName,
                  {
                    isPgRangeBoundInputType: true,
                    pgCodec: codec,
                  },
                  () => ({
                    description: build.wrapDescription(
                      "The value at one end of a range. A range can either include this value, or not.",
                      "type",
                    ),
                    fields: () => ({
                      value: {
                        description: build.wrapDescription(
                          "The value at one end of our range.",
                          "field",
                        ),
                        type: new GraphQLNonNull(
                          build.getInputTypeByName(underlyingInputTypeName!),
                        ),
                      },
                      inclusive: {
                        description: build.wrapDescription(
                          "Whether or not the value of this bound is included in the range.",
                          "field",
                        ),
                        type: new GraphQLNonNull(GraphQLBoolean),
                      },
                    }),
                  }),
                  "PgCodecsPlugin enum range bound input",
                );
                build.registerObjectType(
                  rangeTypeName,
                  {
                    isPgRangeType: true,
                    pgCodec: codec,
                  },
                  null, // TODO
                  () => ({
                    description: build.wrapDescription(
                      `A range of \`${underlyingOutputTypeName}\`.`,
                      "type",
                    ),
                    fields: () => ({
                      start: {
                        description: build.wrapDescription(
                          "The starting bound of our range.",
                          "field",
                        ),
                        type: build.getOutputTypeByName(rangeBoundTypeName!),
                      },
                      end: {
                        description: build.wrapDescription(
                          "The ending bound of our range.",
                          "field",
                        ),
                        type: build.getOutputTypeByName(rangeBoundTypeName!),
                      },
                    }),
                  }),
                  "PgCodecsPlugin enum range output",
                );
                // TODO: should we remove this?
                build.registerCursorConnection?.({
                  typeName: rangeTypeName,
                  nonNullNode:
                    !build.options.pgForbidSetofFunctionsToReturnNull,
                });
                build.registerInputObjectType(
                  rangeInputTypeName,
                  {
                    isPgRangeInputType: true,
                    pgCodec: codec,
                  },
                  () => ({
                    description: build.wrapDescription(
                      `A range of \`${underlyingInputTypeName}\`.`,
                      "type",
                    ),
                    fields: () => ({
                      start: {
                        description: build.wrapDescription(
                          "The starting bound of our range.",
                          "field",
                        ),
                        type: build.getInputTypeByName(rangeBoundInputTypeName),
                      },
                      end: {
                        description: build.wrapDescription(
                          "The ending bound of our range.",
                          "field",
                        ),
                        type: build.getInputTypeByName(rangeBoundInputTypeName),
                      },
                    }),
                  }),
                  "PgCodecsPlugin enum range input",
                );

                build.setGraphQLTypeForPgCodec(codec, "output", rangeTypeName);
                build.setGraphQLTypeForPgCodec(
                  codec,
                  "input",
                  rangeInputTypeName,
                );
              } else if (codec.domainOfCodec) {
                // We just want to be a copy of the underlying type spec, but with a different name/description
                const copy = (underlyingTypeName: string) => (): any => {
                  const baseType = build.getTypeByName(underlyingTypeName);
                  const config = { ...baseType?.toConfig() };
                  delete (config as any).name;
                  delete (config as any).description;
                  return config;
                };

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
                      build.registerCursorConnection?.({
                        typeName,
                        nonNullNode:
                          !build.options.pgForbidSetofFunctionsToReturnNull,
                      });
                      break;
                    }
                    case GraphQLEnumType: {
                      build.registerEnumType(
                        typeName,
                        {},
                        copy(underlyingOutputTypeName),
                        "PgCodecsPlugin",
                      );
                      build.registerCursorConnection?.({
                        typeName,
                        nonNullNode:
                          !build.options.pgForbidSetofFunctionsToReturnNull,
                      });
                      break;
                    }
                    case GraphQLObjectType: {
                      build.registerEnumType(
                        typeName,
                        {},
                        copy(underlyingOutputTypeName),
                        "PgCodecsPlugin",
                      );
                      build.registerCursorConnection?.({
                        typeName,
                        nonNullNode:
                          !build.options.pgForbidSetofFunctionsToReturnNull,
                      });
                      break;
                    }
                    default: {
                      console.warn(
                        `PgTypeCodec output type '${codec.name}' not understood, we don't know how to copy a '${underlyingOutputMeta.Constructor?.name}'`,
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
                        `PgTypeCodec input type '${codec.name}' not understood, we don't know how to copy a '${underlyingInputMeta.Constructor?.name}'`,
                      );
                      return;
                    }
                  }

                  // Now link this type to the codec for input
                  build.setGraphQLTypeForPgCodec(codec, "input", inputTypeName);
                }
              } else {
                throw new Error(
                  "GraphileInternalError<0bcf67df-4c5f-4261-a51c-28c8a916edfe> Fallthrough here should be impossible",
                );
              }
            } else {
              // We have no idea what this is or how to handle it.
              // TODO: add some default handling, like "behavesLike = TYPES.string"?
              console.warn(
                `PgTypeCodec '${codec.name}' not understood, please set 'domainOfCodec' to indicate the underlying behaviour the type should have when exposed to GraphQL`,
              );
            }
          }

          const visited: Set<PgTypeCodec<any, any, any, any>> = new Set();
          for (const source of build.input.pgSources) {
            walkCodec(source.codec, visited);
            if (source.parameters) {
              for (const parameter of source.parameters) {
                walkCodec(parameter.codec, visited);
              }
            }
          }

          return _;
        },
      },
    },
  },
};
