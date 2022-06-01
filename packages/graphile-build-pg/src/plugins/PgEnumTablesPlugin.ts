import {
  PgAttribute,
  PgClass,
  PgConstraint,
  PgEnum,
  PgType,
} from "pg-introspection";
import { version } from "../index.js";
import { sql } from "pg-sql2";
import { withPgClientFromPgSource } from "../pgSources.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgEnumTables: {
        getIntrospectionData(
          databaseName: string,
          pgClass: PgClass,
          columns: PgAttribute[],
        ): Promise<readonly Record<string, string>[]>;
      };
    }
  }
}

interface State {}
interface Cache {}

// Assert the columns are text
const VARCHAR_ID = "1043";
const TEXT_ID = "25";
const CHAR_ID = "18";
const BPCHAR_ID = "1042";

const VALID_TYPE_IDS = [VARCHAR_ID, TEXT_ID, CHAR_ID, BPCHAR_ID];

export const PgEnumTablesPlugin: GraphileConfig.Plugin = {
  name: "PgEnumTablesPlugin",
  description: "Converts columns that reference `@enum` tables into enums",
  version: version,
  after: ["PgFakeConstraintsPlugin"],

  gather: <GraphileConfig.PluginGatherConfig<"pgEnumTables", State, Cache>>{
    namespace: "pgEnumTables",
    helpers: {
      async getIntrospectionData(info, databaseName, pgClass, columns) {
        // Load data from the table/view.
        const query = sql.compile(
          sql.fragment`select ${sql.join(
            columns.map((col) => sql.identifier(col.attname)),
            ", ",
          )} from ${sql.identifier(
            pgClass.getNamespace()!.nspname,
            pgClass.relname,
          )};`,
        );

        const database = info.resolvedPreset.pgSources!.find(
          (database) => database.name === databaseName,
        );
        try {
          const { rows } = await withPgClientFromPgSource(
            database!,
            null,
            (client) => client.query<Record<string, string>>(query),
          );
          return rows;
        } catch (e) {
          let role = "RELEVANT_POSTGRES_USER";
          try {
            const { rows } = await withPgClientFromPgSource(
              database!,
              null,
              (client) =>
                client.query<{ user: string }>({
                  text: "select user;",
                }),
            );
            if (rows[0]) {
              role = rows[0].user;
            }
          } catch (e) {
            /*
             * Ignore; this is likely a 25P02 (transaction aborted)
             * error caused by the statement above failing.
             */
          }
          throw new Error(`Introspection could not read from enum table "${
            pgClass.getNamespace()!.nspname
          }"."${pgClass.relname}", perhaps you need to grant access:
  GRANT USAGE ON SCHEMA "${pgClass.getNamespace()!.nspname}" TO "${role}";
  GRANT SELECT ON "${pgClass.getNamespace()!.nspname}"."${
            pgClass.relname
          }" TO "${role}";
Original error: ${e.message}
`);
        }
      },
    },
    hooks: {
      // Run in the 'introspection' phase before anything uses the tags
      async pgIntrospection_introspection(info, event) {
        const { introspection, databaseName } = event;
        for (const pgClass of introspection.classes) {
          const pgNamespace = pgClass.getNamespace();
          if (!pgNamespace) {
            continue;
          }
          const { tags, description } = pgClass.getTagsAndDescription();
          const isEnumTable =
            tags.enum === true || typeof tags.enum === "string";

          if (isEnumTable) {
            if (Array.isArray(tags.behavior)) {
              /* no action */
            } else if (typeof tags.behavior === "string") {
              tags.behavior = [tags.behavior];
            } else {
              tags.behavior = [];
            }
            // Prevent the table being recognised as a table
            tags.behavior.unshift("-*");
          }

          // By this point, even views should have "fake" constraints we can use
          // (e.g. `@primaryKey`)
          const enumConstraints = introspection.constraints.filter(
            (pgConstraint) =>
              isEnumConstraint(pgClass, pgConstraint, isEnumTable),
          );

          // Get all the columns
          const enumTableColumns = pgClass.getAttributes();

          // Just the columns with enum behaviors
          const enumColumnNumbers = enumConstraints.map(
            (con) => con.conkey![0],
          );
          const enumColumns = enumTableColumns.filter((pgAttribute) =>
            enumColumnNumbers.includes(pgAttribute.attnum),
          );

          // Get description column - first column with `@enumDescription` tag, or failing that the column called "description"
          const descriptionColumn =
            enumTableColumns.find(
              (attr) => attr.getTagsAndDescription().tags.enumDescription,
            ) ||
            enumTableColumns.find((attr) => attr.attname === "description");

          if (isEnumTable || enumConstraints.length > 0) {
            // Get the list of columns enums are defined for
            const columns = [
              ...new Set([
                ...enumColumns,
                ...(descriptionColumn ? [descriptionColumn] : []),
              ]),
            ].sort((a, z) => a.attnum - z.attnum);
            const allData =
              await info.helpers.pgEnumTables.getIntrospectionData(
                databaseName,
                pgClass,
                columns,
              );

            enumConstraints.forEach((pgConstraint) => {
              const pgAttribute = enumTableColumns.find(
                (pgAttribute) => pgAttribute.attnum === pgConstraint.conkey![0],
              );
              if (!pgAttribute) {
                // Should never happen
                throw new Error(
                  "GraphileInternalError<89c93c93-7e94-406c-a822-736e2ff1e466>: could not find column for enum constraint",
                );
              }
              const data = allData.filter(
                (row) => row[pgAttribute.attname] != null,
              );
              if (data.length < 1) {
                throw new Error(
                  `Enum table "${pgNamespace.nspname}"."${pgClass.relname}" contains no visible entries for enum constraint '${pgConstraint.conname}'. Check that the table contains at least one row and that the rows are not hidden by row-level security policies.`,
                );
              }

              // Create fake enum type
              const constraintIdent =
                pgConstraint.contype === "p" ? "" : `_${pgConstraint.conname}`;
              const fakeId = `FAKE_ENUM_${pgNamespace.nspname}_${pgClass.relname}${constraintIdent}`;
              const listTagsAndDescription = {
                tags: {},
                description: "",
              };
              const enumTypeArray: PgType = {
                _id: `${fakeId}_list`,
                typname: `_${pgClass.relname}${constraintIdent}`,
                typnamespace: pgNamespace._id,
                typtype: "b",
                typcategory: "A",
                typnotnull: null,
                typarray: null,
                typlen: -1,
                typelem: fakeId,
                typrelid: null,
                typbasetype: null,
                typtypmod: null,
                typdefault: null,
                typdefaultbin: null,
                typinput: null,
                typoutput: null,
                typreceive: null,
                typsend: null,
                typmodin: null,
                typmodout: null,
                typanalyze: null,
                typalign: null,
                typstorage: null,
                typndims: null,
                typcollation: null,
                typacl: null,
                typsubscript: null,
                typowner: pgClass.getOwner()?._id || null,
                typbyval: null,
                typispreferred: null,
                typisdefined: true,
                typdelim: null,
                getArrayType() {
                  return undefined;
                },
                getEnumValues() {
                  return undefined;
                },
                getRange() {
                  return undefined;
                },
                getDescription() {
                  return listTagsAndDescription.description;
                },
                getOwner() {
                  return pgClass.getOwner();
                },
                getClass() {
                  return undefined;
                },
                getElemType() {
                  return enumType;
                },
                getTagsAndDescription() {
                  return listTagsAndDescription;
                },
                getNamespace() {
                  return pgNamespace;
                },
              };
              /*
                enumVariants: data.map((r) => r[pgAttribute.attname]),
                enumDescriptions: descriptionColumn
                  ? data.map((r) => r[descriptionColumn.attname])
                  : null,
                  */
              const enumValues: PgEnum[] = data.map((r, i) => {
                const value = r[pgAttribute.attname];
                const description = descriptionColumn
                  ? r[descriptionColumn.attname]
                  : "";
                const tagsAndDescription = {
                  tags: Object.create(null),
                  description,
                };
                return {
                  _id: `${fakeId}_value_${value}`,
                  enumlabel: value,
                  enumsortorder: i,
                  enumtypid: fakeId,
                  getType() {
                    return enumType;
                  },
                  getDescription() {
                    return description;
                  },
                  getTagsAndDescription() {
                    return tagsAndDescription;
                  },
                };
              });

              introspection.enums.push(...enumValues);

              const elemTagsAndDescription = {
                tags: { ...tags, ...pgConstraint.getTagsAndDescription().tags },
                description,
              };
              const enumType: PgType = {
                _id: fakeId,
                typname: `${pgClass.relname}${constraintIdent}`,
                typnamespace: pgNamespace._id,
                typtype: "e",
                typcategory: "E",
                typnotnull: null,
                typarray: enumTypeArray._id,
                typlen: 4, // ???
                typelem: fakeId,
                typrelid: null,
                typbasetype: null,
                typtypmod: null,
                typdefault: null,
                typdefaultbin: null,
                typinput: null,
                typoutput: null,
                typreceive: null,
                typsend: null,
                typmodin: null,
                typmodout: null,
                typanalyze: null,
                typalign: null,
                typstorage: null,
                typndims: null,
                typcollation: null,
                typacl: null,
                typsubscript: null,
                typowner: pgClass.getOwner()?._id || null,
                typbyval: null,
                typispreferred: null,
                typisdefined: true,
                typdelim: null,
                getArrayType() {
                  return enumTypeArray;
                },
                getEnumValues() {
                  return enumValues;
                },
                getRange() {
                  return undefined;
                },
                getDescription() {
                  return elemTagsAndDescription.description;
                },
                getOwner() {
                  return pgClass.getOwner();
                },
                getClass() {
                  return undefined;
                },
                getElemType() {
                  return undefined;
                },
                getTagsAndDescription() {
                  return elemTagsAndDescription;
                },
                getNamespace() {
                  return pgNamespace;
                },
              };
              introspection.types.push(enumType, enumTypeArray);

              // Change type of all attributes that reference this table to
              // reference this enum type
              introspection.constraints.forEach((c) => {
                if (
                  c.contype === "f" &&
                  c.confrelid === pgClass._id &&
                  c.confkey!.length === 1 &&
                  c.confkey![0] === pgAttribute.attnum
                ) {
                  // Get the attribute
                  const fkattr = introspection.attributes.find(
                    (attr) =>
                      attr.attrelid === c.conrelid &&
                      attr.attnum === c.conkey![0],
                  );
                  if (fkattr) {
                    // Override the detected type to pretend to be our enum
                    fkattr.atttypid = enumType._id;
                  }
                }
              });
            });
          }
        }
      },
    },
  },
};

function isEnumConstraint(
  pgClass: PgClass,
  pgConstraint: PgConstraint,
  isEnumTable: boolean,
) {
  if (pgConstraint.conrelid === pgClass._id) {
    const isPrimaryKey = pgConstraint.contype === "p";
    const isUniqueConstraint = pgConstraint.contype === "u";
    if (isPrimaryKey || isUniqueConstraint) {
      const conTags = pgConstraint.getTagsAndDescription().tags;
      const isExplicitEnumConstraint =
        conTags.enum === true || typeof conTags.enum === "string";
      const isPrimaryKeyOfEnumTableConstraint =
        pgConstraint.contype === "p" && isEnumTable;
      if (isExplicitEnumConstraint || isPrimaryKeyOfEnumTableConstraint) {
        const hasExactlyOneColumn = pgConstraint.conkey!.length === 1;
        if (!hasExactlyOneColumn) {
          throw new Error(
            `Enum table "${pgClass.getNamespace()!.nspname}"."${
              pgClass.relname
            }" enum constraint '${
              pgConstraint.conname
            }' is composite; it should have exactly one column (found: ${
              pgConstraint.conkey!.length
            })`,
          );
        }
        return true;
      }
    }
  }
  return false;
}
