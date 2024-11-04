---
"grafast": patch
---

Fix type in middleware (for plugins) that incorrectly unwrapped promise,
resulting in TypeScript incorrectly suggesting `await` was not necessary.
