import type { Step } from "..";

/**
 * Used internally to prevent steps using other steps' optimize/finalize/etc
 * methods.
 *
 * @internal
 */
export const $$unlock = Symbol("unlock");

function isLocked($step: Step): $step is Step & { [$$unlock](): void } {
  return $step[$$unlock] !== undefined;
}

export function lock($step: Step): void {
  if (!isLocked($step)) {
    const { optimize, finalize, deduplicate, deduplicatedWith } = $step;
    if (optimize) {
      $step.optimize = optimizeLocked;
    }
    if (typeof finalize === "function") {
      $step.finalize = finalizeLocked;
    }
    if (deduplicate) {
      $step.deduplicate = deduplicateLocked;
    }
    if (deduplicatedWith) {
      $step.deduplicatedWith = deduplicatedWithLocked;
    }
    $step[$$unlock] = () => {
      $step[$$unlock] = undefined;
      if (optimize && $step.optimize !== optimizeLocked) {
        console.warn(
          `Warning: ${$step}'s optimize method changed whilst locked`,
        );
      } else {
        $step.optimize = optimize;
      }
      if (typeof finalize === "function" && $step.finalize !== finalizeLocked) {
        console.warn(
          `Warning: ${$step}'s finalize method changed whilst locked`,
        );
      } else {
        $step.finalize = finalize;
      }
      if (deduplicate && $step.deduplicate !== deduplicateLocked) {
        console.warn(
          `Warning: ${$step}'s deduplicate method changed whilst locked`,
        );
      } else {
        $step.deduplicate = deduplicate;
      }
      if (
        deduplicatedWith &&
        $step.deduplicatedWith !== deduplicatedWithLocked
      ) {
        console.warn(
          `Warning: ${$step}'s deduplicatedWith method changed whilst locked`,
        );
      } else {
        $step.deduplicatedWith = deduplicatedWith;
      }
    };
  }
}

export function unlock($step: Step): boolean {
  if (isLocked($step)) {
    $step[$$unlock]();
    return true;
  } else {
    return false;
  }
}

function optimizeLocked(): never {
  throw new Error(
    `Only Grafast may call a step's optimize method; rather than calling optimize on the steps your class depends on, consider opting in to multiple optimization passes via \`allowMultipleOptimizations\`.`,
  );
}

function finalizeLocked(): never {
  throw new Error(
    `Only Grafast may call a step's finalize method; steps should not attempt to interact with other steps during finalize.`,
  );
}

function deduplicateLocked(): never {
  throw new Error(`Only Grafast may call a step's deduplicate method.`);
}
function deduplicatedWithLocked(): never {
  throw new Error(`Only Grafast may call a step's deduplicatedWith method.`);
}
