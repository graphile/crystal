import type { PgSourceOptions, PgSourceUnique } from "@dataplan/pg";
import type { GatherPluginContext } from "graphile-build";
import type { PgAttribute, PgClass, PgConstraint } from "pg-introspection";
import { parseSmartComment } from "pg-introspection";

import { version } from "../index.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgFakeConstraints: Record<string, never>;
    }
  }
}

interface State {
  fakeId: number;
  fakeConstraintsByDatabaseName: {
    [databaseName: string]: PgConstraint[];
  };
  promises: Promise<any>[];
}
interface Cache {}

export const PgFakeConstraintsPlugin: GraphileConfig.Plugin = {
  name: "PgFakeConstraintsPlugin",
  description:
    "Looks for the @primaryKey, @foreignKey, @unique and @nonNull smart comments and changes the Data Sources such that it's as if these were concrete constraints",
  version: version,
  after: ["PgSmartCommentsPlugin"],

  gather: {
    namespace: "pgFakeConstraints",
    helpers: {},
    initialState: () => ({
      fakeId: 0,
      fakeConstraintsByDatabaseName: Object.create(null),
      promises: [],
    }),
    hooks: {
      // We detect "fake" foreign key constraints during the "introspection"
      // phase (which runs first) because we need it to already be established
      // for _all_ classes by the time pgTables_PgSourceBuilder_relations is
      // called (otherwise we may get race conditions and relations only being
      // defined in one direction).
      async pgIntrospection_introspection(info, event) {
        const { databaseName, introspection } = event;

        for (const pgClass of introspection.classes) {
          const { tags } = pgClass.getTagsAndDescription();

          if (tags.primaryKey) {
            await processUnique(
              info,
              { databaseName, pgClass },
              tags.primaryKey,
              true,
            );
          }

          if (tags.unique) {
            if (Array.isArray(tags.unique)) {
              for (const uniq of tags.unique) {
                await processUnique(info, { databaseName, pgClass }, uniq);
              }
            } else {
              await processUnique(info, { databaseName, pgClass }, tags.unique);
            }
          }

          if (tags.foreignKey) {
            if (Array.isArray(tags.foreignKey)) {
              for (const fk of tags.foreignKey) {
                await processFk(info, { databaseName, pgClass }, fk);
              }
            } else {
              await processFk(info, { databaseName, pgClass }, tags.foreignKey);
            }
          }
        }
      },

      async pgCodecs_column(info, event) {
        const { column } = event;
        const tags = column.extensions?.tags;
        if (tags?.notNull) {
          column.notNull = true;
        }
      },

      async pgTables_PgSourceBuilder_options(info, event) {
        const { databaseName, pgClass, options } = event;

        const fakeConstraints =
          info.state.fakeConstraintsByDatabaseName[event.databaseName];
        if (!fakeConstraints) {
          return;
        }

        for (const pgConstraint of fakeConstraints) {
          if (pgConstraint.contype === "p") {
            await addUnique(
              info,
              { databaseName, pgClass, pgConstraint, options },
              true,
            );
          } else if (pgConstraint.contype === "u") {
            await addUnique(
              info,
              { databaseName, pgClass, pgConstraint, options },
              false,
            );
          }
        }
      },

      async pgTables_PgSourceBuilder_relations(info, event) {
        const fakeConstraints =
          info.state.fakeConstraintsByDatabaseName[event.databaseName];
        console.log(event.pgClass.relname, fakeConstraints);
        if (!fakeConstraints) {
          return;
        }
        for (const pgConstraint of fakeConstraints) {
          if (pgConstraint.contype !== "f") {
            continue;
          }
          if (pgConstraint.conrelid === event.pgClass._id) {
            console.log(
              `Adding fake forward relation from ${event.pgClass.relname} to ${
                pgConstraint.getForeignClass()!.relname
              }`,
            );
            // Forwards
            await info.helpers.pgRelations.addRelation(event, pgConstraint);
          } else if (pgConstraint.confrelid === event.pgClass._id) {
            console.log(
              `Adding fake backward relation from ${event.pgClass.relname} to ${
                pgConstraint.getClass()!.relname
              }`,
            );

            // Backwards
            await info.helpers.pgRelations.addRelation(
              event,
              pgConstraint,
              true,
            );
          }
        }
      },
    },
    async main(output, info) {
      await Promise.all(info.state.promises);
    },
  } as GraphileConfig.PluginGatherConfig<"pgFakeConstraints", State, Cache>,
};

function parseConstraintSpec(rawSpec: string) {
  const [spec, ...tagComponents] = rawSpec.split(/\|/);
  return [spec, tagComponents.join("\n")];
}

