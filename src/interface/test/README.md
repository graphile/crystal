# Interface Tests
This package runs provides test functions that can be run on any object that implements these interfaces. These sanity tests ensure all of the assumptions we make about the interface are actually true for a given implementation.

These tests are expected to run in a Jasmine environment where the exported global Jasmine variables include `describe`, `it`, and `expect`.

Eventually this will likely be separated into its own package, but for now it lives in the `interface` package.
