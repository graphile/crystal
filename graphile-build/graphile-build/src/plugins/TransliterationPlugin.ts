import { transliterate } from "transliteration";

export const TransliterationPlugin: GraphileConfig.Plugin = {
  name: "TransliterationPlugin",
  description: "Adds inflection hack for non-latin characters",
  inflection: {
    replace: {
      coerceToGraphQLName(previous, options, name) {
        const base = previous ? previous(name) : name;
        return transliterate(base);
      },
    },
  },
};
