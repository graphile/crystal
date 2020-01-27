import {
  PgClass,
  PgEntityKind,
  PgConstraint,
  PgAttribute,
  PgEntity,
  PgProc,
} from "graphile-build-pg";
import parseIdentifierParts from "./parseIdentifierParts";
import { Build } from "graphile-build";

export function isAttribute(obj: PgEntity): obj is PgAttribute {
  return obj.kind === PgEntityKind.ATTRIBUTE;
}

export function isConstraint(obj: PgEntity): obj is PgConstraint {
  return obj.kind === PgEntityKind.CONSTRAINT;
}

export function isClass(obj: PgEntity): obj is PgClass {
  return obj.kind === PgEntityKind.CLASS;
}

export function isProcedure(obj: PgEntity): obj is PgProc {
  return obj.kind === PgEntityKind.PROCEDURE;
}

export function entityIsIdentifiedBy(
  obj: PgEntity,
  identifier: string,
  build: Build
): boolean {
  const parts = parseIdentifierParts(identifier);
  if (parts.length === 1) {
    const [expectedName] = parts;
    return obj.name === expectedName;
  } else if (parts.length === 2) {
    const [parentName, expectedName] = parts;
    if (isAttribute(obj) || isConstraint(obj)) {
      // Parent is a table
      const klass:
        | PgClass
        | undefined = build.pgIntrospectionResultsByKind.class.find(
        (kls: PgClass) => kls.id === obj.classId
      );
      return obj.name === expectedName && !!klass && klass.name === parentName;
    } else if (isClass(obj) || isProcedure(obj)) {
      // Parent is a schema
      return obj.name === expectedName && obj.namespaceName === parentName;
    } else {
      throw new Error(
        `Type '${obj.kind}' not supported by makeSmartCommentsPlugin`
      );
    }
  } else if (parts.length === 3) {
    const [grandparentName, parentName, expectedName] = parts;
    if (isAttribute(obj) || isConstraint(obj)) {
      // Parent is a table, grandparent is a schema
      const klass:
        | PgClass
        | undefined = build.pgIntrospectionResultsByKind.class.find(
        (kls: PgClass) => kls.id === obj.classId
      );
      return (
        obj.name === expectedName &&
        !!klass &&
        klass.name === parentName &&
        klass.namespaceName === grandparentName
      );
    } else {
      // Parent is a schema; grandparent doesn't make sense
      throw new Error(
        `Identifier '${identifier}' does not make sense for a '${obj.kind}' entity`
      );
    }
  } else {
    throw new Error(
      `makeSmartCommentsPlugin did not know how to interpret match '${identifier}'`
    );
  }
}
