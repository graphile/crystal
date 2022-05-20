import { PgSourceOptions, PgSourceUnique } from "@dataplan/pg";
import { GatherPluginContext } from "graphile-build";
import "graphile-config";
import { PluginHook } from "graphile-config";
import { parseSmartComment, PgClass, PgConstraint } from "pg-introspection";
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
}
interface Cache {}

export const PgFakeConstraintsPlugin: GraphileConfig.Plugin = {
  name: "PgFakeConstraintsPlugin",
  description:
    "Looks for the @primaryKey, @foreignKey, @unique and @nonNull smart comments and changes the Data Sources such that it's as if these were concrete constraints",
  version: version,

  gather: {
    namespace: "pgFakeConstraints",
    helpers: {},
    initialState: () => ({
      fakeId: 0,
    }),
    hooks: {
      async pgTables_PgSourceBuilder_options(info, event) {
        const { databaseName, pgClass, options } = event;
        const tags = options.extensions?.tags;
        const knownColumns = Object.keys(options.codec.columns);
        if (tags) {
          if (tags.primaryKey) {
            await processUnique(info, event, tags.primaryKey, true);
          }

          if (tags.unique) {
            if (Array.isArray(tags.unique)) {
              for (const uniq of tags.unique) {
                await processUnique(info, event, uniq);
              }
            } else {
              await processUnique(info, event, tags.unique);
            }
          }

          if (tags.foreignKey) {
          }
        }
      },
    },
  } as GraphileConfig.PluginGatherConfig<"pgFakeConstraints", State, Cache>,
};

function parseConstraintSpec(rawSpec: string) {
  const [spec, ...tagComponents] = rawSpec.split(/\|/);
  return [spec, tagComponents.join("\n")];
}

async function processUnique(
  info: GatherPluginContext<State, Cache>,
  event: {
    databaseName: string;
    pgClass: PgClass;
    options: PgSourceOptions<any, any, any, any>;
  },
  rawSpec: string | true | (string | true)[],
  primaryKey = false,
) {
  const identity = () =>
    `${pgClass.getNamespace()!.nspname}.${pgClass.relname}`;
  const id = `_fake_constraint_${info.state.fakeId++}`;
  const { databaseName, pgClass, options } = event;
  const tag = primaryKey ? "primaryKey" : "unique";
  if (typeof rawSpec !== "string") {
    throw new Error(
      `Invalid '@${tag}' smart tag on ${identity()}; expected a string`,
    );
  }
  const [spec, extraDescription] = parseConstraintSpec(rawSpec);
  const columns = spec.split(",");
  const allAttrs = pgClass.getAttributes();
  const attrs = columns.map(
    (col) => allAttrs.find((attr) => attr.attname === col)!,
  );
  for (let i = 0, l = attrs.length; i < l; i++) {
    const attr = attrs[i];
    const col = columns[i];
    if (!attr) {
      throw new Error(
        `'@${tag}' smart tag on ${identity()} referenced non-existent column '${col}'; known columns: ${allAttrs
          .filter((a) => a.attnum >= 0)
          .map((attr) => attr.attname)
          .join(", ")}`,
      );
    }
  }
  const unique: PgSourceUnique = {
    columns,
    isPrimary: true,
  };
  if (!options.uniques) {
    options.uniques = [];
  }
  const tagsAndDescription = parseSmartComment(extraDescription);

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

  // And pretend it's real:
  await info.process("pgTables_unique", {
    databaseName,
    pgClass,
    pgConstraint,
    unique,
  });

  options.uniques.push(unique);
}
