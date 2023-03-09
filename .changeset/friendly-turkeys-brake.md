---
"postgraphile": patch
---

Enable websockets and add better compatibility with V4's
pgSettings/additionalGraphQLContextFromRequest for websockets when using
`makeV4Preset({subscriptions: true})`.
