---
"graphile-build-pg": patch
---

🚨 Refs no longer have singularized/pluralized names - we take the name verbatim
and apply the list/connection suffix to it as needed.

If you need the old naming back, please use this plugin (untested):

```ts
const MyRefsInflectionPlugin = {
  name: "MyRefsInflectionPlugin",
  inflection: {
    replace: {
      refSingle(orig, resolvedPreset, { refDefinition, identifier }) {
        return (
          refDefinition.singleRecordFieldName ?? this.singularize(identifier)
        );
      },
      refList(orig, resolvedPreset, { refDefinition, identifier }) {
        return (
          refDefinition.listFieldName ??
          this.listField(this.pluralize(this.singularize(identifier)))
        );
      },
      refConnection(orig, resolvedPreset, { refDefinition, identifier }) {
        return (
          refDefinition.connectionFieldName ??
          this.connectionField(this.pluralize(this.singularize(identifier)))
        );
      },
    },
  },
};
```
