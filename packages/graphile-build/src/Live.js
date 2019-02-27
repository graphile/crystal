// @flow
/* eslint-disable flowtype/no-weak-types */
import callbackToAsyncIterator from "./callbackToAsyncIterator";
import type { GraphQLResolveInfo } from "graphql";
import { throttle } from "lodash";

type SubscriptionReleaser = () => void;
type SubscriptionCallback = () => void;

type Predicate = (record: any) => boolean;
type PredicateGenerator = (data: any) => Predicate;

const MONITOR_THROTTLE_DURATION =
  parseInt(process.env.LIVE_THROTTLE || "", 10) || 500;

/*
 * Sources are long-lived (i.e. in "watch" mode you just re-use the same one
 * over and over) because there is no release for them
 */
export class LiveSource {
  subscribeCollection(
    _callback: SubscriptionCallback,
    _collectionIdentifier: any,
    _predicate?: Predicate
  ): SubscriptionReleaser | null {
    return null;
  }

  subscribeRecord(
    _callback: SubscriptionCallback,
    _collectionIdentifier: any,
    _recordIdentifier: any
  ): SubscriptionReleaser | null {
    return null;
  }
}

/*
 * Providers enable a namespace, perform validation, and track the sources used
 * by that namespace within one single schema build. The should not directly use
 * any long-lived features as they do not have an explicit "release"/"close"
 * command when a new schema is built.
 */
export class LiveProvider {
  sources: Array<LiveSource>;
  namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
    this.sources = [];
  }

  registerSource(source: LiveSource) {
    this.sources.push(source);
  }

  collectionIdentifierIsValid(_collectionIdentifier: any): boolean {
    return false;
  }

  recordIdentifierIsValid(
    _collectionIdentifier: any,
    _recordIdentifier: any
  ): boolean {
    return false;
  }
}

/*
 * During a single execution of GraphQL (specifically a subscription request),
 * the LiveMonitor tracks the resources viewed and subscribes to updates in them.
 */
export class LiveMonitor {
  released: boolean;
  providers: { [namespace: string]: LiveProvider };
  subscriptionReleasers: (() => void)[];
  changeCallback: (() => void) | null;
  liveConditions: Array<PredicateGenerator>;

  constructor(providers: { [namespace: string]: LiveProvider }) {
    this.released = false;
    this.providers = providers;
    this.subscriptionReleasers = [];
    this.changeCallback = null;
    this.liveConditions = [];
    if (!this.handleChange) {
      throw new Error("This is just to make flow happy");
    }
    this.handleChange = throttle(
      this.handleChange.bind(this),
      MONITOR_THROTTLE_DURATION,
      {
        leading: true,
        trailing: true,
      }
    );
    this.onChange = this.onChange.bind(this);
  }

  reset() {
    // clear monitoring
    for (const releaser of this.subscriptionReleasers) {
      releaser();
    }
    this.subscriptionReleasers = [];
    // Delete everything from liveConditions, we'll be getting fresh conditions soon enough
    this.liveConditions.splice(0, this.liveCollection.length);
  }

  release() {
    if (this.handleChange) {
      this.handleChange.cancel();
    }
    this.handleChange = null;
    this.reset();
    this.providers = {};
    this.released = true;
  }

  // Tell Flow that we're okay with overwriting this
  handleChange: (() => void) | null;
  handleChange() {
    if (this.changeCallback) {
      // Convince Flow this won't suddenly become null
      const cb = this.changeCallback;
      this.reset();
      cb();
    } else {
      // eslint-disable-next-line no-console
      console.warn("Change occurred, but no-one was listening");
    }
  }

  // Tell Flow that we're okay with overwriting this
  onChange: (callback: () => void) => void;
  onChange(callback: () => void) {
    if (this.released) {
      throw new Error("Monitors cannot be reused.");
    }
    if (this.changeCallback) {
      throw new Error("Already monitoring for changes");
    }
    // Throttle to every 250ms
    this.changeCallback = callback;
    if (this.handleChange) {
      setImmediate(this.handleChange);
    }
    return () => {
      if (this.changeCallback === callback) {
        this.changeCallback = null;
      }
      this.release();
    };
  }

