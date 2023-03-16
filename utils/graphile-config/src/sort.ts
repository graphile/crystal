export function sortWithBeforeAfterProvides<
  TIdKey extends string,
  TSortable extends {
    before?: string[];
    after?: string[];
    provides?: string[];
  } & {
    [id in TIdKey]: string;
  },
>(rawList: TSortable[], idKey: TIdKey): TSortable[] {
  const list = rawList.map((thing) => {
    const before = [...(thing.before ?? [])];
    const after = [...(thing.after ?? [])];
    const provides = [...(thing.provides ?? [])];

    if (!provides.includes(thing[idKey])) {
      provides.push(thing[idKey]);
    }

    return { thing, before, after, provides };
  });

  // "before" and "after" are very similar, lets simplify them into one
  // concept by converting all the "befores" into "afters" on their targets.
  for (const { thing, before } of list) {
    const { [idKey]: id } = thing;
    if (before.length) {
      const previousBefore = before.splice(0, before.length);
      for (const {
        thing: otherThing,
        provides: otherProvides,
        after: otherAfter,
      } of list) {
        if (
          otherThing !== thing &&
          previousBefore.some((beforeValue) =>
            otherProvides.includes(beforeValue),
          )
        ) {
          otherAfter.push(id);
        }
      }
    }
  }

  // Now lets figure out all the possible provides values:
  const validProvides = new Set<string>();
  for (const { provides } of list) {
    for (const provide of provides) {
      validProvides.add(provide);
    }
  }

  // And ignore any "afters" with no providers:
  for (const { after } of list) {
    after.splice(
      0,
      after.length,
      ...after.filter((afterValue) => validProvides.has(afterValue)),
    );
  }

  const final: TSortable[] = [];
  const remaining = [...list];

  // Now we can iteratively add items following the rule that there must be
  // no pending items that "provides" anything that the listEntry must come
  // "after".
  for (let loops = 0; loops < 10000; loops++) {
    let changes = 0;
    if (remaining.length === 0) {
      // We're done!
      break;
    }

    for (let i = 0; i < remaining.length; i++) {
      const listEntry = remaining[i];
      if (!listEntry) {
        continue;
      }
      const { thing, after } = listEntry;
      const dependsOnRemaining = remaining.some(
        ({ thing: otherThing, provides: otherProvides }) =>
          otherThing !== thing &&
          otherProvides.some((otherHookProvide) =>
            after.includes(otherHookProvide),
          ),
      );
      if (!dependsOnRemaining) {
        changes++;
        remaining.splice(i, 1);
        final.push(thing);
        i--;
      }
    }

    if (changes === 0) {
      throw new Error(
        `Infinite loop in dependencies detected; remaining items:\n  ${remaining
          .map(
            (r) =>
              `${r.thing[idKey]} (after: ${r.after}; provides: ${r.provides})`,
          )
          .join("\n  ")}`,
      );
    }
  }

  if (final.length !== list.length) {
    throw new Error(
      `Expected the same number of list entries after sorting (${final.length} != ${list.length})`,
    );
  }

  return final;
}
