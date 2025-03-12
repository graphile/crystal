# PostGraphile Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern
static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

### Lint Fix

```
$ yarn lint:fix
```

Please run `lint:fix` before your pull request.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be
served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to
build the website and push to the `gh-pages` branch.

### Versioning

In order to render the latest documentation at pleasant URLs whilst still allowing permalinking to a major revision's documentation, we have utilized symlinks in the `versioned_*` directories.

#### Pre-release

When work begins on a new major version of the software, create a new versioned pre-release of the documentation: run the [docusaurus command](https://docusaurus.io/docs/versioning):

```
yarn docusaurus docs:version 6
```

then update the banners, found in `docusaurus.config.js` config.presets[0].docs.versions, to one of 'none', 'unreleased', or 'unmaintained'.

#### Release

When a major version of the software is released, the following should occur:

- update the two symlinks (`versioned_docs/version-latest` and `versioned_sidebars/version-latest-sidebars.json`) to point to the new latest version docs
- update the config.presets[0].docs.versions labels in `docusaurus.config.js` to accurately reflect the new state
