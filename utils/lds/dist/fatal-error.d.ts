export default class FatalError extends Error {
    fatal: boolean;
    originalError?: Error;
    constructor(message: string, originalError?: Error);
}
//# sourceMappingURL=fatal-error.d.ts.map