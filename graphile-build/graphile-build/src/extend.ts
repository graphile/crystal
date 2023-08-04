import chalk from "chalk";

const INDENT = "  ";
const $$hints = Symbol("hints");

/**
 * Indents every line in the given text by two spaces (and trims spaces from
 * spaces-only lines).
 */
export function indent(text: string) {
  return (
    INDENT + text.replace(/\n/g, "\n" + INDENT).replace(/\n +(?=\n|$)/g, "\n")
  );
}

/**
 * Merges the properties from `extra` into `base` tracking the `hint` as to
 * when they were added. If a conflict is found (where `base` already has a key
 * in `extra`) an error will be thrown describing what happened.
 */
export default function extend<
  Obj1 extends Record<string | number | symbol, any>,
  Obj2 extends Record<string | number | symbol, any>,
>(base: Obj1, extra: Obj2, hint: string): Obj1 & Obj2 {
  const hints = base[$$hints] || {};

  const keysB = Object.keys(extra);
  const extraHints = extra[$$hints] || {};
  for (const key of keysB) {
    const newValue = extra[key];
    const hintB = extraHints[key] || hint;
    if (key in base && base[key] !== newValue) {
      const hintA: string | null | undefined = hints[key];
      const firstEntityDetails = !hintA
        ? "We don't have any information about the first entity."
        : `The first entity was:\n\n${indent(chalk.magenta(hintA))}`;
      const secondEntityDetails = !hintB
        ? "We don't have any information about the second entity."
        : `The second entity was:\n\n${indent(chalk.yellow(hintB))}`;
      throw new Error(
        `A naming conflict has occurred - two entities have tried to define the same key '${chalk.bold(
          key,
        )}'.\n\n${indent(firstEntityDetails)}\n\n${indent(
          secondEntityDetails,
        )}.\n  Details: ${chalk.blue.bold.underline`https://err.red/pnc`}`,
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
