import type { PgEnumCodec, PgEnumValue } from "@dataplan/pg";
import { enumCodec } from "@dataplan/pg";
import type {
  Introspection,
  PgAttribute,
  PgClass,
  PgConstraint,
} from "pg-introspection";
import { sql } from "pg-sql2";

import { withPgClientFromPgConfig } from "../pgConfigs.js";
import { addBehaviorToTags } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgEnumTables: {
        getIntrospectionData(
          databaseName: string,
          pgClass: PgClass,
          columns: PgAttribute[],
        ): Promise<readonly Record<string, string>[]>;
        processIntrospection(event: {
          databaseName: string;
          introspection: Introspection;
        }): Promise<void>;
      };
    }
  }

  namespace GraphileBuild {
    interface Inflection {
      enumTableCodec(
        this: Inflection,
        details: {
          databaseName: string;
          pgClass: PgClass;
          pgConstraint: PgConstraint;
        },
      ): string;
    }
  }
}

interface State {
  codecByPgConstraint: Map<PgConstraint, PgEnumCodec>;
  codecByPgAttribute: Map<PgAttribute, PgEnumCodec>;
}
interface Cache {}

// TODO: Assert the columns are text
/*
const VARCHAR_ID = "1043";
const TEXT_ID = "25";
const CHAR_ID = "18";
const BPCHAR_ID = "1042";

const VALID_TYPE_IDS = [VARCHAR_ID, TEXT_ID, CHAR_ID, BPCHAR_ID];
*/

export const PgEnumTablesPlugin: GraphileConfig.Plugin = {
  name: "PgEnumTablesPlugin",
  description: "Converts columns that reference `@enum` tables into enums",
  version,
  after: ["PgFakeConstraintsPlugin"],

  inflection: {
    add: {
      enumTableCodec(preset, { databaseName, pgConstraint }) {
        const pgClass = pgConstraint.getClass()!;
        const constraintTags = pgConstraint.getTags();
        if (typeof constraintTags.enumName === "string") {
          return constraintTags.enumName;
        }
        if (pgConstraint.contype === "p") {
          const classTags = pgClass.getTags();
          if (typeof classTags.enumName === "string") {
            return classTags.enumName;
          }
          return this.tableResourceName({ databaseName, pgClass });
        } else {
          const tableName = this.tableResourceName({ databaseName, pgClass });
          const pgAttribute = pgClass
            .getAttributes()!
            .find((att) => att.attnum === pgConstraint.conkey![0])!;
          return this.upperCamelCase(`${tableName}-${pgAttribute.attname}`);
        }
      },
    },
  },

  gather: <GraphileConfig.PluginGatherConfig<"pgEnumTables", State, Cache>>{
    namespace: "pgEnumTables",
    initialState: (): State => ({
      codecByPgConstraint: new Map(),
      codecByPgAttribute: new Map(),
    }),
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

        const pgConfig = info.resolvedPreset.pgConfigs!.find(
          (pgConfig) => pgConfig.name === databaseName,
        );
        try {
          const { rows } = await withPgClientFromPgConfig(
            pgConfig!,
            null,
            (client) => client.query<Record<string, string>>(query),
          );
          return rows;
        } catch (e) {
          let role = "RELEVANT_POSTGRES_USER";
          try {
            const { rows } = await withPgClientFromPgConfig(
              pgConfig!,
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
      async processIntrospection(info, event) {
        const { introspection, databaseName } = event;
        for (const pgClass of introspection.classes) {
          const pgNamespace = pgClass.getNamespace();
          if (!pgNamespace) {
            continue;
          }
          const { tags, description: _description } =
            pgClass.getTagsAndDescription();
          const isEnumTable =
            tags.enum === true || typeof tags.enum === "string";

          if (isEnumTable) {
            // Prevent the table being recognised as a table
            addBehaviorToTags(tags, "-*", true);
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
            enumTableColumns.find((attr) => attr.getTags().enumDescription) ||
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

            for (const pgConstraint of enumConstraints) {
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

              const originalCodec =
                await info.helpers.pgCodecs.getCodecFromType(
                  databaseName,
                  pgAttribute.atttypid,
                  pgAttribute.atttypmod,
                );
              if (!originalCodec) {
                // TODO: throw an error?
                continue;
              }

              // TODO: values should be an object array to leave space for description, etc?
              const values: Array<PgEnumValue> = data.map(
                (r): PgEnumValue => ({
                  value: r[pgAttribute.attname],
                  description: descriptionColumn
                    ? r[descriptionColumn.attname]
                    : undefined,
                }),
              );

              // Build the codec
              const codec = enumCodec({
                name: info.inflection.enumTableCodec({
                  databaseName,
                  pgClass,
                  pgConstraint,
                }),
                identifier: originalCodec.sqlType,
                values,
                // TODO: extensions?
              });

              // Associate this constraint with our new codec
              info.state.codecByPgConstraint.set(pgConstraint, codec);

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
                    // Associate this attribute with our new codec
                    info.state.codecByPgAttribute.set(fkattr, codec);
                  }
                }
              });
            }
          }
        }
      },
    },
    hooks: {
      // Run in the 'introspection' phase before anything uses the tags
      async pgIntrospection_introspection(info, event) {
        await info.helpers.pgEnumTables.processIntrospection(event);
      },
      pgCodecs_column(info, event) {
        const { column, pgAttribute } = event;
        const replacementCodec = info.state.codecByPgAttribute.get(pgAttribute);
        if (replacementCodec) {
          column.codec = replacementCodec;
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
      const conTags = pgConstraint.getTags();
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
