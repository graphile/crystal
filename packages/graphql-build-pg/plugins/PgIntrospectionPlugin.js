const withPgClient = require("../withPgClient");
const promisify = require("util").promisify;
const readFile = promisify(require("fs").readFile);
const INTROSPECTION_PATH = `${__dirname}/../res/introspection-query.sql`;

module.exports = async function PgIntrospectionPlugin(
  builder,
  { pgConfig, pgSchemas: schemas }
) {
  return withPgClient(pgConfig, async pgClient => {
    // Perform introspection
    if (!Array.isArray(schemas)) {
      throw new Error("Argument 'schemas' (array) is required");
    }
    const introspectionQuery = await readFile(INTROSPECTION_PATH, "utf8");
    const { rows } = await pgClient.query(introspectionQuery, [schemas]);

    const introspectionResultsByKind = rows.reduce(
      (memo, { object }) => {
        memo[object.kind].push(object);
        return memo;
      },
      {
        namespace: [],
        class: [],
        attribute: [],
        type: [],
        constraint: [],
        procedure: [],
      }
    );
    const xByY = (arrayOfX, attrKey) =>
      arrayOfX.reduce((memo, x) => {
        memo[x[attrKey]] = x;
        return memo;
      }, {});
    const xByYAndZ = (arrayOfX, attrKey, attrKey2) =>
      arrayOfX.reduce((memo, x) => {
        memo[x[attrKey]] = memo[x[attrKey]] || {};
        memo[x[attrKey]][x[attrKey2]] = x;
        return memo;
      }, {});
    introspectionResultsByKind.namespaceById = xByY(
      introspectionResultsByKind.namespace,
      "id"
    );
    introspectionResultsByKind.classById = xByY(
      introspectionResultsByKind.class,
      "id"
    );
    introspectionResultsByKind.typeById = xByY(
      introspectionResultsByKind.type,
      "id"
    );
    introspectionResultsByKind.attributeByClassIdAndNum = xByYAndZ(
      introspectionResultsByKind.attribute,
      "classId",
      "num"
    );

    const relate = (array, newAttr, lookupAttr, lookup) => {
      array.forEach(entry => {
        const key = entry[lookupAttr];
        const result = lookup[key];
        if (key && !result) {
          throw new Error(
            `Could not look up '${newAttr}' by '${lookupAttr}' on '${entry}'`
          );
        }
        entry[newAttr] = result;
      });
    };

    relate(
      introspectionResultsByKind.class,
      "namespace",
      "namespaceId",
      introspectionResultsByKind.namespaceById
    );

    relate(
      introspectionResultsByKind.class,
      "type",
      "typeId",
      introspectionResultsByKind.typeById
    );

    relate(
      introspectionResultsByKind.attribute,
      "class",
      "classId",
      introspectionResultsByKind.classById
    );

    relate(
      introspectionResultsByKind.attribute,
      "type",
      "typeId",
      introspectionResultsByKind.typeById
    );

    relate(
      introspectionResultsByKind.procedure,
      "namespace",
      "namespaceId",
      introspectionResultsByKind.namespaceById
    );

    relate(
      introspectionResultsByKind.type,
      "class",
      "classId",
      introspectionResultsByKind.classById
    );

    builder.hook("build", build => {
      return build.extend(build, {
        pgIntrospectionResultsByKind: introspectionResultsByKind,
      });
    });
  });
};
