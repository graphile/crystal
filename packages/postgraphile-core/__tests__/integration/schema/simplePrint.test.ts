import { withPgClient } from "../../helpers";
import { createPostGraphileSchema } from "../../..";

test("Simple schema print (no ordering)", () =>
  withPgClient(async (client) => {
    const schema = await createPostGraphileSchema(client, ["a", "b", "c"], {
      subscriptions: true,
    });
    expect(schema).toMatchSnapshot();
  }));
