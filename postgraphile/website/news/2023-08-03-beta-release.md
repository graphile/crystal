---
title: PostGraphile V5 public beta — get involved!
description: It’s finally here! The day has come that you can get your hands on an early release of PostGraphile Version 5!
slug: 2023-08-03-version-5-beta
authors:
  - name: Benjie
    title: Creator of PostGraphile
    url: https://github.com/Benjie
    image_url: https://github.com/Benjie.png
  - name: Jem
    title: "“I wear many hats”"
    url: https://fosstodon.org/@jem
    image_url: https://github.com/jemgillam.png
tags: [Beta]
hide_table_of_contents: false
toc_max_heading_level: 2
---

### It’s finally here! The day has come that you can get your hands on an _early release_ of PostGraphile Version 5; but we do have an ask: please help us to get it ready for release.

We need help writing automated tests, validating it works in your real-world applications, improving the documentation, keeping up with issues and community support, porting plugins, smoothing edges, and as always we need financial support so we can keep investing our time into V5 and our other projects.

It has taken us 3.5 years to get to this point and we’re pretty happy with the result, but there’s still plenty to be done before we’re ready to give it the big V5.0.0 stamp of approval!

## How can I help?

**Help us to ensure that the documentation is ready.** We’ve invested many weeks into writing the documentation for the various packages and projects (22 of them at last count!) which make up PostGraphile V5, but there’s still lots to do. We need people to read and follow the documentation, and to find the mistakes therein and submit issues or even patches.

**Help us to ensure that the software addresses your needs.** We’ve spent three years building this system, but it’s only really been tested by other people in the last 6 months. Early signs are very positive, but we want to know: does it work for you? Does it do what you need it to?

**Help us to ensure that the transition from V4 is as easy as possible.** We’ve spent a significant amount of time making the transition from V4 to V5 as easy as we can, building a preset that generates an almost identical schema, porting some of the V4 plugins to V5, and writing [detailed migration documentation](https://postgraphile.org/postgraphile/5/migrating-from-v4/). But we need your help: did migrating from V4 work well for you? Where were the rough edges, and how can we smooth them? Are you willing to help port community V4 plugin to V5?

**Help us to test V5.** We have ported the V4 test suite over to V5 so we know that it works well for that, but there’s so many different combinations of options and plugins that you can do with PostGraphile that many have only been tested manually, and they really need automated tests to prevent regressions. We also need you to use V5 in your own applications and let us know how you get on — both negative and positive — to help us move towards the all-important 5.0.0 release.

**Help us to improve the experience of V5.** We’ve put a lot of effort into both documentation and TypeScript types, but these can always be improved. There’s boilerplate in a few places that could be addressed with improvements to APIs, or with new abstractions. Try it out, and help us to improve the developer experience!

**Help us to educate people about V5.** We don’t have a marketing department, we cannot afford a developer relations team or to sponsor big events. We’ll need your help to get the word out about PostGraphile V5, when the time comes; in the meantime we could really do with some help building example applications and tutorials to help people get started.

<!--truncate-->

## What does “beta” mean for PostGraphile?

We believe that **PostGraphile V5 is suitable to run in production** and that we’ve completed most of the significant API rewrites that we wanted to make. There’s still some expected (and maybe a couple unexpected) changes to come, but mostly the beta phase is there to gather feedback from the community about how it works for you, and to leave space to make breaking changes if they turn out to be necessary before we place the stamp on the final V5.0.0 release.

### Tests, docs and examples

Many of the [remaining issues](https://github.com/benjie/crystal/milestone/3) are to add tests, write documentation and build examples; if you’re someone who doesn’t like to ask politely for help and expects the documentation to be complete when they come to use the software then you should probably hold off from using PostGraphile V5 until the v5.0.0 release is out.

### TypeScript types

One significant outstanding task which will likely cause some “breaking changes” is to review and potentially rewrite some of the TypeScript types. In some places types are a bit loose, in others there are old generics left around that are no longer needed, or generics in the wrong order, or other similar concerns. These issues don’t make the system unsafe to run in production, but they do require breaking changes to resolve, and we don’t want to have to jump to version 6 just to fix the TypeScript types of one of our APIs!

We would love your help with this if you’re good at TypeScript!

### Other “nice-to-haves”

There are also a couple of other features that need to be added, for example integrating the Koa adaptor with Koa’s websocket framework like we've already done for Fastify. V4 of PostGraphile “emulated” an express stack for websocket connections in order to allow things like `pgSettings` to continue to function, but in V5 we’ll be better integrating the functionality of the different webservers — you’ll be able to read about that in Part 7 of [our “Intro to V5” series](https://dev.to/benjie/series/23459)!

There’s also a bunch of optional enhancements that we’d really like to have in place before we launch v5.0.0 but if necessary we can do them later:

- digging into the generated SQL and optimizing it _even further_,
- integrating the Node http2 webserver,
- optimizing the code that’s exported by the Graphile Export command [you may have read about last week](https://dev.to/graphile/intro-to-postgraphile-v5-part-6-excellent-executable-exports-1150).

There’s also the ongoing work to improve the tooling around our tooling, to make it easier for you to debug issues.

## How do I try it out?

If you’re a V4 user then now is an excellent time to take V5 for a spin and let us know how you get on! You don’t even have to commit to migrating (though we hope once you’ve had a go you’ll definitely want to!), just some quick experiments with the things that you use PostGraphile for could be very useful.

You can read all about the new features in V5 in our new series [Intro to V5](https://dev.to/graphile/intro-to-postgraphile-v5-part-1-replacing-the-foundations-3lh0) or if you prefer to just read the highlights, check out the migration guide’s [new feature summary](https://postgraphile.org/postgraphile/5/migrating-from-v4/v5-new-feature-summary) and be sure to expand the bullets that have more details!

All the packages are published under the `@beta` tag, so you'll need to ensure you include that when issuing install instructions (e.g. `yarn add postgraphile@beta`).

The fastest way to try PostGraphile V5 is with our new `pgl` command which you don’t even have to install:

```
npx pgl@beta -P pgl/amber -e -c postgres:///my_db -s public
```

(Replace the connection string and schema name with your database connection string and schema name(s).)

If you want to try PostGraphile V5 with a few plugins, one option is:

1. Check out [https://github.com/benjie/ouch-my-finger](https://github.com/benjie/ouch-my-finger)
2. Run `yarn` to install the dependencies
3. Run `yarn postgraphile -c postgres:///my_db -s public` giving your database’s connection string and schema(s)

Ideally, you’d follow [the migration guide](https://postgraphile.org/postgraphile/5/migrating-from-v4/) and start integrating V5 into your existing projects!

### Join our testing community

If you use Discord, join our server at [https://discord.gg/graphile](https://discord.gg/graphile) and chat away with other V5 users — talk over the new features, discuss any issues you encounter and explore different ways of using the new projects. We look forward to welcoming you and hearing of your suggestions and successes with V5!
