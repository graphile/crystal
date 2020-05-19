interface Inflectors {
  [str: string]: (...args: Array<any>) => any;
}
type InflectorsGenerator = (
  inflection: Partial<Inflectors>,
  build: GraphileEngine.BuildBase,
  options: GraphileEngine.GraphileBuildOptions,
) => Inflectors;

export default function makeAddInflectorsPlugin(
  additionalInflectorsOrGenerator: Inflectors | InflectorsGenerator,
  replace = false,
): GraphileEngine.Plugin {
  return (builder, options) => {
    builder.hook("inflection", (inflection, build) => {
      const additionalInflectors =
        typeof additionalInflectorsOrGenerator === "function"
          ? additionalInflectorsOrGenerator(inflection, build, options)
          : additionalInflectorsOrGenerator;
      if (replace) {
        // Overwrite directly so that we don't lose the 'extend' hints
        Object.assign(inflection, additionalInflectors);
        return inflection;
      } else {
        return build.extend(
          inflection,
          additionalInflectors,
          `Adding inflectors ('${Object.keys(additionalInflectors).join(
            "', '",
          )}') via makeAddInflectorsPlugin. You can pass \`true\` as the second argument to makeAddInflectorsPlugin to allow overwriting existing inflectors.`,
        );
      }
    });
  };
}
