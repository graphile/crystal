# Changesets notes

Docs: https://github.com/changesets/changesets

## publishConfig.directory

We rely on the (seemingly undocumented) changesets feature to publish a package
at a subdirectory introduced in this PR:
https://github.com/changesets/changesets/pull/428

To leverage this, we need the following in the relevant package.json:

```json
  "scripts": {
    // ...
    // Optional:
    "postpack": "echo 'FORBIDDEN' && exit 1"
  },
  "publishConfig": {
    "access": "public",
    "directory": "release"
  }
```

We use this, for example, in grafast so that we can release a webpacked version
of the code to clear development code and minimise require/import overhead.
