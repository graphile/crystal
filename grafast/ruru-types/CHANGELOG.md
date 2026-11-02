# ruru-types

## 2.0.1

### Patch Changes

- [#3132](https://github.com/graphile/crystal/pull/3132)
  [`ce7a395`](https://github.com/graphile/crystal/commit/ce7a39548af4dfc830f63cdf00b7a669a01ccfcc)
  Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! -
  Remove `stripInternal` from the shared TypeScript compiler options.
  Previously, symbols tagged with `/** @internal */` were stripped from the
  generated `.d.ts` declaration files; they will now be included. This makes
  internal APIs visible in TypeScript but does not change any runtime behaviour.

## 2.0.0

Identical to 2.0.0-rc.6.

## 2.0.0-rc.6

### Patch Changes

- [#2990](https://github.com/graphile/crystal/pull/2990)
  [`5d408bd`](https://github.com/graphile/crystal/commit/5d408bd4fc33d1d4f2dc0410c7379a97406682e6)
  Thanks [@benjie](https://github.com/benjie)! - No code changes. Updates the
  release process, cleans up package.json, uses fixed identifiers for peer
  dependencies (unless they're explicit dependencies also). Hopefully move to
  trusted publishing.

## 2.0.0-rc.5

### Patch Changes

- [#2912](https://github.com/graphile/crystal/pull/2912)
  [`ebe1d22`](https://github.com/graphile/crystal/commit/ebe1d22e45156d9ec2274f291bbb824405e02049)
  Thanks [@benjie](https://github.com/benjie)! - Ruru now depends on ruru-types
  package - stripped down vs ruru-components

- [#2915](https://github.com/graphile/crystal/pull/2915)
  [`be9792b`](https://github.com/graphile/crystal/commit/be9792bea3b39097533b0f86e1d25ee66208909d)
  Thanks [@benjie](https://github.com/benjie)! - Fix some peerDependencies woes
