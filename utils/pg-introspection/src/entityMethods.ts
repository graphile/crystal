import {
  OBJECT_COLUMN,
  OBJECT_DATABASE,
  OBJECT_FUNCTION,
  OBJECT_SCHEMA,
  OBJECT_SEQUENCE,
  OBJECT_TABLE,
  parseAcls,
} from "./acl.ts";
import type {
  Introspection,
  IntrospectionLookups,
  PgAttribute,
  PgClass,
  PgConstraint,
  PgDatabase,
  PgDescription,
  PgEnum,
  PgIndex,
  PgInherits,
  PgNamespace,
  PgProc,
  PgProcArgument,
  PgRange,
  PgRoles,
  PgType,
} from "./interfaces.ts";
import type {
  PgAttributeData,
  PgClassData,
  PgConstraintData,
  PgDatabaseData,
  PgEnumData,
  PgIndexData,
  PgInheritsData,
  PgNamespaceData,
  PgProcData,
  PgRangeData,
  PgTypeData,
} from "./introspection.ts";
import type { PgSmartTagsAndDescription } from "./smartComments.ts";
import { parseSmartComment } from "./smartComments.ts";

function memo<TThis, TResult>(
  fn: (this: TThis) => TResult,
): (this: TThis) => TResult {
  let cache: TResult;
  let called = false;
  return function (this: TThis) {
    if (!called) {
      cache = fn.call(this);
      called = true;
    }
    return cache!;
  };
}
function descriptionKey(
  spec: Pick<PgDescription, "classoid" | "objoid" | "objsubid">,
) {
  return `${spec.classoid}|${spec.objoid}|${spec.objsubid}`;
}
function namespaceNameKey(namespaceId: string, name: string | null) {
  return `${namespaceId}|${name}`;
}
function attributeRelNumKey(relid: string, attnum: number) {
  return `${relid}|${attnum}`;
}

