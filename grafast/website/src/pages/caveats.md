# Pre-release caveats

Gra*fast*, PostGraphile V5 and most other things in the same repository are all
pre-release software right now - this means that if you're using this software
it's essential that you stay up to date so you can get fixes (potentially
including security fixes) as early as possible.

Thanks to a 3 month prealpha period we've dealt with the most important issues
and believe the software is now _generally_ safe to run, but it's still young
and has not been fully battle tested yet.

Why _generally_ safe? Our main concern is that we have a lot of work left to do
in optimizing query planning, and because planning is synchronous it's possible
that a malicious actor could attempt to lock up the event loop with expensive
planning operations, causing a denial of service attack. We'll be adding a
(configurable) planning timeout soon, but even once that's added we don't yet
have the monitoring, logging or analytics in place that you may want to track
potential bad actors. The best way to protect yourself from this attack vector
right now is either to only open your API to trusted parties (e.g. for internal
tooling) or to use "persisted operations"/"persisted queries" as an operation
allowlist so that only trusted operation can be executed.

The software is still undergoing iteration, so it's likely that some APIs will
further evolve over time, breaking code that you've written that relies on the
older interfaces. In particular, we are expecting to change the TypeScript
types somewhat, and it's also likely that a small number of the APIs and
configuration options will be renamed or relocated for organization and clarity
reasons (most of this work was completed during the prealpha phase). For other
expected changes, check out the issues on the repository.

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
