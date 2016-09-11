// TODO: Write new `pg` types that actually support `pg` 6.1.0

declare module 'pg' {

import events = require("events")
import stream = require("stream")

export function connect (connection: string, callback?: (err: Error, client: Client, done: (err?: any) => void) => void): Promise<Client>
export function connect (config: ClientConfig, callback?: (err: Error, client: Client, done: (err?: any) => void) => void): Promise<Client>
export function end (): void

export interface ConnectionConfig {
  user?: string
  database?: string
  password?: string
  port?: number
  host?: string
}

export interface Defaults extends ConnectionConfig {
  poolSize?: number
  poolIdleTimeout?: number
  reapIntervalMillis?: number
  binary?: boolean
  parseInt8?: boolean
}

export interface ClientConfig extends ConnectionConfig {
  ssl?: boolean
}

export interface QueryConfig {
  name?: string
  text: string
  values?: any[]
}

export interface QueryResult {
  rows: ({ [key: string]: any })[]
}

export interface ResultBuilder extends QueryResult {
  command: string
  rowCount: number
  oid: number
  addRow (row: any): void
}

export class Client extends events.EventEmitter {
  constructor (connection: string)
  constructor (config: ClientConfig)

  public connect (callback?: (err: Error) => void): void
  public end (): void

  // TODO: This is only on clients acquired by the pool.
  public release (): void

  public query (queryText: string, callback?: (err: Error, result: QueryResult) => void): Query
  public query (config: QueryConfig, callback?: (err: Error, result: QueryResult) => void): Query
  public query (queryText: string, values: any[], callback?: (err: Error, result: QueryResult) => void): Query

  public copyFrom (queryText: string): stream.Writable
  public copyTo (queryText: string): stream.Readable

  public pauseDrain (): void
  public resumeDrain (): void

  public on (event: "drain", listener: () => void): this
  public on (event: "error", listener: (err: Error) => void): this
  public on (event: "notification", listener: (message: any) => void): this
  public on (event: "notice", listener: (message: any) => void): this
  public on (event: string, listener: Function): this
}

export class Query extends events.EventEmitter implements PromiseLike<ResultBuilder> {
  public on (event: "row", listener: (row: any, result?: ResultBuilder) => void): this
  public on (event: "error", listener: (err: Error) => void): this
  public on (event: "end", listener: (result: ResultBuilder) => void): this
  public on (event: string, listener: Function): this
  public then <TResult>(onfulfilled?: (value: QueryResult) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): PromiseLike<TResult>
  public then <TResult>(onfulfilled?: (value: QueryResult) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): PromiseLike<TResult>
}

export class Pool {
  public connect (callback?: (err: Error, client: Client, done: (err?: any) => void) => void): Promise<Client>
  public take (callback?: (err: Error, client: Client, done: (err?: any) => void) => void): Promise<Client>

  public query (queryText: string, callback?: (err: Error, result: QueryResult) => void): Query
  public query (config: QueryConfig, callback?: (err: Error, result: QueryResult) => void): Query
  public query (queryText: string, values: any[], callback?: (err: Error, result: QueryResult) => void): Query

  public end (callback?: () => void): Promise<void>
}

export class Events extends events.EventEmitter {
  public on (event: "error", listener: (err: Error, client: Client) => void): this
  public on (event: string, listener: Function): this
}

}
