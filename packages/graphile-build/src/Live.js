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
  subscriptionReleasersByCounter: {
    [counter: string]: (() => void)[],
  };
  liveConditionsByCounter: { [counter: string]: Array<PredicateGenerator> };
  changeCallback: ((arg: any) => void) | null;
  changeCounter: number;
  extraRootValue: any;

  constructor(
    providers: { [namespace: string]: LiveProvider },
    extraRootValue: any
  ) {
    this.extraRootValue = extraRootValue;
    this.released = false;
    this.providers = providers;
    this.subscriptionReleasersByCounter = {};
    this.changeCallback = null;
    this.changeCounter = 0;
    this.liveConditionsByCounter = {};
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

  resetBefore(currentCounter: number) {
    // Clear out of date subscriptionReleasers
    {
      const oldCounters = Object.keys(
        this.subscriptionReleasersByCounter
      ).filter(n => parseInt(n, 10) < currentCounter);
      for (const oldCounter of oldCounters) {
        for (const releaser of this.subscriptionReleasersByCounter[
          oldCounter
        ]) {
          releaser();
        }
        delete this.subscriptionReleasersByCounter[oldCounter];
      }
    }
    // Clear out of date liveConditions
    {
      const oldCounters = Object.keys(this.liveConditionsByCounter).filter(
        n => parseInt(n, 10) < currentCounter
      );
      for (const oldCounter of oldCounters) {
        delete this.liveConditionsByCounter[oldCounter];
      }
    }
  }

  release() {
    if (this.handleChange) {
      this.handleChange.cancel();
    }
    this.handleChange = null;
    this.resetBefore(Infinity);
    this.providers = {};
    this.released = true;
  }

  // Tell Flow that we're okay with overwriting this
  handleChange: (() => void) | null;
  handleChange() {
    // This function is throttled to MONITOR_THROTTLE_DURATION (see constructor)
    if (this.changeCallback) {
      // Convince Flow this won't suddenly become null
      const cb = this.changeCallback;
      const counter = this.changeCounter++;
      /*
       * In live queries we need to know when the current result set has
       * finished being calculated so that we know we've received all the
       * liveRecord / liveCollection calls and can release the out of date
       * ones. To achieve this, we use a custom `subscribe` function which
       * calls `rootValue.release()` once the result set has been calculated.
       */
      this.subscriptionReleasersByCounter[String(counter)] = [];
      this.liveConditionsByCounter[String(counter)] = [];
      const changeRootValue = {
        ...this.extraRootValue,
        counter,
        liveCollection: this.liveCollection.bind(this, counter),
        liveRecord: this.liveRecord.bind(this, counter),
        liveConditions: this.liveConditionsByCounter[String(counter)],
        release: () => {
          // Despite it's name, this means that the execution has complete, which means we're actually releasing everything *before* this.
          this.resetBefore(counter);
        },
      };
      cb(changeRootValue);
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
    counter: number,
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
        this.subscriptionReleasersByCounter[String(counter)].push(releaser);
      }
    }
  }

  liveRecord(
    counter: number,
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
        this.subscriptionReleasersByCounter[String(counter)].push(releaser);
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

  getMonitor(extraRootValue: any) {
    return new LiveMonitor(this.providers, extraRootValue);
  }

  // Tell Flow that we're okay with overwriting this
  subscribe: (
    _parent: any,
    _args: any,
    context: any,
    _info: GraphQLResolveInfo
  ) => any;
  subscribe(
    _parent: any,
    _args: any,
    _context: any,
    _info: GraphQLResolveInfo
  ) {
    const monitor = this.getMonitor({
      liveAbort: e => {
        if (iterator) iterator.throw(e);
      },
    });
    const iterator = makeAsyncIteratorFromMonitor(monitor);
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
