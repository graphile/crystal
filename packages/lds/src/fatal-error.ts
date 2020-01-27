export default class FatalError extends Error {
  public fatal = true;
  public originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.originalError = originalError;
  }
}
