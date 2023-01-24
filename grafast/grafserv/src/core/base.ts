import EventEmitter from "eventemitter3";
import { GraphQLSchema, isSchema, validateSchema } from "graphql";
import { resolvePresets } from "graphile-config";
import { isPromiseLike, PromiseOrDirect, TypedEventEmitter } from "grafast";
import { GrafservConfig } from "../interfaces";

export class GrafservBase {
  private releaseHandlers: Array<() => PromiseOrDirect<void>> = [];
  private releasing = false;
  protected resolvedPreset!: GraphileConfig.ResolvedPreset;
  protected schema: GraphQLSchema | PromiseLike<GraphQLSchema> | null;
  protected schemaError: PromiseLike<GraphQLSchema> | null;
  protected eventEmitter: TypedEventEmitter<{
    "schema:ready": GraphQLSchema;
    "schema:error": any;
  }>;

  constructor(config: GrafservConfig) {
    this.eventEmitter = new EventEmitter();
    this.setPreset(config.preset ?? Object.create(null));
    this.schemaError = null;
    this.schema = config.schema;
    if (isPromiseLike(config.schema)) {
      const promise = config.schema;
      promise.then(
        (schema) => {
          this.setSchema(schema);
        },
        (error) => {
          this.schemaError = promise;
          this.schema = null;
          this.eventEmitter.emit("schema:error", error);
        },
      );
    } else {
      this.eventEmitter.emit("schema:ready", config.schema);
    }
  }

  public getPreset(): GraphileConfig.ResolvedPreset {
    return this.resolvedPreset;
  }

  public getSchema(): PromiseOrDirect<GraphQLSchema> {
    return this.schema ?? this.schemaError!;
  }

  public async release() {
    if (this.releasing) {
      throw new Error("Release has already been called");
    }
    this.releasing = true;
    for (let i = this.releaseHandlers.length - 1; i >= 0; i--) {
      const handler = this.releaseHandlers[i];
      try {
        await handler();
      } catch (e) {
        /* nom nom nom */
      }
    }
  }

  public onRelease(cb: () => PromiseOrDirect<void>) {
    if (this.releasing) {
      throw new Error(
        "Release has already been called; cannot add more onRelease callbacks",
      );
    }
    this.releaseHandlers.push(cb);
  }

  public setPreset(newPreset: GraphileConfig.Preset) {
    this.resolvedPreset = resolvePresets([newPreset]);
  }

  public setSchema(newSchema: GraphQLSchema) {
    if (!newSchema) {
      throw new Error(`setSchema must be called with a GraphQL schema`);
    }
    if (!isSchema(newSchema)) {
      throw new Error(
        `setParams called with invalid schema (is there more than one 'graphql' module loaded?)`,
      );
    }
    const errors = validateSchema(newSchema);
    if (errors.length > 0) {
      throw new Error(
        `setParams called with invalid schema; first error: ${errors[0]}`,
      );
    }
    this.schemaError = null;
    this.schema = newSchema;
    this.eventEmitter.emit("schema:ready", newSchema);
  }
}
