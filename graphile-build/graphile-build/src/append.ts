import chalk from "chalk";
import { isDev } from "grafast";

import { indent } from "./extend.ts";
export const $$arrayHints = Symbol("hints");
export type WithArrayHints<T> = T & { [$$arrayHints]?: string[] };

/**
 * Appends the entries from `extra` into `base` tracking the `hint` as to when
 * they were added. If a conflict is found (where `base` already has an entry
 * with the same `identity(item)` as a new item) an error will be thrown
 * describing what happened.
 */
export default function append<
  T,
  ID extends string | number | symbol = string | number | symbol,
>(
  base: WithArrayHints<T[]>,
  extra: WithArrayHints<ReadonlyArray<T>>,
  getIdentity: keyof T | ((entry: T) => ID),
  hint: string,
): T[] {
  if (isDev && !(Array.isArray(base) && Array.isArray(extra))) {
    throw new Error(`Both arguments must be arrays`);
  }
  const identify =
    typeof getIdentity === "function"
      ? getIdentity
      : (entry: T) => entry[getIdentity] as ID;

  base[$$arrayHints] ??= [];
  const hints = base[$$arrayHints];

  const existingIdentities = base.map(identify);

  const extraHints = extra[$$arrayHints];
  for (
    let extraIndex = 0, extraL = extra.length;
    extraIndex < extraL;
    extraIndex++
  ) {
    const hintB = extraHints?.[extraIndex] || hint;
    const entry = extra[extraIndex];
    const identity = identify(entry);
    const existingIndex = existingIdentities.indexOf(identity);
    if (existingIndex >= 0) {
      if (base[existingIndex] === entry) {
        // Ignore duplicates
      } else {
        // Throw error
        const hintA: string | null | undefined = hints[existingIndex];
        const firstEntityDetails = !hintA
          ? "We don't have any information about the first entity."
          : `The first entity was:\n\n${indent(chalk.magenta(hintA))}`;
        const secondEntityDetails = !hintB
          ? "We don't have any information about the second entity."
          : `The second entity was:\n\n${indent(chalk.yellow(hintB))}`;
        throw new Error(
          `A list conflict has occurred - two different entities with the same identifier '${chalk.bold(
            identity,
          )}' were added.\n\n${indent(firstEntityDetails)}\n\n${indent(
            secondEntityDetails,
          )}.\n  Details: ${chalk.blue.bold.underline`https://err.red/pnc`}`,
        );
      }
    } else {
      const idx = base.push(entry) - 1;
      hints[idx] = hintB;
    }
  }
  return base;
}
