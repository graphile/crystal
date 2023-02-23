# Pre-release caveats

Gra*fast*, PostGraphile V5 and most other things in the same repository are all
pre-release software right now.

Here's a selection of the reasons **you should not expose this pre-release
software to the internet or other untrusted inputs**:

🚨 Errors contain too much detail - more than you would want a user/attacker to
know.

🚨 It hasn't been battle-tested yet.

In addition to the issues above, the software is also still undergoing heavy
iteration, so it's likely that certain APIs will evolve over time, breaking
code that you've written that relies on the older interfaces. In particular, we
are expecting to change the TypeScript types very heavily, and it's also likely
that a number of the APIs will be renamed. For other expected changes, check
out the issues on the repository.

:::tip

PostGraphile V5 is already passing the V4 test suite and uses Gra*fast*
heavily, so the above disclaimers might be a little over-dramatised. You should
absolutely feel comfortable running this software on your own machine with
queries that you are building yourself. Just be aware that a potential attacker
may be able to glean more from it than they will be able to when it's deemed
production ready.

:::

If you acknowledge all of the above and still wish to proceed then you may set
the following environmental variable to be able to run the code:

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
