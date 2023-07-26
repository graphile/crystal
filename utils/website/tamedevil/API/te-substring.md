---
sidebar_position: 4
title: "te.substring(()"
---

# `te.substring(str, stringType)`

If you're building a string and you want to inject untrusted content into it
without opening yourself to code injection attacks, this is the method for you.
Pass the string you'd like escaped as the first argument, and the second
argument should be `"`, `'` or `` ` `` depending on what type of string you're
embedding into. Example:

```js
// Some untrusted user input, could have anything in it
const untrusted = "'\"` \\'\\\"\\` ${process.exit(1)}";

// Safely insert the untrusted input into a string
const code = te.run`return "abc${te.substring(untrusted, '"')}123";`;

assert.strictEqual(code, "abc'\"` \\'\\\"\\` ${process.exit(1)}123");
```
