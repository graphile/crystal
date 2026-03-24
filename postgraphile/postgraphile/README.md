# PostGraphile

> **High-performance GraphQL APIs, honed exactly to your needs, with minimal
> effort expended**

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/BSky-@Graphile.org-006aff.svg)](https://bsky.app/profile/graphile.org)
[![Follow](https://img.shields.io/badge/Mastodon-@Graphile.fosstodon.org-6364ff.svg)](https://fosstodon.org/@graphile)

**Documentation**: https://postgraphile.org/postgraphile/next/

## About

**Focus on only writing the code that brings value.**

If you use Postgres as your primary datastore, PostGraphile helps you build
best-practices, well-structured, frontend-focused, and high-performance GraphQL
APIs, honed exactly to your needs, with minimal effort expended.

## How it works

Rather than spending months hand-writing and maintaining an entire schema,
PostGraphile handles the repetitive parts so you can focus on the code that
really matters.

Out of the box, PostGraphile analyzes your PostgreSQL database and builds a
complete, consistent GraphQL schema informed by its tables, relations,
functions, indexes, permissions, and your configuration. Into this living
baseline that evolves with your database, you seamlessly compose customizations
and extensions to sculpt the perfect GraphQL API for your client's needs with
minimal effort:

- Seamlessly extend the schema with your own custom types and fields that can
  execute SQL or Node.js code (see "Extensible" below).
- Use database permissions to govern which parts to expose; it's quick,
  ergonomic, granular, and it improves your security posture.
- Use our powerful plugin and preset system to apply your general preferences to
  the generated GraphQL schema.
- Use simple "tags" to fine-tune individual database entities: renaming them,
  choosing when/how to expose them, changing their
  type/presentation/nullability, indicating abstract types (interfaces/unions),
  introducing additional relations, and more.
- Use our "inflection" system to overhaul naming across the generated schema (we
  recommend
  [`@graphile/simplify-inflection`](https://www.npmjs.com/package/@graphile/simplify-inflection)
  if your database schema meets the requirements).
- Use third party plugins to add new features and capabilities.
- And much more!

## Execution efficiency

Backed by the cutting edge [Gra*fast*](https://grafast.org) planning and
execution engine for GraphQL, PostGraphile has outstanding performance,
typically out-performing hand-written GraphQL schemas using traditional
GraphQL.js resolvers.

## Consistency

PostGraphile's autogeneration of the common parts of your API helps ensure
consistency, whilst its plugin and preset system allows you to tweak every facet
of your schema to your heart's content.

## No lock-in

If you ever feel the need to leave PostGraphile, you can
[export your schema as executable code](https://postgraphile.org/postgraphile/5/exporting-schema),
and take over maintenance yourself — all without losing the performance
advantages of our fully-planned execution.

## Extensible

GraphQL is frontend-focused, so in most cases your API should be shaped by
client needs rather than being a simple 1-to-1 map of your database.
PostGraphile helps you achieve this with minimal effort.

In practice, many of your business domain objects naturally align across the
frontend, backend, and database; for these, a few tags or helper functions are
typically sufficient to accommodate minor differences.

For domains that don't fit that model, PostGraphile is built with extensibility
and composability at its heart. You can seamlessly adjust the schema to fit,
without sacrificing the productivity and performance gains you get from the rest
of the system.

Almost every feature in PostGraphile, from introspection through to type
generation and on to adding pagination arguments, is implemented via plugins.
PostGraphile's plugin API is incredibly powerful and flexible; it's designed for
you to use and even has helper factories to give more ergonomic APIs for common
needs.

Let's take the example of a checkout process. Your database only exposes the
underlying `products`, `prices`, `cart_items`, and so on, but your frontend
needs to know `subtotal`, `tax`, etc. Prices may vary depending on promotional
discounts or other business rules. It should not be up to the client to
implement these details client-side, instead your GraphQL schema should expose
them as helpful strongly typed and well documented fields.

In PostGraphile, you can handle this in the database:

```sql
-- Hide the "prices" table from the GraphQL schema.
comment on table prices is '@behavior -*';

-- Create the `Product.unitPrice` field to get the current price of an item
create function products_unit_price(p products) returns money as $$
  select unit_price
  from prices
  where product_id = p.product_id
  and now() >= valid_from
  and now() < valid_until;
$$ language sql stable;

-- Add documentation for this field
comment on function products_unit_price is
  'The unit price at the current time, reflecting promotional discounts.';
```

This will automatically add a `Product.unitPrice` field that finds the current
unit price of the given product according to the time validity. (Here we assume
the time periods will not overlap, but if they do then you can add
`order by unit_price asc limit 1` to the query.)

If your business logic is more complex, you could instead achieve this via a
schema extension; this also allows for more advanced logic such as querying an
external service to determine shipping costs.

Let's imagine we didn't add the above function, and instead want to implement
the logic in a plugin, along with adding cart "summary" logic (subtotal,
shipping, tax, total).

```ts
import { extendSchema } from "postgraphile/utils";
import { constant, context, get } from "postgraphile/grafast";
import { batchSummarizeCart } from "./businessLogic/cart";

export default extendSchema((build) => {
  const {
    pgExecutor,
    pgResources: { cartItems, products, prices },
  } = build;
  return {
    typeDefs: /* GraphQL */ `
      extend type Product {
        "The unit price at the current time, reflecting promotional discounts."
        unitPrice: Money!
      }

      extend type Cart {
        summary: CartSummary
      }

      type CartSummary {
        subtotal: Money!
        shipping: Money!
        tax: Money!
        total: Money!
      }
    `,
    plans: {
      Product: {
        unitPrice($item) {
          // Find the relevant price
          const productId = $item.get("product_id");
          const $prices = prices.find({ productId: $productId });
          $prices.where(sql`now() >= valid_from and now() < valid_until`);

          // There's exactly one row, fetch it and return the unit price
          return $prices.single().get("unit_price");
        },
      },
      Cart: {
        summary($cart) {
          const $cartId = $cart.get("id");
          return loadOne($cartId, batchSummarizeCart);
        },
      },
      // CartSummary doesn't need plan resolvers, it can use the defaults.
    },
  };
});
```

With `extendSchema()` you can add custom types and fields that invoke arbitrary
Node.js business logic, integrating with any datasource Node.js can communicate
with. This can also be used to maintain backwards compatibility if and when you
make breaking changes to your database schema. And that's just one of our plugin
helpers, there's so much more you can do to make the schema your own!

<details>
  <summary>
    Click to see example business logic for this schema
  </summary>

Your business logic can be implemented in any way that you want and can do
anything Node.js can do; typically we assume you're using DataLoader-style
callbacks (you can actually use your DataLoader callbacks with
`loadOne`/`loadMany` directly!) to enable batched loading, but the `loadOne()`
and `loadMany()` steps you'd use to call them can
[have many advantages over DataLoader](https://grafast.org/grafast/standard-steps/loadMany#enhancements-over-dataloader).

```ts
// businessLogic/cart.ts

import { context } from "postgraphile/grafast";

export const batchSummarizeCart = {
  // Plan to get access to the GraphQL context in our loader
  shared: () => context(),

  // `cartIds` is the batch of Cart identifiers, `shared` is the runtime GraphQL
  // context (shared by everything in the batch)
  async load(cartIds, { shared }) {
    const carts = await batchGetCartInfo(shared, cartIds);
    const cartsWithShipping = await batchCalculateShippingCosts(carts);
    const cartsWithTax = await batchCalculateTax(cartsWithShipping);
    return cartIds.map((cartId) => {
      const cartInfo = cartsWithTax.find((c) => c.cart_id === cartId);
      const { subtotal, shipping, tax } = cartInfo;
      const total = subtotal + shipping + tax;
      return { subtotal, shipping, tax, total };
    });
  },
};

/** Cart info from the database */
interface CartInfo {
  cart_id: number;
  shipping_address: Address;
  subtotal: number;
  mass: number;
}
async function batchGetCartInfo(shared, cartIds) {
  // Single DB fetch across all carts; you could use you ORM instead if you want.
  const result = await shared.withPgClient(shared.pgSettings, (db) =>
    db.query<CartInfo>({
      text: `
        select
          carts.id as cart_id,
          to_json(carts.shipping_address) as shipping_address,
          sum(cart_items.quantity * prices.unit_amount) as subtotal,
          sum(cart_items.quantity * products.mass) as mass
        from carts
        inner join cart_items
        on (cart_items.cart_id = carts.id)
        inner join prices
        on (
          prices.product_id = cart_items.product_id
          and now() >= valid_from
          and now() < valid_to
        )
        where carts.id = any($1::int[])
        group by carts.id
      `,
      values: [cartIds],
    }),
  );
  return result.rows;
}

interface CartInfoWithShipping extends CartInfo {
  shipping: number;
}

async function batchCalculateShippingCosts(carts: CartInfo[]) {
  // TODO: given the mass and address for each cart, determine its shipping cost
  return carts.map((cart) => ({ ...cart, shipping: 500 }));
}

interface CartInfoWithShippingAndTax extends CartInfoWithShipping {
  shipping: number;
}
async function batchCalculateTax(carts: CartInfoWithShipping[]) {
  // TODO: update with the correct taxes for the region
  const TAX_PERCENTAGE = 20;
  return carts.map((cart) => ({
    ...cart,
    tax: ((cart.subtotal + cart.shipping) * TAX_PERCENTAGE) / 100,
  }));
}
```

</details>

## Summary

If your backend uses PostgreSQL as its primary datastore, and you use a
conventional relational schema, PostGraphile is the best way to get your project
up and running in record time; and, thanks to its incredibly efficient execution
that eliminates under- and over-fetching on the backend, it helps you reach
significant scale with minimal resources and minimal complexity.

Stop building boilerplate, iterate faster, and start shipping today with
PostGraphile;
[click here to get started](https://postgraphile.org/postgraphile/5).

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://gosteelhead.com/"><img src="https://graphile.org/images/sponsors/steelhead.svg" width="90" height="90" alt="Steelhead" /><br />Steelhead</a> *</td>
<td align="center"><a href=""><img src="https://graphile.org/images/sponsors/https://outbankapp.com/" width="90" height="90" alt="Outbank" /><br />Outbank</a></td>
<td align="center"><a href="https://constructive.io/"><img src="https://graphile.org/images/sponsors/constructive.svg" width="90" height="90" alt="Constructive" /><br />Constructive</a></td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->
