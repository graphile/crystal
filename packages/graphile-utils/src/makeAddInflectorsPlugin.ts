import { Plugin } from "graphile-build";

export default function makeAddInflectorsPlugin(additionalInflectors: {
  [str: string]: ((...args: Array<any>) => any);
}): Plugin {
  return builder => {
    builder.hook("inflection", (inflection, build) => {
      return build.extend(inflection, additionalInflectors);
    });
  };
}
