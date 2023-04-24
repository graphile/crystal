# Step library

A step class is a JavaScript class that extends `ExecutableStep` with an
`execute` method. It may, optionally, implement other <grafast /> lifecycle
methods, and add other accessors and similar that child field plans may call.
For more information see [step classes](../step-classes).

A number of builtin standard step classes are provided for schemas to
accomplish common tasks, these are documented in [Standard
steps](./standard-steps). Often these builtin steps are enough for your schemas
needs, especially when integrating with an existing business logic layer via
steps such as [loadOne][] and [loadMany][].

Should these standard steps prove insufficient, schema designers are encouraged
to write their own step classes and/or use step classes made available in other
packages. Unless you want to use the advanced lifecycle hooks, writing a step
class is generally not much more complicated than writing a DataLoader callback
(and sometimes more straightforward, depending on what you're trying to do).
See [step classes](../step-classes) for information on writing your own step
classes.

The `@dataplan/*` modules contain step classes for particular specialised use
cases. These are not part of <grafast /> itself, but serve as a welcome
companion to it. The list of supported optimized sources is expected to grow
over time - if you'd like to collaborate on building step classes for a
particular use case please get in touch. You may also find that members of the
community write and share their own step classes on GitHub, npm and similar.

:::info

Step classes whose names start with two underscores (`__`) are internals and
must not be used.

:::

[loadone]: ./standard-steps/loadOne
[loadmany]: ./standard-steps/loadMany