export function createEntityMethods(
  getIntrospection: () => Introspection<never>,
  lookups: IntrospectionLookups,
) {
  const {
    oidByCatalog,
    roleById,
    namespaceById,
    typeById,
    classById,
    classByNamespaceName,
    rangeByTypid,
    attributesByRelId,
    attributeByRelIdAndNum,
    constraintsByRelid,
    constraintByNamespaceName,
    foreignConstraintsByRelid,
    enumsByTypid,
    indexesByRelid,
    descriptionByDescriptionKey,
    procsByNamespaceName,
    accessMethodById,
  } = lookups;
  const getRole = (id: string | null): PgRoles | undefined =>
    id != null ? roleById.get(id) : undefined;
  const getNamespace = (id: string | null): PgNamespace | undefined =>
    id != null ? namespaceById.get(id) : undefined;
  const getType = (id: string | null): PgType | undefined =>
    id != null ? typeById.get(id) : undefined;
  const getClass = (id: string | null): PgClass | undefined =>
    id != null ? classById.get(id) : undefined;
  const getRange = (id: string | null): PgRange | undefined =>
    id != null ? rangeByTypid.get(id) : undefined;
  const getAttributes = (id: string | null): PgAttribute[] =>
    id != null ? (attributesByRelId.get(id) ?? []) : [];
  const getConstraints = (id: string | null): PgConstraint[] =>
    id != null ? (constraintsByRelid.get(id) ?? []) : [];
  const getForeignConstraints = (id: string | null): PgConstraint[] =>
    id != null ? (foreignConstraintsByRelid.get(id) ?? []) : [];
  const getEnums = (id: string | null): PgEnum[] =>
    id != null ? (enumsByTypid.get(id) ?? []) : [];
  const getIndexes = (id: string | null): PgIndex[] =>
    id != null ? (indexesByRelid.get(id) ?? []) : [];

  const PG_NAMESPACE = oidByCatalog["pg_namespace"];
  const PG_CLASS = oidByCatalog["pg_class"];
  const PG_PROC = oidByCatalog["pg_proc"];
  const PG_TYPE = oidByCatalog["pg_type"];
  const PG_CONSTRAINT = oidByCatalog["pg_constraint"];
  const PG_EXTENSION = oidByCatalog["pg_extension"];

  if (
    !PG_NAMESPACE ||
    !PG_CLASS ||
    !PG_PROC ||
    !PG_TYPE ||
    !PG_CONSTRAINT ||
    !PG_EXTENSION
  ) {
    throw new Error(
      `Invalid introspection results; could not determine the ids of the system catalogs`,
    );
  }

  const getDescription = (
    classoid: string,
    objoid: string,
    objsubid = 0,
  ): string | undefined =>
    descriptionByDescriptionKey.get(
      descriptionKey({ classoid, objoid, objsubid }),
    )?.description;

  const getTagsAndDescription = (
    classoid: string,
    objoid: string,
    objsubid?: number,
    fallback?: {
      classoid: string;
      objoid: string;
      objsubid?: number;
    },
  ): PgSmartTagsAndDescription => {
    let description = getDescription(classoid, objoid, objsubid);
    if (description == null && fallback) {
      description = getDescription(
        fallback.classoid,
        fallback.objoid,
        fallback.objsubid,
      );
    }
    return parseSmartComment(description);
  };

  function PgDatabaseMethods(): Omit<PgDatabase, keyof PgDatabaseData> {
    const getOwner = memo(function (this: PgDatabase) {
      return roleById.get(this.datdba);
    });
    return {
      _type: "PgDatabase",
      getOwner,
      getDba: getOwner,
      getACL: memo(function (this: PgDatabase) {
        return parseAcls(
          getIntrospection(),
          this.datacl,
          this.datdba,
          OBJECT_DATABASE,
        );
      }),
    };
  }

  function PgNamespaceMethods(): Omit<PgNamespace, keyof PgNamespaceData> {
    return {
      _type: "PgNamespace",
      getOwner: memo(function (this: PgNamespace) {
        return getRole(this.nspowner);
      }),
      getDescription: memo(function (this: PgNamespace) {
        return getDescription(PG_NAMESPACE, this._id);
      }),
      getTagsAndDescription: memo(function (this: PgNamespace) {
        return getTagsAndDescription(PG_NAMESPACE, this._id);
      }),
      getTags: memo(function (this: PgNamespace) {
        return this.getTagsAndDescription().tags;
      }),
      getACL: memo(function (this: PgNamespace) {
        return parseAcls(
          getIntrospection(),
          this.nspacl,
          this.nspowner,
          OBJECT_SCHEMA,
        );
      }),
      getClass: function (this: PgNamespace, by) {
        return classByNamespaceName.get(namespaceNameKey(this._id, by.name));
      },
      getConstraint: function (this: PgNamespace, by) {
        return constraintByNamespaceName.get(
          namespaceNameKey(this._id, by.name),
        );
      },
      getProcs: function (this: PgNamespace, by) {
        return (
          procsByNamespaceName.get(namespaceNameKey(this._id, by.name)) ?? []
        );
      },
    };
  }

  function PgClassMethods(): Omit<PgClass, keyof PgClassData> {
    return {
      _type: "PgClass",
      getNamespace: memo(function (this: PgClass) {
        return getNamespace(this.relnamespace);
      }),
      getType: memo(function (this: PgClass) {
        return getType(this.reltype);
      }),
      getOfType: memo(function (this: PgClass) {
        return getType(this.reloftype);
      }),
      getOwner: memo(function (this: PgClass) {
        return getRole(this.relowner);
      }),
      getAttributes: memo(function (this: PgClass) {
        return getAttributes(this._id);
      }),
      getConstraints: memo(function (this: PgClass) {
        return getConstraints(this._id);
      }),
      getForeignConstraints: memo(function (this: PgClass) {
        return getForeignConstraints(this._id);
      }),
      getIndexes: memo(function (this: PgClass) {
        return getIndexes(this._id);
      }),
      getDescription: memo(function (this: PgClass) {
        return getDescription(PG_CLASS, this._id, 0);
      }),
      getTagsAndDescription: memo(function (this: PgClass) {
        return getTagsAndDescription(PG_CLASS, this._id, 0, {
          classoid: PG_TYPE,
          objoid: this.reltype,
        });
      }),
      getTags: memo(function (this: PgClass) {
        return this.getTagsAndDescription().tags;
      }),
      getACL: memo(function (this: PgClass) {
        return parseAcls(
          getIntrospection(),
          this.relacl,
          this.relowner,
          this.relkind === "S" ? OBJECT_SEQUENCE : OBJECT_TABLE,
        );
      }),
      getAttribute: function (this: PgClass, by) {
        const attributes = this.getAttributes();
        return attributes.find((att) =>
          "number" in by && by.number
            ? att.attnum === by.number
            : "name" in by && by.name
              ? att.attname === by.name
              : false,
        );
      },
      getInherited: memo(function (this: PgClass) {
        const inherits = getIntrospection().inherits;
        if (!inherits) {
          throw new Error(
            "Can't getInherited if inherits is not included in introspection",
          );
        }
        return inherits.filter((inh) => inh.inhrelid === this._id);
      }),
      getAccessMethod: memo(function (this: PgClass) {
        return this.relam != null
          ? accessMethodById.get(this.relam)
          : undefined;
      }),
    };
  }

  function PgIndexMethods(): Omit<PgIndex, keyof PgIndexData> {
    return {
      _type: "PgIndex",
      getIndexClass: memo(function (this: PgIndex) {
        return getClass(this.indexrelid);
      }),
      getClass: memo(function (this: PgIndex) {
        return getClass(this.indrelid);
      }),
      getKeys: memo(function (this: PgIndex) {
        const owner = getClass(this.indrelid);
        const keys = this.indkey;
        return keys.map((key) =>
          key === 0
            ? null
            : attributeByRelIdAndNum.get(attributeRelNumKey(owner!._id, key))!,
        );
      }),
      getDescription: memo(function (this: PgIndex) {
        return this.getIndexClass()?.getDescription();
      }),
      getTagsAndDescription: memo(function (this: PgIndex) {
        return (
          this.getIndexClass()?.getTagsAndDescription() ?? {
            tags: Object.create(null),
            description: undefined,
          }
        );
      }),
      getTags: memo(function (this: PgIndex) {
        return this.getTagsAndDescription().tags;
      }),
    };
  }

  function PgAttributeMethods(): Omit<PgAttribute, keyof PgAttributeData> {
    return {
      _type: "PgAttribute",
      getClass: memo(function (this: PgAttribute) {
        return getClass(this.attrelid);
      }),
      getType: memo(function (this: PgAttribute) {
        return getType(this.atttypid);
      }),
      getDescription: memo(function (this: PgAttribute) {
        return getDescription(PG_CLASS, this.attrelid, this.attnum);
      }),
      getTagsAndDescription: memo(function (this: PgAttribute) {
        return getTagsAndDescription(PG_CLASS, this.attrelid, this.attnum);
      }),
      getTags: memo(function (this: PgAttribute) {
        return this.getTagsAndDescription().tags;
      }),
      getACL: memo(function (this: PgAttribute) {
        return parseAcls(
          getIntrospection(),
          this.attacl,
          this.getClass()!.relowner,
          OBJECT_COLUMN,
        );
      }),
    };
  }

  function PgConstraintMethods(): Omit<PgConstraint, keyof PgConstraintData> {
    return {
      _type: "PgConstraint",
      getNamespace: memo(function (this: PgConstraint) {
        return getNamespace(this.connamespace);
      }),
      getClass: memo(function (this: PgConstraint) {
        return getClass(this.conrelid);
      }),
      getAttributes: memo(function (this: PgConstraint) {
        const klass = getClass(this.conrelid);
        if (!klass) {
          console.error(
            `getAttributes() called on constraint '${this.conname}' (type = '${this.contype}'), but we could not find the constraint's table (oid = '${this.conrelid}') in the introspection results; returning empty array`,
          );
          return [];
        }
        if (!this.conkey) {
          if (this.contype === "f") {
            console.error(
              `getAttributes() called on constraint '${this.conname}' (type = '${this.contype}'), but that constraint has no 'conkey'; returning empty array`,
            );
            return [];
          } else {
            return;
          }
        }
        return this.conkey.map(
          (key) =>
            attributeByRelIdAndNum.get(attributeRelNumKey(klass._id, key))!,
        );
      }),
      getType: memo(function (this: PgConstraint) {
        return getType(this.contypid);
      }),
      getForeignClass: memo(function (this: PgConstraint) {
        return getClass(this.confrelid);
      }),
      getForeignAttributes: memo(function (this: PgConstraint) {
        if (this.confrelid == null) {
          if (this.contype === "f") {
            console.error(
              `getForeignAttributes() called on constraint '${this.conname}' (type = '${this.contype}'), but that constraint has no 'confrelid'; returning empty array`,
            );
            return [];
          } else {
            return;
          }
        }
        const klass = getClass(this.confrelid);
        if (!klass) {
          console.error(
            `getForeignAttributes() called on constraint '${this.conname}' (type = '${this.contype}'), but we could not find the constraint's foreign table (oid = '${this.confrelid}') in the introspection results; returning empty array`,
          );
          return [];
        }
        if (!this.confkey) {
          if (this.contype === "f") {
            console.error(
              `getForeignAttributes() called on constraint '${this.conname}' (type = '${this.contype}'), but that constraint has no 'confkey'; returning empty array`,
            );
            return [];
          } else {
            return;
          }
        }
        return this.confkey.map(
          (key) =>
            attributeByRelIdAndNum.get(attributeRelNumKey(klass._id, key))!,
        );
      }),
      getDescription: memo(function (this: PgConstraint) {
        return getDescription(PG_CONSTRAINT, this._id);
      }),
      getTagsAndDescription: memo(function (this: PgConstraint) {
        return getTagsAndDescription(PG_CONSTRAINT, this._id);
      }),
      getTags: memo(function (this: PgConstraint) {
        return this.getTagsAndDescription().tags;
      }),
    };
  }

  function PgProcMethods(): Omit<PgProc, keyof PgProcData> {
    return {
      _type: "PgProc",
      getNamespace: memo(function (this: PgProc) {
        return getNamespace(this.pronamespace);
      }),
      getOwner: memo(function (this: PgProc) {
        return getRole(this.proowner);
      }),
      getReturnType: memo(function (this: PgProc) {
        return getType(this.prorettype);
      }),
      getDescription: memo(function (this: PgProc) {
        return getDescription(PG_PROC, this._id);
      }),
      getTagsAndDescription: memo(function (this: PgProc) {
        return getTagsAndDescription(PG_PROC, this._id);
      }),
      getTags: memo(function (this: PgProc) {
        return this.getTagsAndDescription().tags;
      }),
      getArguments: memo(function (this: PgProc) {
        const args: PgProcArgument[] = [];
        const {
          // Null if everything 'in'. i: IN, o: OUT, b: INOUT, v: VARIADIC, t: TABLE
          proargmodes,
          // Null if no names
          proargnames,
          // Only input types
          proargtypes,
          // Null if no arg defaults, length = pronargdefaults
          // proargdefaults,
          // Number of inpart args
          // pronargs,
          // All args, null if all args are input
          proallargtypes,
          // Number of arguments with defaults
          pronargdefaults,
        } = this;
        if (proallargtypes) {
          for (let i = 0, l = proallargtypes.length; i < l; i++) {
            const typeId = proallargtypes[i];
            const type = typeById.get(typeId);
            if (!type) {
              throw new Error("Corrupted introspection data");
            }
            const mode = proargmodes?.[i] ?? "i";
            const isIn = mode === "i" || mode === "b" || mode === "v";
            const isOut = mode === "o" || mode === "b" || mode === "t";
            const isVariadic = mode === "v";
            const hasDefault = pronargdefaults
              ? i >= l - pronargdefaults
              : false;
            const name = proargnames?.[i] ?? null;
            args.push({
              isIn,
              isOut,
              isVariadic,
              hasDefault,
              type,
              name,
            });
          }
        } else if (proargtypes) {
          for (let i = 0, l = proargtypes.length; i < l; i++) {
            const typeId = proargtypes[i];
            const type = typeById.get(typeId);
            if (!type) {
              throw new Error("Corrupted introspection data");
            }
            const mode = proargmodes?.[i] ?? "i";
            const isIn = mode === "i" || mode === "b" || mode === "v";
            const isOut = mode === "o" || mode === "b" || mode === "t";
            const isVariadic = mode === "v";
            const hasDefault = pronargdefaults
              ? i >= l - pronargdefaults
              : false;
            const name = proargnames?.[i] ?? null;
            args.push({
              isIn,
              isOut,
              isVariadic,
              hasDefault,
              type,
              name,
            });
          }
        }
        return args;
      }),
      getACL: memo(function (this: PgProc) {
        return parseAcls(
          getIntrospection(),
          this.proacl,
          this.proowner,
          OBJECT_FUNCTION,
        );
      }),
    };
  }

  function PgTypeMethods(): Omit<PgType, keyof PgTypeData> {
    return {
      _type: "PgType",
      getNamespace: memo(function (this: PgType) {
        return getNamespace(this.typnamespace);
      }),
      getOwner: memo(function (this: PgType) {
        return getRole(this.typowner);
      }),
      getClass: memo(function (this: PgType) {
        return getClass(this.typrelid);
      }),
      getElemType: memo(function (this: PgType) {
        return getType(this.typelem);
      }),
      getArrayType: memo(function (this: PgType) {
        return getType(this.typarray);
      }),
      getEnumValues: memo(function (this: PgType) {
        return getEnums(this._id);
      }),
      getRange: memo(function (this: PgType) {
        return getRange(this._id);
      }),
      getDescription: memo(function (this: PgType) {
        return getDescription(PG_TYPE, this._id);
      }),
      getTagsAndDescription: memo(function (this: PgType) {
        return getTagsAndDescription(PG_TYPE, this._id);
      }),
      getTags: memo(function (this: PgType) {
        return this.getTagsAndDescription().tags;
      }),
    };
  }

  function PgEnumMethods(): Omit<PgEnum, keyof PgEnumData> {
    return {
      _type: "PgEnum",
      getType: memo(function (this: PgEnum) {
        return getType(this.enumtypid);
      }),
      getTagsAndDescription: memo(function (this: PgEnum) {
        return {
          tags: Object.create(null),
          description: "",
        };
      }),
      getTags: memo(function (this: PgEnum) {
        return this.getTagsAndDescription().tags;
      }),
    };
  }

  function PgRangeMethods(): Omit<PgRange, keyof PgRangeData> {
    return {
      _type: "PgRange",
      getType: memo(function (this: PgRange) {
        return getType(this.rngtypid);
      }),
      getSubType: memo(function (this: PgRange) {
        return getType(this.rngsubtype);
      }),
    };
  }

  function PgInheritsMethods(): Omit<PgInherits, keyof PgInheritsData> {
    return {
      getParent: function (this: PgInherits) {
        return classById.get(this.inhparent);
      },
      getChild: function (this: PgInherits) {
        return classById.get(this.inhrelid);
      },
    };
  }

  return {
    PgDatabaseMethods,
    PgNamespaceMethods,
    PgClassMethods,
    PgIndexMethods,
    PgAttributeMethods,
    PgConstraintMethods,
    PgProcMethods,
    PgTypeMethods,
    PgEnumMethods,
    PgRangeMethods,
    PgInheritsMethods,
  };
}
