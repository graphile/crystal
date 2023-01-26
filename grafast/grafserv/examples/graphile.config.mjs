// These imports are just for the types; if you're pure JS you don't need them
import "graphile-config";
import "grafserv";

/** @type {GraphileConfig.Preset} */
const preset = {
  server: {
    port: 5678,
    outputDataAsString: true,
  },
};
export default preset;
