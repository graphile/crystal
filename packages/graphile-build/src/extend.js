// @flow
import chalk from "chalk";

const INDENT = "  ";
const $$hints = Symbol("hints");

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
  const hints = base[$$hints] || {};

  const keysB = Object.keys(extra);
  const extraHints = extra[$$hints] || {};
  for (const key of keysB) {
    const newValue = extra[key];
    const hintB = extraHints[key] || hint;
    if (key in base && base[key] !== newValue) {
      const hintA: ?string = hints[key];
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
    if (hintB) {
      hints[key] = hintB;
    }
  }
  return Object.assign(base, extra, {
    // $FlowFixMe: symbols
    [$$hints]: hints,
  });
}
