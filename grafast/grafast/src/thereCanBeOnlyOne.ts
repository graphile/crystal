const $$grafast = Symbol.for("grafast");

const globalAny = globalThis as any;
if (globalAny[$$grafast] === true) {
  // Already warned
} else if (globalAny[$$grafast]) {
  globalAny[$$grafast] = true;
  console.trace(
    `WARNING: more than one version of the 'grafast' module has been instantiated - you must ensure there is exactly one grafast (e.g. using yarn "resolutions" or similar techniques). Try clearing your package lockfile and reinstalling. ${globalAny[$$grafast]}`,
  );
} else {
  try {
    // Capture the stack trace
    throw new Error(`The first 'grafast' was installed here`);
  } catch (e) {
    globalAny[$$grafast] = e;
  }
}
