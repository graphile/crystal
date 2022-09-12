interface POJOList extends Array<POJOValue> {}
interface POJORecord {
  [key: string]: POJOValue;
}
type POJOValue =
  | undefined
  | null
  | boolean
  | number
  | string
  | POJOList
  | POJORecord;

/**
 * Clones a POJO. Equivalent to `JSON.parse(JSON.stringify(value))`, but
 * hopefully faster for small objects?
 *
 * TODO: benchmark.
 */
function deepClone<TValue extends POJOValue>(value: TValue): TValue {
  const type = typeof value;
  if (
    value == null ||
    type === "boolean" ||
    type === "string" ||
    type === "number"
  ) {
    return value;
  } else if (Array.isArray(value)) {
    return value.map(deepClone) as TValue;
  } else if (type === "object" /* already asserted value isn't null-ish */) {
    const replacement: Partial<TValue> = {};
    for (const key in value) {
      const keyValue = value[key];
      // @ts-ignore s'all good.
      replacement[key] = deepClone(keyValue);
    }
    return replacement as TValue;
  } else {
    throw new Error(
      `The plan object contains disallowed values; expected boolean | string | number | array | object; received ${inspect(
        value,
      )}`,
    );
  }
}

/**
 * Deep freezes a POJO. Expensive, only do during development.
 */
function deepFreeze<TValue extends POJOValue>(value: TValue): void {
  const type = typeof value;
  if (
    value == null ||
    type === "boolean" ||
    type === "string" ||
    type === "number"
  ) {
    /* noop */
  } else if (Array.isArray(value)) {
    Object.freeze(value);
    value.map(deepFreeze);
  } else if (type === "object" /* already asserted value isn't null-ish */) {
    Object.freeze(value);
    for (const key in value) {
      const keyValue = value[key];
      deepFreeze((keyValue as unknown) as POJOValue);
    }
  } else {
    throw new Error(
      `The plan object contains disallowed values; expected boolean | string | number | array | object; received ${inspect(
        value,
      )}`,
    );
  }
}

/*+--------------------------------------------------------------------------+
  |                           BASE OPERATIONS                                |
  +--------------------------------------------------------------------------+*/

class Operation {}

/**
 * The root operation is the plan for the root of a query, mutation or
 * subscription operation. It's a NOOP.
 */
class RootOperation extends Operation {}

/**
 * (Global) registry for operations (interface to allow declaration merging).
 *
 * `{ [key: string]: Operation<key> }`
 */
interface Operations {
  RootOperation: typeof RootOperation;
}

/**
 * (Global) registry for operation data definitions (interface to allow declaration merging).
 *
 * `{ [key in keyof Operations]: { ...data definition here... } }`
 */
interface OperationData {
  RootOperation: {};
}

/**
 * (Global) registry for operations (the actual implementations).
 */
export const operations: Partial<Operations> = {
  RootOperation,
};

/*+--------------------------------------------------------------------------+
  |                          CUSTOM OPERATIONS                               |
  +--------------------------------------------------------------------------+*/

class PgClassSelectOperation extends Operation {}
interface Operations {
  PgClassSelectOperation: PgClassSelectOperation;
}
interface OperationData {
  PgClassSelectOperation: {
    /* TODO */
  };
}
operations.PgClassSelectOperation = PgClassSelectOperation;

// TODO:
// assertIsOperations(operations); // Turn `Partial<Operations>` to `Operations`
