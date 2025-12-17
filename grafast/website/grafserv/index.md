---
sidebar_position: 1
---

# Grafserv Introduction

Grafserv - an incredibly fast GraphQL server integration library for Node.js
powered by [Gra*fast*](/grafast).

## How?

Gra*fast* is a radical new take on GraphQL execution; thanks to its separate
execution and output phases, Gra*fast*'s output plan can be configured to output
a JSON string directly without needing to construct intermediary objects and
then stringify them. Grafserv can stream this resulting JSON string directly to
clients, reducing latency, memory allocation and garbage collection overhead.
