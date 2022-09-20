# Step library

A step class is a JavaScript class that extends `ExecutableStep` with an
`execute` method. It may, optionally, implement other Grafast lifecycle methods,
and add other accessors and similar that child field plans may call. For more
information see [step classes](../step-classes).

Grafast provides a number of builtin standard step classes that schemas may use,
these are documented in [Standard steps](./standard-steps).

Often these builtin steps are enough for your schemas needs, especially when
integrating with an existing business logic layer via steps such as [loadOne][]
and [loadMany][]. Should these standard steps prove insufficient, schema
designers are encouraged to write their own step classes and/or use step classes
made available in other packages. See [step classes](../step-classes) for
information on writing your own step classes.

Grafast also makes available some step classes for particular specialised use
cases, you can find those in the `@dataplan/*` modules. The list of supported
optimized sources is expected to grow over time - if you'd like to collaborate
on building step classes for a particular use case please get in touch.

:::info

Step classes whose names start with two underscores (`__`) are internals and
must not be used.

:::

[loadone]: ./standard-steps/loadOne
[loadmany]: ./standard-steps/loadMany
