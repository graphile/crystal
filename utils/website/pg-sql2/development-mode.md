---
sidebar_position: 2
title: "Development-mode features"
---

# Development-mode SQL features

Some SQL helpers provide additional information or formatting that is useful
during development, such as inline comments or styled/indented output for
readability. These features are only available in development mode and are
stripped from production mode for greater efficiency.

The following helpers are affected:

- [`sql.comment`](./api/sql-comment)
- [`sql.indent`](./api/sql-indent)
- [`sql.indentIf`](./api/sql-indentIf)

## Enabling SQL Debug Comments

To enable SQL comments, you must set the environment variable:

```bash
GRAPHILE_ENV=development
```

### How to set `GRAPHILE_ENV`

#### Linux/macOS (bash/zsh)

```bash
export GRAPHILE_ENV=development
```

#### Windows (PowerShell)

```powershell
$env:GRAPHILE_ENV="development"
```

#### Windows (cmd.exe)

```cmd
set GRAPHILE_ENV=development
```

#### package.json (cross-platform)

If you need a cross-platform solution for scripts, use [cross-env](https://www.npmjs.com/package/cross-env):

```json
{
  "scripts": {
    "start": "cross-env GRAPHILE_ENV=development node index.js"
  }
}
```
