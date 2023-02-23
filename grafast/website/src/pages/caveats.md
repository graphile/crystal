# Pre-release caveats

Gra*fast*, PostGraphile V5 and most other things in the same repository are all
pre-release software right now. Though we're now at a stage where the scarier
warnings have been dealt with, it hasn't been battle-tested yet.

Further, the software is still undergoing heavy iteration, so it's likely that
many APIs will evolve over time, breaking code that you've written that relies
on the older interfaces. In particular, we are expecting to change the
TypeScript types very heavily, and it's also likely that a number of the APIs
and configuration options will be renamed or relocated for organization and
clarity reasons. For other expected changes, check out the issues on the
repository.

To stay up to date with the breaking changes, we recommend that you follow the
'sponsors-only-announcements' channel on Discord: https://discord.gg/graphile -
we summarize the major changes every week or so. For cutting edge info, see the
#🔮 channel.

:::tip

If your PostGraphile usage is mostly database driven then, other than changing
a few lines in your config from time to time, you should find V5 relatively
stable. If you have a lot of custom plugins then you may need to pay a lot
closer attention to the changelogs.

:::

If you acknowledge all of the above and still wish to proceed then you may set
the following environmental variable to be able to run the `@prealpha` modules:

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
