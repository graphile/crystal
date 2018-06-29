export default function makeAddInflectorsPlugin(additionalInflectors) {
  return builder => {
    builder.hook("inflection", (inflection, build) => {
      return build.extend(inflection, additionalInflectors);
    });
  };
}
