import { Aether } from "./aether";
import { Constraint } from "./constraints";
import { isDev, noop } from "./dev";

function reallyAssertFinalized(plan: Plan): void {
  if (!plan.isFinalized) {
    throw new Error(
      "Plan is not finalized; did you forget to call super.finalize()?",
    );
  }
}

// Optimise this away in production.
export const assertFinalized = !isDev ? noop : reallyAssertFinalized;

export class Plan {
  readonly dependencies: Plan[] = [];
  readonly children: Plan[] = [];
  public isFinalized = false;
  constructor(public readonly aether: Aether) {
    /* TODO */
  }

  finalize(): void {
    this.isFinalized = true;
  }
}

export class TrackedObjectPlan extends Plan {
  constructor(
    public readonly aether: Aether,
    private readonly value: unknown,
    private readonly constraints: Constraint[],
  ) {
    super(aether);
    /* TODO */
  }
}
