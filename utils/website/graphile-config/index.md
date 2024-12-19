---
sidebar_position: 1
---

# Graphile Config

**PRERELEASE**: this is pre-release software; use at your own risk. This will
likely change a lot before it is ultimately released.

Graphile Config helps Node.js library authors make their libraries configurable
and _extensible_. Graphile Config is used across the Graphile suite to provide a
standard configuration and plugin interface.

## Features

- Define and document strongly typed configuration options for your library.
- Allow users to extend the functionality of your library via plugins.
- Plugins can add their own additional configuration options.
- Bundle configuration options and plugins into default presets for your users.
- You and your users can compose presets with preset extension.
- Allow your users to share configuration across multiple modes (e.g. CLI and library).
- Powerful middleware system to make your library extensible.
- Users don't need to put plugins in a particular order, thanks to the ordering system.
- View the available options and resolved values of a preset with the `graphile`
  CLI
  ([available to sponsors](https://github.com/graphile/crystal/blob/main/utils/graphile/README.md)).

## Different Users

As a user of Graphile Config, you may not need to understand everything. There
are three common levels of usage, in order of the amount of knowledge required:

1. Library consumers ⚙️
2. Plugin authors 🔌
3. Library authors 📚

Each section in the Graphile Config docs will indicate the intended audience.
Feel free to learn only what you need, or learn it all!
