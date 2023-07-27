---
sidebar_position: 2
title: "sql.identifier()"
---

# `sql.identifier(ident, ...) `

Represents a safely escaped SQL identifier; if multiple arguments are passed then each will be escaped and then they will be joined with dots (e.g. `"schema"."table"."column"`).
