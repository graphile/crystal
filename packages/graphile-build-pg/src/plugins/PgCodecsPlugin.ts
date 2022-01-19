import "graphile-build";

import type { PgSourceColumns, PgTypeCodec } from "@dataplan/pg";
import { listOfType, TYPES } from "@dataplan/pg";
import { recordType } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin, PluginGatherConfig } from "graphile-plugin";
import sql from "pg-sql2";

import { version } from "../index";
import type { PgClass } from "../introspection";

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
            (className, columns, nspName, recordType, sql) => recordType(sql.identifier(nspName, className), columns),
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

          if (type.typtype === "c") {
            // Class type
            return info.helpers.pgCodecs.getCodecFromClass(
              databaseName,
              type.typrelid!,
            );
          }

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

          const pgCatalog =
            await info.helpers.pgIntrospection.getNamespaceByName(
              databaseName,
              "pg_catalog",
            );
          if (!pgCatalog) {
            return null;
          }

          if (type.typnamespace == pgCatalog._id) {
            // Native types
            switch (type.typname) {
              case "bool":
                return TYPES.boolean;

              // TODO!
              //case "bytea":
              //  return TYPES.bytea;

              case "char":
                return TYPES.char;
              case "varchar":
                return TYPES.varchar;
              case "text":
                return TYPES.char;
              case "uuid":
                return TYPES.uuid;

              case "xml":
                return TYPES.xml;
              case "json":
                return TYPES.json;
              case "jsonb":
                return TYPES.jsonb;

              case "bit":
                return TYPES.bit;
              case "varbit":
                return TYPES.varbit;

              case "int2":
                return TYPES.int2;
              case "int4":
                return TYPES.int;
              case "int8":
                return TYPES.bigint;
              case "float8":
                return TYPES.float;
              case "float4":
                return TYPES.float4;
              case "numeric":
                return TYPES.numeric;
              case "money":
                return TYPES.money;

              case "box":
                return TYPES.box;
              case "point":
                return TYPES.point;
              case "line":
                return TYPES.line;
              case "lseg":
                return TYPES.lseg;
              case "circle":
                return TYPES.circle;
              case "polygon":
                return TYPES.polygon;

              case "cidr":
                return TYPES.cidr;
              case "inet":
                return TYPES.inet;
              case "macaddr":
                return TYPES.macaddr;
              case "macaddr8":
                return TYPES.macaddr8;

              case "date":
                return TYPES.date;
              case "timestamp":
                return TYPES.timestamp;
              case "timestamptz":
                return TYPES.timestamptz;
              case "time":
                return TYPES.time;
              case "timetz":
                return TYPES.timetz;
              case "interval":
                return TYPES.interval;

              case "regclass":
                return TYPES.regclass;
              case "regconfig":
                return TYPES.regconfig;
              case "regdictionary":
                return TYPES.regdictionary;
              case "regnamespace":
                return TYPES.regnamespace;
              case "regoper":
                return TYPES.regoper;
              case "regoperator":
                return TYPES.regoperator;
              case "regproc":
                return TYPES.regproc;
              case "regprocedure":
                return TYPES.regprocedure;
              case "regrole":
                return TYPES.regrole;
              case "regtype":
                return TYPES.regtype;
            }
          }

          // TODO: this is technically unsafe; we should check the namespace
          // matches the citext extension namespace
          if (type.typname === "citext") {
            return TYPES.citext;
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
};
