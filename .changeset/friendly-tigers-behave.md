---
"ruru-components": patch
"ruru": patch
---

Fix white-screen-of-death caused by EventSource disconnection. Instead, handle
errors gracefully. Also, allow overriding of the EventSource configuration
options.
