import EventEmitter from "eventemitter3";
import { GraphQLSchema, isSchema, validateSchema } from "graphql";
import { resolvePresets } from "graphile-config";
import { isPromiseLike, PromiseOrDirect, TypedEventEmitter } from "grafast";
import {
  GrafservConfig,
  RequestDigest,
  SendResult,
  SendError,
  HandlerResult,
} from "../interfaces";
import { OptionsFromConfig, optionsFromConfig } from "../options";
import { makeGraphQLHandler } from "../middleware/graphql";
import { makeGraphiQLHandler } from "../middleware/graphiql";

export class GrafservBase {
  private releaseHandlers: Array<() => PromiseOrDirect<void>> = [];
  private releasing = false;
  protected dynamicOptions!: OptionsFromConfig;
  protected resolvedPreset!: GraphileConfig.ResolvedPreset;
  protected schema: GraphQLSchema | PromiseLike<GraphQLSchema> | null;
  protected schemaError: PromiseLike<GraphQLSchema> | null;
  protected eventEmitter: TypedEventEmitter<{
    "schema:ready": GraphQLSchema;
    "schema:error": any;
  }>;
  private initialized = false;

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
    this.initialized = true;
    this.refreshHandlers();
  }

  private _processRequest(
    request: RequestDigest,
  ): PromiseOrDirect<HandlerResult | null> {
    const dynamicOptions = this.dynamicOptions;
    try {
      if (
        request.path === dynamicOptions.graphqlPath &&
        request.method === "POST"
      ) {
        return this.graphqlHandler(request).catch((e) => {
          // Special error handling for GraphQL route
          console.error(
            "An error occurred whilst attempting to handle the GraphQL request:",
          );
          console.dir(e);
          return {
            type: "graphql",
            payload: { errors: [e] },
            statusCode: 500,
          } as HandlerResult;
        });
      }

      // FIXME: handle 'HEAD' requests

      if (
        dynamicOptions.graphiql &&
        request.method === "GET" &&
        (request.path === dynamicOptions.graphiqlPath ||
          (dynamicOptions.graphiqlOnGraphQLGET &&
            request.path === dynamicOptions.graphqlPath))
      ) {
        return this.graphiqlHandler(request);
      }

      /*
      if (
        dynamicOptions.watch &&
        request.path === dynamicOptions.eventStreamRoute &&
        request.method === "GET"
      ) {
        (async () => {
          const stream = makeStream();
          sendResult(res, {
            type: "event-stream",
            payload: stream,
            statusCode: 200,
          });
        })().catch(handleError);
        return;
      }
      */

      // Unhandled
      return null;
    } catch (e) {
      console.error("Unexpected error occurred in _processRequest", e);
      return {
        type: "html",
        status: 500,
        payload: Buffer.from("ERROR", "utf8"),
      } as HandlerResult;
    }
  }

  protected processRequest(details: {
    request: RequestDigest;
    sendResult: SendResult;
    sendError: SendError;
  }) {
    const { request, sendResult, sendError } = details;
    try {
      const result = this._processRequest(request);
      if (isPromiseLike(result)) {
        result.then(sendResult, sendError);
      } else {
        sendResult(result);
      }
    } catch (e) {
      sendError(e);
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
    const newOptions = optionsFromConfig(this.resolvedPreset);
    if (this.dynamicOptions !== newOptions) {
      this.dynamicOptions = newOptions;
      this.refreshHandlers();
    }
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
    if (this.schema !== newSchema) {
      this.schemaError = null;
      this.schema = newSchema;
      this.eventEmitter.emit("schema:ready", newSchema);
      this.refreshHandlers();
    }
  }

  private graphqlHandler!: ReturnType<typeof makeGraphQLHandler>;
  private graphiqlHandler!: ReturnType<typeof makeGraphiQLHandler>;
  private refreshHandlers() {
    if (!this.initialized) {
      return;
    }
    // TODO: this.graphqlHandler?.release()?
    this.graphqlHandler = makeGraphQLHandler(
      this.resolvedPreset,
      this.dynamicOptions,
      this.schema,
    );
    this.graphiqlHandler = makeGraphiQLHandler();
  }
}