function attributesByNames(
  pgClass: PgClass,
  names: string[] | null,
  identity: () => string,
): PgAttribute[] {
  const allAttrs = pgClass.getAttributes();
  if (!names) {
    const pk = pgClass.getConstraints().find((con) => con.contype === "p");
    if (pk) {
      return pk.conkey!.map((n) => allAttrs.find((a) => a.attnum === n)!);
    } else {
      throw new Error(
        `No columns specified for '${pgClass.getNamespace()!.nspname}.${
          pgClass.relname
        }' (oid: ${pgClass._id}) and no PK found.`,
      );
    }
  } else {
    const attrs = names.map(
      (col) => allAttrs.find((attr) => attr.attname === col)!,
    );
    for (let i = 0, l = attrs.length; i < l; i++) {
      const attr = attrs[i];
      const col = names[i];
      if (!attr) {
        throw new Error(
          `${identity()} referenced non-existent column '${col}'; known columns: ${allAttrs
            .filter((a) => a.attnum >= 0)
            .map((attr) => attr.attname)
            .join(", ")}`,
        );
      }
    }

    return attrs;
  }
}

async function processUnique(
  info: GatherPluginContext<State, Cache>,
  event: {
    databaseName: string;
    pgClass: PgClass;
  },
  rawSpec: string | true | (string | true)[],
  primaryKey = false,
) {
  const identity = () =>
    `${pgClass.getNamespace()!.nspname}.${pgClass.relname}`;
  const { databaseName, pgClass } = event;
  const tag = primaryKey ? "primaryKey" : "unique";
  if (typeof rawSpec !== "string") {
    throw new Error(
      `Invalid '@${tag}' smart tag on ${identity()}; expected a string`,
    );
  }
  const [spec, extraDescription] = parseConstraintSpec(rawSpec);
  const columns = spec.split(",");
  const attrs = attributesByNames(
    pgClass,
    columns,
    () => `'@${tag}' smart tag on ${identity()}`,
  );
  const tagsAndDescription = parseSmartComment(extraDescription);

  const id = `FAKE_${pgClass.getNamespace()!.nspname}_${
    pgClass.relname
  }_${tag}_${info.state.fakeId++}`;

  // Now we fake the constraint
  const pgConstraint: PgConstraint = {
    _id: id,
    conname: id,
    connamespace: pgClass.relnamespace,
    contype: primaryKey ? "p" : "u",
    condeferrable: false,
    condeferred: false,
    convalidated: true,
    conrelid: pgClass._id,
    contypid: "0",
    conindid: "0",
    confrelid: "0",
    confupdtype: null,
    confdeltype: null,
    confmatchtype: null,
    conislocal: true,
    coninhcount: 0,
    connoinherit: null,
    conkey: attrs.map((c) => c.attnum),
    confkey: null,
    conpfeqop: null,
    conppeqop: null,
    conffeqop: null,
    conexclop: null,
    conbin: null,
    getClass: () => pgClass,
    getDescription: () => extraDescription,
    getTagsAndDescription: () => tagsAndDescription,
    getForeignClass: () => undefined,
    getNamespace: () => pgClass.getNamespace(),
    getType: () => undefined,
  };

  info.state.fakeConstraintsByDatabaseName[databaseName] =
    info.state.fakeConstraintsByDatabaseName[databaseName] || [];
  info.state.fakeConstraintsByDatabaseName[databaseName].push(pgConstraint);
}

async function addUnique(
  info: GatherPluginContext<State, Cache>,
  event: {
    databaseName: string;
    pgClass: PgClass;
    pgConstraint: PgConstraint;
    options: PgSourceOptions<any, any, any, any>;
  },
  isPrimary = false,
) {
  const { databaseName, pgClass, pgConstraint, options } = event;

  const attrs = pgClass.getAttributes();
  const columns = pgConstraint.conkey!.map(
    (num) => attrs.find((att) => att.attnum === num)!.attname,
  );

  const unique: PgSourceUnique = {
    columns,
    isPrimary,
  };
  if (!options.uniques) {
    options.uniques = [];
  }
  // And pretend it's real:
  await info.process("pgTables_unique", {
    databaseName,
    pgClass,
    pgConstraint,
    unique,
  });

  options.uniques.push(unique);
}

const removeQuotes = (str: string) => {
  const trimmed = str.trim();
  if (trimmed[0] === '"') {
    if (trimmed[trimmed.length - 1] !== '"') {
      throw new Error(
        `We failed to parse a quoted identifier '${str}'. Please avoid putting quotes or commas in smart comment identifiers (or file a PR to fix the parser).`,
      );
    }
    return trimmed.slice(1, -1);
  } else {
    // PostgreSQL lower-cases unquoted columns, so we should too.
    return trimmed.toLowerCase();
  }
};

