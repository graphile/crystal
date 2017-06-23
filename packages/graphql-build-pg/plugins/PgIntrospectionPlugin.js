const withPgClient = require("../withPgClient");

module.exports = async function PgIntrospectionPlugin(
  listener,
  { pgConfig, pgSchemas: schemas }
) {
  process.stdout.write(require("util").inspect(pgConfig));
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

    listener.on("context", (context, { extend }) => {
      const sql = pgSQLBuilder;
      return extend(context, {
        pg: {
          introspectionResultsByKind,
          gqlTypeByClassId: {},
          gqlEdgeTypeByClassId: {},
          gqlConnectionTypeByClassId: {},
          gqlTypeByTypeId: {},
          sqlFragmentGeneratorsByClassIdAndFieldName: {},
          sqlFragmentGeneratorsForConnectionByClassId: {},
          sql,
          generateFieldFragments(
            parsedResolveInfoFragment,
            sqlFragmentGenerators,
            scope
          ) {
            const { fields } = parsedResolveInfoFragment;
            const fragments = [];
            for (const alias in fields) {
              const spec = fields[alias];
              const generator = sqlFragmentGenerators[spec.name];
              if (generator) {
                const generatedFrags = generator(spec, scope);
                if (!Array.isArray(generatedFrags)) {
                  throw new Error(
                    "sqlFragmentGeneratorsByClassIdAndFieldName generators must generate arrays"
                  );
                }
                fragments.push(...generatedFrags);
              }
            }
            return fragments;
          },
        },
      });
    });
  });
};
