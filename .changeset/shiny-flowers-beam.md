---
"@graphile/simplify-inflection": patch
---

🚨 Fix bug where names were incorrectly derived for AmberPreset/RelayPreset.

If you need to restore the old (broken) behavior, use something this plugin
(untested):

```ts
const ShinyFlowersBeamUndoPlugin = {
  name: "ShinyFlowersBeamUndoPlugin",
  inflection: {
    replace: {
      _getBaseNameFromKeys(original, preset, detailedKeys) {
        if (detailedKeys.length === 1) {
          const key = detailedKeys[0];
          const attributeName = this._attributeName({
            ...key,
            skipRowId: false, // HACK: deliberately opt in to poor naming
          });
          return this._getBaseName(attributeName);
        }
        if (preset.schema?.pgSimplifyMultikeyRelations) {
          const attributeNames = detailedKeys.map((key) =>
            this._attributeName({
              ...key,
              skipRowId: true, // HACK: deliberately opt in to poor naming
            }),
          );
          const baseNames = attributeNames.map((attributeName) =>
            this._getBaseName(attributeName),
          );
          // Check none are null
          if (baseNames.every((n) => n)) {
            return baseNames.join("-");
          }
        }
        return null;
      },
    },
  },
};
```
