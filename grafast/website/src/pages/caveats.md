# Pre-release caveats

Gra*fast*, PostGraphile V5 and most other packages in the same repository are
all pre-release software right now - this means it's essential you stay up to
date.

Thanks to a 3 month prealpha period and further changes since then we are
confident the software is now safe to run in production, but it's still young
and has not been fully battle tested yet (that's where you come in!)

You should follow the advice in [Production
Considerations](/grafast/production-considerations), especially if you're
allowing arbitary untrusted queries to your GraphQL schema (rather than using
an allow list via persisted operations, or using it only for internal tooling).

The software is still undergoing iteration; it's likely that a few APIs will
further evolve over time. Now that the pre-alpha phase is complete we expect
these changes to be relatively minor, and we'll detail them in the release
notes with each release. In particular, we are expecting to improve the
TypeScript types somewhat, which may necessitate some minor API refactors. For
other expected changes, check out the issues on the repository.

To stay up to date with the breaking changes, we recommend that you follow the
'sponsors-only-announcements' channel on Discord: https://discord.gg/graphile -
we summarize the major changes every week or so. For cutting edge info, see the
#🔮 channel.

:::tip

If your PostGraphile usage is mostly database driven then, other than changing
a few lines in your config from time to time, you should find V5 relatively
stable. If you have a lot of custom plugins then you may need to pay closer
attention to the changelogs.

:::

Now you're informed, set the following environmental variable to be able to run
the `@alpha` modules:

```
I_SPONSOR_GRAPHILE=and_acknowledge_prerelease_caveats
```

:::info

Please don't share this access code; instead link people to this web page so
that they may read the caveats for themselves (and also because the software
is in early access).

:::

Examples of setting the environmental variable:

```
# Bash/zsh (Linux, macOS, etc)
export I_SPONSOR_GRAPHILE="and_acknowledge_prerelease_caveats"
postgraphile -c postgres://...

# Windows Console
set I_SPONSOR_GRAPHILE=and_acknowledge_prerelease_caveats & postgraphile -c postgres://...

# Windows PowerShell
$env:I_SPONSOR_GRAPHILE='and_acknowledge_prerelease_caveats'; postgraphile -c postgres://...
```

Check out a PostGraphile V5 example repo here: https://github.com/benjie/ouch-my-finger
