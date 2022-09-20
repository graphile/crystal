# More

This documentation is a work in progress. Here's some content I wrote but then
snipped because it didn't make sense in the place I wrote it, but it still
useful... These paragraphs are looking for homes in the rest of the
documentation.

### Step classes

A step class is a JavaScript class that has an `execute` method. It may,
optionally, implement other Grafast lifecycle methods, and other accessors and
similar that child field plans may call.

Grafast provides a number of standard step classes that schemas may use, but
step classes whose names start with two underscores (`__`) are Grafast internals
and must not be used. Schema designers are also encouraged to write their own
step classes, and/or use step classes made available in other packages.

### Steps

A step is an instance of a specific _step class_, produced during the planning
of an operation. Each step may depend on 0 or more other steps, and through
these dependencies ultimately form a directed acyclic graph which we refer to as
the _operation plan_.

### Field plan resolver

Each field in the schema may implement a `plan` method, and at operation
planning time each time this field is referenced it may be called, with Grafast
passing the resulting step of the parent plan[^1], and a "field args" object.
The method may create as many intermediate steps as it likes, but it must return
exactly one step that its children may use (or, in the case of a leaf, that may
be used by the output plan).

[^1]:
    The resulting step will be the returned step from the parent field when that
    field has an object type, but when the field has a list or polymorphic type
    the resulting step will likely differ. This is covered in another section of
    the documentation. (TODO: which other section?)

In the case of a field that has a polymorphic type, the step that is returned
must be a polymorphic-capable plan.

In the case of a field that has a list type, the step that is returned must
produce lists when executed.
