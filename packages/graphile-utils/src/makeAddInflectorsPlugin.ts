import { Plugin } from "graphile-build";

export default function makeAddInflectorsPlugin(
  additionalInflectors: {
    [str: string]: ((...args: Array<any>) => any);
  },
  replace = false
): Plugin {
  return builder => {
    builder.hook("inflection", (inflection, build) => {
      if (replace) {
        // Overwrite directly so that we don't lose the 'extend' hints
        Object.assign(inflection, additionalInflectors);
        return inflection;
      } else {
        return build.extend(
          inflection,
          additionalInflectors,
          `Adding inflectors ('${Object.keys(additionalInflectors).join(
            "', '"
          )}') via makeAddInflectorsPlugin. You can pass \`true\` as the second argument to makeAddInflectorsPlugin to allow overwriting existing inflectors.`
        );
      }
    });
  };
}
