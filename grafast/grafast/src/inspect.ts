export let inspect: {
  (
    obj: any,
    options?: {
      colors?: boolean;
      depth?: number;
      compact?: boolean | number;
      breakLength?: number;
    },
  ): string;
  custom: symbol;
};

try {
  inspect = require("util").inspect;
  if (typeof inspect !== "function") {
    throw new Error("Failed to load inspect");
  }
} catch {
  inspect = Object.assign(
    (obj: any) => {
      return Array.isArray(obj) ||
        !obj ||
        Object.getPrototypeOf(obj) === null ||
        Object.getPrototypeOf(obj) === Object.prototype
        ? String(JSON.stringify(obj))
        : String(obj);
    },
    { custom: Symbol.for("nodejs.util.inspect.custom") },
  );
}
