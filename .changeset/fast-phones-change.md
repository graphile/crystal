---
"grafast": patch
---

🚨 ExecutionValue no longer exposes .value and .entries (you need to narrow to
access these). Added new `.unaryValue()` that can be used to assert the value is
unary and retrieve its value - this should be used instead of `.at(0)` in
general.
