import Condition from './selection/Condition'

type CollectionPaginatorConfig = {
  condition?: Condition,
}

type CollectionPaginatorForwardConfig = CollectionPaginatorConfig & {
  afterCursor?: string,
  first?: number,
}

type CollectionPaginatorBackwardConfig = CollectionPaginatorConfig & {
  beforeCursor?: string,
  last?: number,
}

interface CollectionPage<TValue> {
  getValues (): Promise<TValue[]>
  hasNextPage (): Promise<boolean>
  hasPrevPage (): Promise<boolean>
}

abstract class CollectionPaginator<TValue> {
  public abstract getCursorFromValue (value: TValue): string

  public abstract readForward (config: CollectionPaginatorForwardConfig): CollectionPage<TValue>

  public abstract readBackward (config: CollectionPaginatorBackwardConfig): CollectionPage<TValue>
}

export default CollectionPaginator
