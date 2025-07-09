"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMaskError = void 0;
exports.defaultMaskError = defaultMaskError;
exports.optionsFromConfig = optionsFromConfig;
const tslib_1 = require("tslib");
const node_crypto_1 = require("node:crypto");
const grafast_1 = require("grafast");
const graphql = tslib_1.__importStar(require("grafast/graphql"));
const { GraphQLError } = graphql;
// Only the non-ambiguous characters
const RANDOM_STRING_LETTERS = "ABCDEFGHJKLMNPQRTUVWXYZ2346789";
const RANDOM_STRING_LETTERS_LENGTH = RANDOM_STRING_LETTERS.length;
const sha1 = (text) => (0, node_crypto_1.createHash)("sha1").update(text).digest("base64url");
const randomString = (length = 10) => {
    let str = "";
    for (let i = 0; i < length; i++) {
        str +=
            RANDOM_STRING_LETTERS[Math.floor(Math.random() * RANDOM_STRING_LETTERS_LENGTH)];
    }
    return str;
};
function defaultMaskError(error) {
    if (!error.originalError && error instanceof GraphQLError) {
        // Things like 'Cannot return null for non-nullable field'
        return error;
    }
    else if (error.originalError instanceof GraphQLError) {
        return error;
    }
    else if (error.originalError != null && (0, grafast_1.isSafeError)(error.originalError)) {
        return new GraphQLError(error.originalError.message, error.nodes, error.source, error.positions, error.path, error.originalError, error.originalError.extensions ?? null);
    }
    else {
        // Hash so similar errors can easily be grouped
        const hash = sha1(String(error));
        const errorId = randomString();
        console.error("Masked GraphQL error (hash: '%s', id: '%s')\n%s\n%O", hash, errorId, error, error.originalError ?? error);
        return new GraphQLError(`An error occurred (logged with hash: '${hash}', id: '${errorId}')`, error.nodes, error.source, error.positions, error.path, error.originalError, 
        // Deliberately wipe the extensions
        {
            errorId,
        });
    }
}
function devMakeMaskError(callback) {
    let warnedAboutMaskErrorCallback = false;
    return (error) => {
        const path = error.path;
        const replacement = callback(error);
        if (!warnedAboutMaskErrorCallback && replacement.path !== path) {
            warnedAboutMaskErrorCallback = true;
            console.warn(`[WARNING] Your maskError callback is changing the error path; please reuse the path of the original error to ensure compliance with the GraphQL specification. We will not issue this warning again until the server is restarted or another maskError function is provided.`);
        }
        return replacement;
    };
}
exports.makeMaskError = grafast_1.isDev
    ? devMakeMaskError
    : (callback) => callback;
function optionsFromConfig(config) {
    const { graphqlPath = "/graphql", graphqlOverGET = false, graphiql = true, graphiqlOnGraphQLGET = true, graphiqlPath = "/", watch = false, eventStreamPath = "/graphql/stream", maxRequestLength = 100_000, outputDataAsString = false, schemaWaitTime = 15000, maskError: rawMaskError, } = config.grafserv ?? {};
    const { explain } = config.grafast ?? {};
    const maskError = rawMaskError
        ? (0, exports.makeMaskError)(rawMaskError)
        : defaultMaskError;
    const maskPayload = (payload) => {
        if (payload.errors !== undefined) {
            payload.errors = payload.errors.map(maskError);
        }
        return payload;
    };
    const maskIterator = (result) => {
        return {
            [Symbol.asyncIterator]() {
                return this;
            },
            async [Symbol.asyncDispose]() {
                await this.return(undefined);
            },
            return(value) {
                return result.return(value);
            },
            throw(e) {
                return result.throw(e);
            },
            async next(...args) {
                const ir = await result.next(...args);
                if (ir.value != null) {
                    return {
                        done: ir.done,
                        value: maskPayload(ir.value),
                    };
                }
                else {
                    return ir;
                }
            },
        };
    };
    const maskExecutionResult = (result) => {
        if ((0, grafast_1.isAsyncIterable)(result)) {
            return maskIterator(result);
        }
        else {
            return maskPayload(result);
        }
    };
    return {
        resolvedPreset: config,
        outputDataAsString,
        graphqlPath,
        graphqlOverGET,
        graphiql,
        graphiqlOnGraphQLGET,
        graphiqlPath,
        watch,
        eventStreamPath,
        maxRequestLength,
        explain,
        schemaWaitTime,
        maskError,
        maskPayload,
        maskIterator,
        maskExecutionResult,
    };
}
//# sourceMappingURL=options.js.map