  liveCollection(
    namespace: string,
    collectionIdentifier: any,
    predicate: (record: any) => boolean = () => true
  ) {
    const handleChange = this.handleChange;
    if (this.released || !handleChange) {
      return;
    }
    const provider = this.providers[namespace];
    if (!provider || provider.sources.length === 0) return;
    if (!provider.collectionIdentifierIsValid(collectionIdentifier)) {
      throw new Error(
        `Invalid collection identifier passed to LiveMonitor[${namespace}]: ${collectionIdentifier}`
      );
    }
    for (const source of provider.sources) {
      const releaser = source.subscribeCollection(
        handleChange,
        collectionIdentifier,
        predicate
      );
      if (releaser) {
        this.subscriptionReleasers.push(releaser);
      }
    }
  }

  liveRecord(
    namespace: string,
    collectionIdentifier: any,
    recordIdentifier: any
  ) {
    const handleChange = this.handleChange;
    if (this.released || !handleChange) {
      return;
    }
    // TODO: if (recordIdentifier == null) {return}
    const provider = this.providers[namespace];
    if (!provider || provider.sources.length === 0) return;
    if (!provider.collectionIdentifierIsValid(collectionIdentifier)) {
      throw new Error(
        `Invalid collection identifier passed to LiveMonitor[${namespace}]: ${collectionIdentifier}`
      );
    }
    if (
      !provider.recordIdentifierIsValid(collectionIdentifier, recordIdentifier)
    ) {
      throw new Error(
        `Invalid record identifier passed to LiveMonitor[${namespace}]: ${collectionIdentifier}`
      );
    }
    for (const source of provider.sources) {
      const releaser = source.subscribeRecord(
        handleChange,
        collectionIdentifier,
        recordIdentifier
      );
      if (releaser) {
        this.subscriptionReleasers.push(releaser);
      }
    }
  }
}

/*
 * There is one coordinator for each build of the GraphQL schema, it tracks the providers
 * and gives a handy `subscribe` method that can be used for live queries (assuming
 * that the `resolve` is provided the same as in a Query).
 */
export class LiveCoordinator {
  providers: { [namespace: string]: LiveProvider };

  constructor() {
    this.providers = {};
    this.subscribe = this.subscribe.bind(this);
  }

  registerProvider(provider: LiveProvider) {
    const { namespace } = provider;
    if (this.providers[namespace]) {
      throw new Error(`Namespace ${namespace} already registered with Live`);
    }
    this.providers[namespace] = provider;
  }

  registerSource(namespace: string, source: LiveSource) {
    if (!this.providers[namespace]) {
      // eslint-disable-next-line no-console
      console.warn(
        `LiveProvider '${namespace}' is not registered, skipping live source.`
      );
      return;
    }
    this.providers[namespace].registerSource(source);
  }

  getMonitorAndContext() {
    const monitor = new LiveMonitor(this.providers);
    return {
      monitor,
      context: {
        liveCollection: monitor.liveCollection.bind(monitor),
        liveRecord: monitor.liveRecord.bind(monitor),
        liveConditions: monitor.liveConditions,
      },
    };
  }

  // Tell Flow that we're okay with overwriting this
  subscribe: (
    _parent: any,
    _args: any,
    context: any,
    _info: GraphQLResolveInfo
  ) => any;
  subscribe(_parent: any, _args: any, context: any, _info: GraphQLResolveInfo) {
    const { monitor, context: additionalContext } = this.getMonitorAndContext();
    Object.assign(context, additionalContext);
    const iterator = makeAsyncIteratorFromMonitor(monitor);
    context.liveAbort = e => {
      iterator.throw(e);
    };
    return iterator;
  }
}

export function makeAsyncIteratorFromMonitor(monitor: LiveMonitor) {
  return callbackToAsyncIterator(monitor.onChange, {
    onClose: release => {
      if (release) release();
    },
  });
}
