export let inspect: (obj: any, options?: { colors: boolean }) => string;

try {
  inspect = require("util").inspect;
} catch {
  inspect = (obj) => {
    return String(obj);
  };
}
