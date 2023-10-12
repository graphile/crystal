---
title: PostGraphile V5 alpha is here!
description: PostGraphile Version 5 is now ready to run in some production environments!
slug: 2023-04-26-version-5-alpha
authors:
  - name: Benjie
    title: Creator of PostGraphile
    url: https://github.com/Benjie
    image_url: https://github.com/Benjie.png
  - name: Jem
    title: "“I wear many hats”"
    url: https://fosstodon.org/@jem
    image_url: https://github.com/jemgillam.png
tags: [Alpha]
hide_table_of_contents: false
---

### Now production ready… for some environments

January marked a big milestone for PostGraphile Version 5, when it began the prealpha stage - where early adopters could install the packages from npm (if they knew the secret 😉) and easily test V5 within their current stacks. Up until that point, it was only possible to run the project by cloning the repository and building it yourself - not ideal for serious testing!

Throughout the prealpha phase we smoothed the edges, closed gaps, tidied APIs, discovered which pieces of terminology worked and which did not, and did a lot of API restructuring and stabilization.

With thanks to everyone in the V5 testing community - and a special shout out for the excellent and continued feedback from our sponsors dfg, hov, James, Josiah and the Netflix team, mattste, Simon, and Timo - we are in a much better shape three months on. We now have a [detailed migration guide](/postgraphile/next/migrating-from-v4), [updated docs](/postgraphile/next), an enhanced developer experience and much improved backwards compatibility!

### What’s new in Version 5?

Our main aim in V5 was to replace the cumbersome lookahead system with something much more pleasant and powerful. To serve this need we iterated and iterated, and ultimately invented Gra*fast*: a new planning and execution engine for GraphQL (see our public video introduction [on YouTube](https://youtu.be/H26uBe_lLag)). Gra*fast* uses a declarative planning system which brings with it a new, holistic approach to executing GraphQL queries. For you, this means simpler abstractions, better performance, and code which is easier to read and maintain.

Gra*fast* even generates a plan diagram showing what steps are necessary to execute your operation and how the data flows between each of the steps, which is a massive boon to debugging both for you, and for us!

<!--truncate-->

Thanks to these advanced planning capabilities, PostGraphile is now able to generate much more optimal (and easier to read!) SQL queries and offload significant work from the database, allowing your applications to scale even further than previously possible.

Since the lookahead system underpinned everything in Version 4, replacing it meant we needed to rebuild everything from the ground-up on these new, more solid and capable foundations. We decided to use this opportunity to fix a huge number of other niggles and suboptimal experiences that were present in V4 - and also enable a decent complement of capabilities that simply were not possible in the V4 architecture. Ultimately, Version 5 brings a number of new paradigms to PostGraphile; some of the main features of PostGraphile V5 you'll be able to enjoy include:

- Multiple forms of database-based polymorphism (producing GraphQL interfaces and unions)
- GraphQL’s new incremental delivery (`@stream` and `@defer` directives) [early version]
- Exporting your executable schema as optimized JS code
- New “behavior” system that fixes the shortcomings of `@omit` and similar smart tags
- Massively enhanced TypeScript typings throughout
- Generate personalized documentation based on the plugins and presets you’re using
- On-demand transactions - enabling workflows which Version 4’s model precluded
- Consolidated configuration across CLI, library and schema-only usage
- Shareable and composable presets
- A unified and more powerful plugin system
- And much, much more!

### It’s in Alpha, Jim, but not as we know it

While some projects use the alpha phase for discovery and prototyping, and suffer through countless breaking changes and critical bugs, we've already completed that phase – we’re ready to take things to the next level.

Now is the time for you to try out V5! We're confident that our software will generate a fully functional GraphQL schema for you, and it already passes the full suite of Version 4 tests (plus many more), and is in use by a number of testers. We even made a V4 preset and detailed migration guide to allow you to get started as easily as possible.

**If you don’t try V5 until after its public release then it may be too late to comment on things that could have been improved**. Though we believe our APIs are already in near-final form, remaining in alpha phase gives us the freedom to apply breaking changes to APIs if the benefits outweigh the costs.

Get involved! Does it solve your problems? Can we make it easier for you to migrate to? Are there performance regressions? Do the TypeScript types align with your usage?

[Visit the migration guide to get started](/postgraphile/next/migrating-from-v4).

### Where to use Version 5 today

If you’re using PostGraphile with purely pre-vetted operations (e.g. via persisted operations), or are using PostGraphile with an API audience which is generally trusted (e.g. as internal services within your company) then with careful consideration and monitoring you should be safe to put V5 into production today. Early results from testers have been very promising!

If you’re using PostGraphile in a more public facing capacity and are not protecting it with an operation allowlist then you may want to start testing on your development and staging servers but hold off from a production release until we’ve added a few additional safety measures (for example, adding a planning timeout to prevent denial of service through expensive planning attacks).

If you just want to help out in the testing of V5 without shipping to production, you should check out our quick start repo, [ouch-my-finger](https://github.com/benjie/ouch-my-finger), which is kept up to date with the latest V5 releases. It’s a great way to connect to your database in a test environment and give V5 a go, and also a great way to send reproducible test cases to us if you hit any snags.

As the alpha progresses we hope, with the help of your feedback and testing, the software will become more and more suitable for running in various production environments. We can't wait to see what you build with it!

### Beyond Alpha...

By the end of the alpha phase, we should all be confident that V5 is safe to run in production, and all the expected API changes should be complete. Then we'll move onto the beta phase, during which we'll focus on performance, documentation, and also improving the experience. For example, this would be the phase during which we'll be putting time into making sure that the schema exporting functionality is outputting pleasant code, and making it easy for plugin developers to indicate whether or not their plugins support exporting.

Work helping to migrate V4 community plugins to V5 will also continue during this phase, as may experimentation with additional functionality such as live queries. Beta users should find the API stability much improved since the alpha, but we still reserve the right to release breaking API changes if they have substantial benefits.

By the end of the beta phase, the APIs should be stable, the software should be performant, and everyone involved should be confident running it in production. Then we'll take the final beta and release it as "release candidate 1," and all going well, ultimately release that as PostGraphile v5.0.0.

It has been a long road to get here, and we thank you all so much for your continued support - we could never have accomplished this feat without you! We really hope you're going to love PostGraphile V5 and all the new technology and tooling that it introduces to make your jobs both easier and more fun. Thank you!

_Keep your eyes peeled for a series of articles going into a greater depth about each of the new features of Version 5, a digest of which will be shared to our mailing list, our [community Discord](https://discord.gg/graphile) and [social media](https://fosstodon.org/@graphile)._
