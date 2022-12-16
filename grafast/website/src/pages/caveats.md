# Pre-release caveats

Gra*fast*, PostGraphile V5 and most other things in the same repository are all
pre-release software right now.

:::warning

**DO NOT LET THIS SOFTWARE SEE UNTRUSTED INPUT, YET.**

:::

Here's a selection of the reasons you should not expose this software to the
internet or other untrusted inputs:

🚨 There are areas of the code I strongly suspect may have **security
vulnerabilities** (particularly prototype-pollution), you may find them if you
grep the code for `TODO` comments. These will of course be addressed before
release.

🚨 Errors contain too much detail - more than you would want a user/attacker to
know.

🚨 The software itself may be unstable and produce unexpected errors or even
crashes.

🚨 Planning extremely complex queries may take a while - this needs
optimisation and defences.

In addition to the major issues above, the software is also still undergoing
heavy iteration, so it's likely that certain APIs will evolve over time,
breaking code that you've written that relies on the older interfaces. In
particular, we are expecting to change the TypeScript types very heavily, and
it's also likely that a number of the APIs will be renamed. For other expected
changes, check out the issues on the repository.

:::tip

PostGraphile V5 is already passing the V4 test suite and uses Gra*fast*
heavily, so the above disclaimers might be a little over-dramatised. You should
absolutely feel comfortable running this software on your own machine with
queries that you are building yourself. Just don't let any potential attacker
get access to it!

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
