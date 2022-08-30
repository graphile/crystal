const { withPgClient } = require("../../helpers");
const { createPostGraphileSchema } = require("../../..");

const PluginThatWouldNotHaveLoadedAnyway = () => {};

test("throws error when skipPlugins is passed a plugin that would not have loaded", () =>
  withPgClient(async client => {
    let err;
    try {
      await createPostGraphileSchema(client, "a", {
        skipPlugins: [PluginThatWouldNotHaveLoadedAnyway],
      });
    } catch (_e) {
      err = _e;
    }
    expect(err).toBeTruthy();
    expect(err).toMatchSnapshot();
  }));
