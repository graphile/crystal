---
"grafast": patch
---

Fix performance issue in `loadOne()`/`loadMany()` due to using
`setTimeout(cb, 0)`, now using `process.nextTick(cb)`. High enough concurrency
and the issue goes away, but with limited concurrency this causes a lot of
`(idle)` in profiling and thus completing 10k items took longer. (Lots of time
spent in `epoll_pwait`.)
