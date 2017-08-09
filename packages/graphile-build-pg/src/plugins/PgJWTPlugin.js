// @flow
import type { Plugin } from "graphile-build";
import { sign as signJwt } from "jsonwebtoken";

export default (function PgJWTPlugin(
  builder,
  { pgInflection: inflection, pgJwtTypeIdentifier, pgJwtSecret }
) {
  builder.hook(
    "init",
    (
      _,
      {
        newWithHooks,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgGqlTypeByTypeId,
        pgGqlInputTypeByTypeId,
        pg2GqlMapper,
        pgTweaksByTypeId,
        graphql: { GraphQLScalarType },
      }
    ) => {
      if (!pgJwtTypeIdentifier) {
        return _;
      }
      if (!pgJwtSecret) {
        throw new Error(
          "pgJwtTypeIdentifier was specified without pgJwtSecret"
        );
      }
      const { namespaceName, typeName } = parseTypeIdentifier(
        pgJwtTypeIdentifier
      );

      const compositeClass = introspectionResultsByKind.class.find(
        table =>
          !table.isSelectable &&
          !table.isInsertable &&
          !table.isUpdatable &&
          !table.isDeletable &&
          table.name === typeName &&
          table.namespace &&
          table.namespace.name === namespaceName
      );
      if (!compositeClass) {
        throw new Error(
          `Could not find JWT type '"${namespaceName}"."${typeName}"'`
        );
      }
      const compositeType = introspectionResultsByKind.type.filter(
        type =>
          type.type === "c" &&
          type.category === "C" &&
          type.namespaceId === compositeClass.namespaceId &&
          type.classId === compositeClass.id
      )[0];
      if (!compositeType) {
        throw new Error("Could not determine the type for JWT type");
      }
      if (pg2GqlMapper[compositeType.id]) {
        throw new Error("JWT type has already been overridden?");
      }
      const attributes = introspectionResultsByKind.attribute
        .filter(attr => attr.classId === compositeClass.id)
        .sort((a1, a2) => a1.num - a2.num);

      const compositeTypeName = inflection.tableType(
        compositeClass.name,
        compositeClass.namespace.name
      );

      const JWTType = newWithHooks(
        GraphQLScalarType,
        {
          name: compositeTypeName,
          description:
            "A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) which securely represents claims between two parties.",
          serialize(value) {
            const token = attributes.reduce((memo, attr) => {
              memo[attr.name] = value[attr.name];
              return memo;
            }, {});
            return signJwt(token, pgJwtSecret, {
              audience: "postgraphql",
              issuer: "postgraphql",
              expiresIn: token.exp ? undefined : "1 day",
            });
          },
        },
        {
          isPgJwtType: true,
        }
      );

      pg2GqlMapper[compositeType.id] = {
        map: value => {
          if (!value) return null;
          const values = Object.keys(value).map(k => value[k]);
          if (values.every(v => v == null)) {
            return null;
          }
          return value;
        },
        unmap: () => {
          throw new Error(
            "We don't support passing a JWT token into GraphQL currently"
          );
        },
      };

      pgGqlTypeByTypeId[compositeType.id] = JWTType;
      pgGqlInputTypeByTypeId[compositeType.id] = null;
      pgTweaksByTypeId[compositeType.id] = fragment =>
        sql.fragment`to_json(${fragment})`;
      return _;
    }
  );
}: Plugin);

function parseTypeIdentifier(typeIdentifier) {
  const match = typeIdentifier.match(
    /^(?:([a-zA-Z0-9_]+)|"([^"]*)")\.(?:([a-zA-Z0-9_]+)|"([^"]*)")$/
  );

  if (!match)
    throw new Error(
      `Type identifier '${typeIdentifier}' is of the incorrect form.`
    );

  return {
    namespaceName: match[1] || match[2],
    typeName: match[3] || match[4],
  };
}
