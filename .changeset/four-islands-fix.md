---
"ruru-components": patch
"ruru": patch
"pgl": patch
"postgraphile": patch
---

Ruru is now built on top of GraphiQL v5, which moves to using the Monaco editor
(the same editor used in VSCode) enabling more familiar keybindings and more
powerful features. This has required a rearchitecture to Ruru's previously
"single file" approach since Monaco uses workers which require additional files;
so instead we have embraced the bundle splitting approach. We now bundle both
prettier and mermaid, but these are now loaded on-demand. Usage instructions for
all environments have had to change since we can no longer serve Ruru as a
single HTML file, so we now include helpers for serving Ruru's static files from
whatever JS-based webserver you are using.
