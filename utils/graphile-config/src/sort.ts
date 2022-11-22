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
  const list = rawList.map((listEntry) => {
    if (!listEntry.after) {
      listEntry.after = [];
    }
    if (!listEntry.provides) {
      listEntry.provides = [];
    }
    if (!listEntry.provides.includes(listEntry[idKey])) {
      listEntry.provides.push(listEntry[idKey]);
    }
    return listEntry as TSortable & {
      after: string[];
      provides: string[];
    };
  });

  // "before" and "after" are very similar, lets simplify them into one
  // concept by converting all the "befores" into "afters" on their targets.
  for (const listEntry of list) {
    const { [idKey]: id, before = [] } = listEntry;
    if (before.length) {
      const previousBefore = before.splice(0, before.length);
      for (const otherListEntry of list) {
        if (
          otherListEntry !== listEntry &&
          previousBefore.some((beforeValue) =>
            otherListEntry.provides.includes(beforeValue),
          )
        ) {
          if (!otherListEntry.after) {
            otherListEntry.after = [id];
          } else {
            otherListEntry.after.push(id);
          }
        }
      }
    }
  }

  // Now lets figure out all the possible provides values:
  const providers: {
    [key: string]: typeof list;
  } = Object.create(null);
  for (const listEntry of list) {
    const { provides } = listEntry;
    for (const provide of provides) {
      if (!providers[provide]) {
        providers[provide] = [];
      }
      providers[provide]!.push(listEntry);
    }
  }

  // And ignore any "afters" with no providers:
  const validProviders = Object.keys(providers);
  for (const listEntry of list) {
    listEntry.after = listEntry.after.filter((afterValue) =>
      validProviders.includes(afterValue),
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
      const dependsOnRemaining = remaining.some(
        (otherListEntry) =>
          otherListEntry !== listEntry &&
          otherListEntry.provides.some((otherHookProvide) =>
            listEntry.after.includes(otherHookProvide),
          ),
      );
      if (!dependsOnRemaining) {
        changes++;
        remaining.splice(i, 1);
        final.push(listEntry);
        i--;
      }
    }

    if (changes === 0) {
      throw new Error(
        `Infinite loop in dependencies detected; remaining items:\n  ${remaining
          .map(
            (r) => `${r[idKey]} (after: ${r.after}; provides: ${r.provides})`,
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
