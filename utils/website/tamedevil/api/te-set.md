---
sidebar_position: 9
title: "te.set()"
---

# `te.set(key, hasNullPrototype?)`

As with [`te.get`](/tamedevil/API/te-get/), except since it's for setting a key we'll perform checks to
ensure you're not writing to unsafe keys (such as `__proto__`) unless you
specify that `hasNullPrototype` is true (because any key can bet written safely
to `Object.create(null)`).
