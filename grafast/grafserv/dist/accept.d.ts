/**
 * Returns a function that returns the (first, if multiple equal matches) type
 * from mediaTypes that best matches the accept query specified by the given
 * `acceptHeader`. If no Accept header is present then the first mediaType will
 * be returned. If no match is possible, `null` will be returned.
 */
export declare function makeAcceptMatcher(mediaTypes: string[]): (acceptHeader: string | undefined) => string | null;
//# sourceMappingURL=accept.d.ts.map