---
sidebar_position: 4
title: "sql.literal()"
---

# `sql.literal(val) `

As [`sql.value`](/pg-sql2/API/sql-value), but in the case of very simple values may write them directly to the SQL statement rather than using a placeholder. Should only be used with data that is not sensitive and is trusted (not user-provided data), e.g. for the key arguments to `json_build_object(key, val, key, val, ...)` which you have produced.
