import "graphile-build";

import type { PgSourceColumns, PgTypeCodec } from "@dataplan/pg";
import {
  getCodecByPgCatalogTypeName,
  listOfType,
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
