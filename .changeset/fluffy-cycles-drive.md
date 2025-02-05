---
"graphile-export": patch
"grafast": patch
---

🚨 makeGrafastSchema and schema export now export extensions directly rather
than extensions.grafast - applies to fields and arguments. All previous exports
cannot be (safely) executed with latest makeGrafastSchema - please regenerate
exports.
