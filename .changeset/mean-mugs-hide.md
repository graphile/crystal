---
"grafserv": patch
---

Adopt new MiddlewareHandlers type for simplicity, and in doing so fix type of
middleware (for plugins) that incorrectly unwrapped promise resulting in
TypeScript incorrectly suggesting that `await` was not necessary.
