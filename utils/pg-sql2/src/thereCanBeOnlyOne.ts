const $$pgSql2 = Symbol.for("pgSql2");

const globalAny = globalThis as any;
if (globalAny[$$pgSql2] === true) {
  // Already warned
} else if (globalAny[$$pgSql2]) {
  globalAny[$$pgSql2] = true;
  throw new Error(
    `WARNING: more than one version of the 'pg-sql2' module has been instantiated - you must ensure there is exactly one pg-sql2 (e.g. using yarn "resolutions" or similar techniques). Try clearing your package lockfile and reinstalling.`,
    { cause: globalAny[$$pgSql2] },
  );
} else {
  try {
    // Capture the stack trace
    throw new Error(`The first 'pg-sql2' was installed here`);
  } catch (e) {
    globalAny[$$pgSql2] = e;
  }
}
