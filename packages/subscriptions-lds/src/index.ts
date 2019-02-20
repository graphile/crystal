import PgLDSSourcePlugin from "./PgLDSSourcePlugin";

/*
 * Create subscription fields for query fields (and instant-trigger).
 * When subscription fields resolve, track the records that go out.
 * Subscribe to LDS for these records/collections.
 * When LDS announces change to relevant record/collection, re-run subscription.
 */
const SubscriptionsLdsPlugin = PgLDSSourcePlugin;

export default SubscriptionsLdsPlugin;
