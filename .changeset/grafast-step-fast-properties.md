---
"grafast": patch
---

Define `hasSideEffects` once on `Step.prototype` instead of redefining it on
every step instance: a per-instance accessor drops each step into V8's
dictionary-properties mode, costing planning time and a large amount of heap.
