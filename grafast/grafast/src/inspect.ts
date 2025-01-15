export let inspect: (
  obj: any,
  options?: {
    colors?: boolean;
    depth?: number;
    compact?: boolean | number;
    breakLength?: number;
  },
) => string;

try {
  inspect = require("util").inspect;
  if (typeof inspect !== "function") {
    throw new Error("Failed to load inspect");
  }
} catch {
  inspect = (obj) => {
    return Array.isArray(obj) ||
      !obj ||
      Object.getPrototypeOf(obj) === null ||
      Object.getPrototypeOf(obj) === Object.prototype
      ? JSON.stringify(obj)
      : String(obj);
  };
}