const parseSqlColumnArray = (str: string) => {
  if (!str) {
    throw new Error(`Cannot parse '${str}'`);
  }
  const parts = str.split(",");
  return parts.map(removeQuotes);
};

const parseSqlColumnString = (str: string) => {
  if (!str) {
    throw new Error(`Cannot parse '${str}'`);
  }
  return removeQuotes(str);
};

async function processFk(
  info: GatherPluginContext<State, Cache>,
  event: {
    databaseName: string;
    pgClass: PgClass;
  },
  rawSpec: string | true | (string | true)[],
) {
  const identity = () =>
    `${pgClass.getNamespace()!.nspname}.${pgClass.relname}`;
  const { databaseName, pgClass } = event;
  if (typeof rawSpec !== "string") {
    throw new Error(
      `Invalid '@foreignKey' smart tag on ${identity()}; expected a string`,
    );
  }
  const [spec, extraDescription] = parseConstraintSpec(rawSpec);
  const matches = spec.match(
    /^\(([^()]+)\) references ([^().]+)(?:\.([^().]+))?(?:\s*\(([^()]+)\))?$/i,
  );
  if (!matches) {
    throw new Error(
      `Invalid @foreignKey syntax on '${identity()}'; expected something like "(col1,col2) references schema.table (c1, c2)", you passed '${spec}'`,
    );
  }
  const [, rawColumns, rawSchemaOrTable, rawTableOnly, rawForeignColumns] =
    matches;
  const rawSchema = rawTableOnly
    ? rawSchemaOrTable
    : `"${pgClass.getNamespace()!.nspname}"`;
  const rawTable = rawTableOnly || rawSchemaOrTable;
  const columns: string[] = parseSqlColumnArray(rawColumns);
  const foreignSchema: string = parseSqlColumnString(rawSchema);
  const foreignTable: string = parseSqlColumnString(rawTable);
  const foreignColumns: string[] | null = rawForeignColumns
    ? parseSqlColumnArray(rawForeignColumns)
    : null;

  const foreignPgClass = await info.helpers.pgIntrospection.getClassByName(
    databaseName,
    foreignSchema,
    foreignTable,
  );
  if (!foreignPgClass) {
    throw new Error(
      `Invalid @foreignKey on '${identity()}'; referenced non-existent table/view '${foreignSchema}.${foreignTable}'. Note that this reference must use *database names* (i.e. it does not respect @name). (${rawSpec})`,
    );
  }
  const keyAttibutes = attributesByNames(
    pgClass,
    columns,
    () => `'@foreignKey' smart tag on ${identity()} local columns`,
  );
  const foreignKeyAttibutes = attributesByNames(
    foreignPgClass,
    foreignColumns,
    () => `'@foreignKey' smart tag on ${identity()} remote columns`,
  );

  const tagsAndDescription = parseSmartComment(extraDescription);

  const id = `FAKE_${pgClass.getNamespace()!.nspname}_${
    pgClass.relname
  }_foreignKey_${info.state.fakeId++}`;

  // Now we fake the constraint
  const pgConstraint: PgConstraint = {
    _id: id,
    conname: id,
    connamespace: pgClass.relnamespace,
    contype: "f",
    condeferrable: false,
    condeferred: false,
    convalidated: true,
    conrelid: pgClass._id,
    contypid: "0",
    conindid: "0",
    confrelid: foreignPgClass._id,
    confupdtype: "a",
    confdeltype: "a",
    confmatchtype: "s",
    conislocal: true,
    coninhcount: 0,
    connoinherit: null,
    conkey: keyAttibutes.map((c) => c.attnum),
    confkey: foreignKeyAttibutes.map((c) => c.attnum),
    conpfeqop: null,
    conppeqop: null,
    conffeqop: null,
    conexclop: null,
    conbin: null,
    getClass: () => pgClass,
    getDescription: () => extraDescription,
    getTagsAndDescription: () => tagsAndDescription,
    getForeignClass: () => foreignPgClass,
    getNamespace: () => pgClass.getNamespace(),
    getType: () => undefined,
  };

  console.log("Added fakeFkConstraints");
  // And register it into our cache
  info.state.fakeConstraintsByDatabaseName[databaseName] =
    info.state.fakeConstraintsByDatabaseName[databaseName] || [];
  info.state.fakeConstraintsByDatabaseName[databaseName].push(pgConstraint);
}
