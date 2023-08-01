# Pre-release caveats

Gra*fast* is pre-release software right now - this means it's essential you stay
up to date.

Thanks to a 3 month prealpha period and a further 3 months as alpha we are
confident the software is now suitable to run in production, but it's still
relatively young and has not been fully battle tested yet (that's where you
come in!)

You should follow the advice in [Production
Considerations](/grafast/production-considerations), especially if you're
allowing arbitary untrusted queries to your GraphQL schema.

The software is still undergoing iteration; it's likely that a few APIs will
further evolve over time. Now that the alpha phase is complete we expect
these changes to be relatively minor, and we'll detail them in the release
notes with each release. In particular, we are expecting to improve the
TypeScript types somewhat, which may necessitate some minor API refactors. For
other expected changes, see the issues on the repository.

To stay up to date with the breaking changes, we recommend that you use the
#rules channel in [the Graphile Discord](https://discord.gg/graphile) to give
yourself the `@news-testers` role, and then pay attention to #announcements.
