import "graphile-config";

import { gatherConfig } from "graphile-build";
import { entityPermissions } from "pg-introspection";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgRBACPlugin: true;
    }

    interface GatherHelpers {
      pgRBAC: Record<string, never>;
    }
  }

  namespace DataplanPg {
    interface PgCodecAttributeExtensions {
      /** Checks permissions to see if SELECTing this attribute is allowed */
      canSelect?: boolean;
      /** Checks permissions to see if INSERTing into this attribute is allowed */
      canInsert?: boolean;
      /** Checks permissions to see if UPDATEing this attribute is allowed */
      canUpdate?: boolean;
    }
    interface PgResourceExtensions {
      /** Checks permissions to see if SELECTing this resource is allowed */
      canSelect?: boolean;
      /** Checks permissions to see if INSERTing this resource is allowed */
      canInsert?: boolean;
      /** Checks permissions to see if UPDATEing this resource is allowed */
      canUpdate?: boolean;
      /** Checks permissions to see if DELETEing this resource is allowed */
      canDelete?: boolean;
      /** Checks permissions to see if EXECUTEing the function is allowed */
      canExecute?: boolean;
    }
  }
}

const EMPTY_OBJECT = Object.freeze({});
export const PgRBACPlugin: GraphileConfig.Plugin = {
  name: "PgRBACPlugin",
  description:
    "Converts the database GRANT/REVOKE privileges to behaviors. Experimental.",
  experimental: true,
  version,
  gather: gatherConfig({
    namespace: "pgRBAC",
    initialCache() {
      return EMPTY_OBJECT;
    },
    initialState() {
      return EMPTY_OBJECT;
    },
    helpers: {},
    hooks: {
      async pgCodecs_attribute(info, event) {
        const { pgAttribute, serviceName, attribute } = event;
        const pgClass = pgAttribute.getClass();
        if (!pgClass || !["r", "v", "m", "f", "p"].includes(pgClass.relkind)) {
          return;
        }
        const db = await info.helpers.pgIntrospection.getService(serviceName);
        const { introspection } = db;

        const introspectionRole = introspection.getCurrentUser();
        if (!introspectionRole) {
          // https://youtu.be/3kx7tgkJbjo?t=11
          throw new Error("WHO AM I?");
        }
        const attributePermissions = entityPermissions(
          introspection,
          pgAttribute,
          introspectionRole,
          true,
        );
        const tablePermissions = entityPermissions(
          introspection,
          pgClass,
          introspectionRole,
          true,
        );
        const canSelect =
          attributePermissions.select || tablePermissions.select;
        const canInsert =
          attributePermissions.insert || tablePermissions.insert;
        const canUpdate =
          attributePermissions.update || tablePermissions.update;
        attribute.extensions = attribute.extensions || Object.create(null);
        Object.assign(attribute.extensions!, {
          canSelect,
          canInsert,
          canUpdate,
        });
      },
      async pgProcedures_PgResourceOptions(info, event) {
        const { pgProc, serviceName, resourceOptions } = event;
        const db = await info.helpers.pgIntrospection.getService(serviceName);
        const { introspection } = db;

        const introspectionRole = introspection.getCurrentUser();
        if (!introspectionRole) {
          // https://youtu.be/3kx7tgkJbjo?t=11
          throw new Error("WHO AM I?");
        }
        const permissions = entityPermissions(
          introspection,
          pgProc,
          introspectionRole,
          true,
        );
        resourceOptions.extensions =
          resourceOptions.extensions || Object.create(null);
        resourceOptions.extensions!.canExecute = permissions.execute ?? true;
      },
      async pgTables_PgResourceOptions(info, event) {
        const { pgClass, resourceOptions, serviceName } = event;
        if (!["r", "v", "m", "f", "p"].includes(pgClass.relkind)) {
          return;
        }
        const db = await info.helpers.pgIntrospection.getService(serviceName);
        const { introspection } = db;
        resourceOptions.extensions =
          resourceOptions.extensions || Object.create(null);

        const introspectionRole = introspection.getCurrentUser();
        if (!introspectionRole) {
          // https://youtu.be/3kx7tgkJbjo?t=11
          throw new Error("WHO AM I?");
        }
        const tablePermissions = entityPermissions(
          introspection,
          pgClass,
          introspectionRole,
          true,
        );

        let canSelect = tablePermissions.select;
        let canInsert = tablePermissions.insert;
        let canUpdate = tablePermissions.update;
        const canDelete = tablePermissions.delete;
        if (!canInsert || !canUpdate || !canSelect) {
          // PERF: this is computationally expensive; we should really make this more efficient.
          // Need to check the attributes
          const attributePermissions = pgClass
            .getAttributes()
            .filter((att) => att.attnum > 0)
            .map((att) =>
              entityPermissions(introspection, att, introspectionRole, true),
            );
          for (const attributePermission of attributePermissions) {
            canSelect = canSelect || attributePermission.select;
            canInsert = canInsert || attributePermission.insert;
            canUpdate = canUpdate || attributePermission.update;
          }
        }
        Object.assign(resourceOptions.extensions!, {
          canSelect,
          canInsert,
          canUpdate,
          canDelete,
        });
      },
    },
  }),

  schema: {
    entityBehavior: {
      pgCodecAttribute: {
        inferred(behavior, [codec, attributeName]) {
          const attr = codec.attributes[attributeName];
          const newBehavior = [behavior];
          if (attr.extensions?.canSelect === false) {
            // Only remove `select` privileges if at least one sibling attribute has
            // a grant - otherwise assume that this is behind a function or
            // similar and all attributes are allowed you just can't select
            // directly.
            const hasSiblingWithSelect = Object.entries(codec.attributes).some(
              ([otherAttrName, otherAttr]) =>
                otherAttrName !== attributeName &&
                otherAttr.extensions?.canSelect !== false,
            );
            if (hasSiblingWithSelect) {
              newBehavior.push("-select", "-filterBy", "-orderBy");
            }
          }
          if (attr.extensions?.canInsert === false) {
            newBehavior.push("-insert");
          }
          if (attr.extensions?.canUpdate === false) {
            newBehavior.push("-update");
          }
          return newBehavior;
        },
      },
      pgResource: {
        inferred(behavior, resource) {
          const newBehavior = [behavior];
          const {
            canSelect = true,
            canInsert = true,
            canUpdate = true,
            canDelete = true,
            canExecute = true,
          } = resource.extensions ?? {};
          if (!canExecute) {
            newBehavior.push(
              "-queryField",
              "-mutationField",
              "-typeField",
              "-orderBy",
              "-filterBy",
            );
          }
          if (!canSelect) {
            // TODO: just `-select` should be sufficient, but it's not because we
            // don't check it in enough places. Maybe certain behaviors should
            // require others?
            newBehavior.push("-select", "-single", "-list", "-connection");
          }
          if (!canInsert) {
            newBehavior.push("-insert");
          }
          if (!canUpdate) {
            newBehavior.push("-update");
          }
          if (!canDelete) {
            newBehavior.push("-delete");
          }
          return newBehavior;
        },
      },
    },
  },
};
