// Source: https://github.com/zenparsing/es-observable

declare class Observable<T> {
  constructor (subscriber: SubscriberFn<T>)

  subscribe (observer: Observer<T>): Subscription
  subscribe (
    onNext: (value: T) => void,
    onError?: (error: Error) => void,
    onComplete?: (value?: any) => void
  ): Subscription

  static of <T>(...items: T[]): Observable<T>

  static from <T>(observable: Observable<T>): Observable<T>
  static from <T>(observable: Iterable<T>): Iterable<T>
  static from (observable: any): Observable<any>
}

interface Observer<T> {
  start (subscription: Subscription): void
  next (value: T): void
  error (error: Error): void
  complete (value?: any): void
}

interface Subscription {
  unsubscribe (): void
  closed: boolean
}

interface SubscriptionObserver<T> {
  next (value: T): void
  error (error: Error): void
  complete (value?: any): void
  closed: boolean
}

type SubscriberFn<T> = (observer: SubscriptionObserver<T>) => (() => void) | Subscription
