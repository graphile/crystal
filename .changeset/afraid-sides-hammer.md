---
"postgraphile": patch
"@dataplan/pg": patch
---

Switch from using `json_array_elements` to `json_to_recordset` because it feels
neater not having `->>` everywhere.
