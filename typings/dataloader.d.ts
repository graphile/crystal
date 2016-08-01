declare module 'dataloader' {
  type Options<K, V> = {
    batch?: boolean,
    cache?: boolean,
    cacheKeyFn?: (key: any) => any,
    cacheMap?: CacheMap<K, Promise<V>>,
  }

  type CacheMap<K, V> = Map<K, V>

  export default class DataLoader<K, V> {
    constructor (
      batchLoadFn: (keys: K[]) => Promise<(V | Error)[]>,
      options?: Options<K, V>
    )

    public load (key: K): Promise<V>
    public loadMany (keys: K[]): Promise<V[]>
    public clearAll (): this
    public prime (key: K, value: V): this
  }
}
