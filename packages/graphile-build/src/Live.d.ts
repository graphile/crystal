// @flow
/* eslint-disable flowtype/no-weak-types */
import { GraphQLResolveInfo } from "graphql";

type SubscriptionReleaser = () => void;
type SubscriptionCallback = () => void;

export abstract class LiveSource {
  abstract subscribeCollection(
    _callback: SubscriptionCallback,
    _collectionIdentifier: any,
    _predicate?: (record: any) => boolean
  ): SubscriptionReleaser | null;

  abstract subscribeRecord(
    _callback: SubscriptionCallback,
    _collectionIdentifier: any,
    _recordIdentifier: any
  ): SubscriptionReleaser | null;
}

export abstract class LiveProvider {
  sources: Array<LiveSource>;
  namespace: string;

  constructor(namespace: string);

  registerSource(source: LiveSource): void;

  abstract collectionIdentifierIsValid(_collectionIdentifier: any): boolean;

  abstract recordIdentifierIsValid(
    _collectionIdentifier: any,
    _recordIdentifier: any
  ): boolean;
}

export class LiveMonitor {
  providers: { [namespace: string]: LiveProvider };
  subscriptionReleasers: (() => void)[];

  constructor(providers: { [namespace: string]: LiveProvider });

  reset(): void;
  release(): void;
  handleChange(): void;
  onChange(callback: () => void): void;
  liveCollection(
    namespace: string,
    collectionIdentifier: any,
    predicate?: (record: any) => boolean
  ): void;

  liveRecord(
    namespace: string,
    collectionIdentifier: any,
    recordIdentifier: any
  ): void;
}

export class LiveCoordinator {
  providers: { [namespace: string]: LiveProvider };

  registerProvider(provider: LiveProvider): void;

  registerSource(namespace: string, source: LiveSource): void;

  getMonitorAndContext(): {
    monitor: LiveMonitor;
    context: any;
  };

  subscribe(
    _parent: any,
    _args: any,
    context: any,
    _info: GraphQLResolveInfo
  ): AsyncIterable<void>;
}
