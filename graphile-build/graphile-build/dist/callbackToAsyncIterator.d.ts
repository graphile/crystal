/**
 * Builds an AsyncIterator from a callback; much safer than an async generator
 * because it will not get frozen waiting for a promise to resolve.
 */
export default function callbackToAsyncIterator<CallbackInput, ReturnVal>(listener: (callback: (value: CallbackInput) => void) => (ReturnVal | null | undefined) | Promise<ReturnVal | null | undefined>, options?: {
    onError?: (err: Error) => void;
    onClose?: (arg: ReturnVal | null | undefined) => void;
    buffering?: boolean;
}): AsyncIterableIterator<CallbackInput>;
//# sourceMappingURL=callbackToAsyncIterator.d.ts.map