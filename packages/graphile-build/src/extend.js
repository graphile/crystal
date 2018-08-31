// @flow
import chalk from "chalk";

const aExtendedB = new WeakMap();
const INDENT = "  ";

export function indent(text: string) {
  return (
    INDENT + text.replace(/\n/g, "\n" + INDENT).replace(/\n +(?=\n|$)/g, "\n")
  );
}

export default function extend<Obj1: *, Obj2: *>(
  base: Obj1,
  extra: Obj2,
  hint?: string
): Obj1 & Obj2 {
  const keysA = Object.keys(base);
  const keysB = Object.keys(extra);
  const hints = Object.create(null);
  for (const key of keysA) {
    const hintKey = `_source__${key}`;
    if (base[hintKey]) {
      hints[hintKey] = base[hintKey];
    }
  }

  for (const key of keysB) {
    const newValue = extra[key];
    const oldValue = base[key];
    const hintKey = `_source__${key}`;
    const hintB = extra[hintKey] || hint;
    if (aExtendedB.get(newValue) !== oldValue && keysA.indexOf(key) >= 0) {
      // $FlowFixMe
      const hintA: ?string = base[hintKey];
      const firstEntityDetails = !hintA
        ? "We don't have any information about the first entity."
        : `The first entity was:\n\n${indent(chalk.magenta(hintA))}`;
      const secondEntityDetails = !hintB
        ? "We don't have any information about the second entity."
        : `The second entity was:\n\n${indent(chalk.yellow(hintB))}`;
      throw new Error(
        `A naming conflict has occurred - two entities have tried to define the same key '${chalk.bold(
          key
        )}'.\n\n${indent(firstEntityDetails)}\n\n${indent(secondEntityDetails)}`
      );
    }
    hints[hintKey] = hints[hintKey] || hintB || base[hintKey];
  }
  const obj = Object.assign({}, base, extra);
  aExtendedB.set(obj, base);
  for (const hintKey in hints) {
    if (hints[hintKey]) {
      Object.defineProperty(obj, hintKey, {
        configurable: false,
        enumerable: false,
        value: hints[hintKey],
        writable: false,
      });
    }
  }
  return obj;
}
