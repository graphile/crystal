import { gql } from "graphile-utils";

import { transactionlessQuery } from "../../helpers";
import {
  createSchema,
  liveTest,
  next,
  releaseSchema,
  resetDatabase,
  skipLDSTests,
} from "../live_helpers";

if (skipLDSTests) {
  test.skip("Skipping LDS tests", () => {});
} else {
  beforeEach(() => resetDatabase());
  beforeAll(() => createSchema());
  afterAll(() => releaseSchema());

  test("single record", async () => {
    const {
      rows: [user],
    } = await transactionlessQuery(
      "insert into live_test.users(name) values($1) returning *",
      ["Stuart"],
    );

    await liveTest(
      gql`
        subscription($id: Int!) {
          user: userById(id: $id) {
            id
            name
          }
        }
      `,
      { id: user.id },
      async (pgClient, getLatest) => {
        let data;
        data = await next(getLatest);
        expect(data.data.user).toBeTruthy();
        expect(data.data.user.name).toEqual("Stuart");
        expect(data.data.user.id).toEqual(user.id);
        await pgClient.query(
          "update live_test.users set name = 'Stu' where id = $1",
          [user.id],
        );
        data = await next(getLatest);
        expect(data.data.user.name).toEqual("Stu");
        await pgClient.query(
          "update live_test.users set name = 'S' where id = $1",
          [user.id],
        );
        data = await next(getLatest);
        expect(data.data.user.name).toEqual("S");
      },
    );
  });
}
