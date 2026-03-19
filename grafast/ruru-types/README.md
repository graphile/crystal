# ruru-types

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/BSky-@Graphile.org-006aff.svg)](https://bsky.app/profile/graphile.org)
[![Follow](https://img.shields.io/badge/Mastodon-@Graphile.fosstodon.org-6364ff.svg)](https://fosstodon.org/@graphile)

Some TypeScript types from `ruru-components` because `npm` has issues with the
explorer plugin as a peer dependency (due to `react` version mis-match) and this
helps avoid that entering the dependency graph. Also minimizes the dependencies
of `ruru` since most of the complexity is bundled already.
