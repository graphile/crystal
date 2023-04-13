import * as core from "./core.js";

test("raises an error when a foreignKey tries to reference a non-unique combination of columns", async () => {
  const promise = core.test(
    __filename,
    ["c"],
    {},
    (pgClient) => {
      return pgClient.query(
        "comment on table c.person_secret is E'@foreignKey (sekrit) references c.person (about)';",
      );
    },
    undefined,
    undefined,
    {
      gather: {
        pgFakeConstraintsAutofixForeignKeyUniqueness: false,
      },
    },
  )();
  await expect(promise).rejects.toThrowErrorMatchingInlineSnapshot(`
          "Invalid @foreignKey on 'c.person_secret'; referenced non-unique combination of attributes 'c.person' (about). If this list of attributes is truly unique you should add a unique constraint to the table:

          ALTER TABLE \\"c\\".\\"person\\"
            ADD UNIQUE (\\"about\\");

          or use a '@unique about' smart tag to emulate this. (Original spec: \\"(sekrit) references c.person (about)\\").
          To temporarily fix this you can set 'preset.gather.pgFaceConstraintsAutofixForeignKeyUniqueness' to 'true', but we strongly recommend against using this long term.'"
        `);
});
