// TODO: remove this, pull from graphile-build directly in all the relevant places
export { makeSchema, watchSchema } from "graphile-build";

/*
import { exportSchema } from "graphile-export";

  const exportFileLocation = `${__dirname}/../../temp.mjs`;
  await exportSchema(schema, exportFileLocation, {
    mode: "typeDefs",
    modules: {
      jsonwebtoken: jsonwebtoken,
    },
  });
  const { schema: schema2 } = await import(exportFileLocation.toString());
  */
