---
sidebar_position: 2
title: "Plugin"
---

# Graphile Config Plugin

A plugin is responsible for adding capabilities to a Graphile package. Each
Graphile package will register its own "scope" within the plugin's spec;
commonly these scopes may contain capabilities such as 'hooks' or 'events' which
this package attempts to standardize.

A Graphile Plugin is an object with the following properties:

- `name` (`string`): The name of the plugin, this must be unique and will be
  used for capabilities such as `skipPlugins`
- `version` (`string`): a semver-compliant version for the plugin, this would
  normally match the version in the `package.json` but does not need to (e.g. if
  the module in question contains multiple plugins)
- `description` (optional `string`): human-readable description of the plugin in
  [CommonMark](https://commonmark.org/) (markdown) format.
- `provides` (optional `string[]`): an optional list of "feature labels" that
  this plugin provides, this is primarily used to govern the order in which the
  plugin (and its hooks and events) are executed. Feature labels must be unique
  within the list of loaded plugins, for example two different plugins should
  not both provide `subscriptions`. If unspecified, defaults to the plugin name.
- `after` (optional `string[]`): indicates that this plugin should be loaded
  after the named features (if present)
- `before` (optional `string[]`): indicates that this plugin should be loaded
  before the named features (if present)

In addition to the properties above, plugins may also contain properties for
each of the supported scopes, for example there may be a `postgraphile` scope
for PostGraphile, or a `worker` scope for Graphile Worker. The value for each of
these scopes will be an object, but the contents of that object are defined by
the projects in question.

**NOTE**: Currently this plugin system is only intended for Graphile usage (and
thus we do not need to "reserve" keys), but should you find it useful for other
projects please reach out via GitHub issues and we can discuss what's necessary
to make this more universal. Should you decide to not heed this advice, please
at least make sure that the "scopes" you add are namespaced in a way to avoid
future conflicts with features we may wish to add.
