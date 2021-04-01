import { Aether } from "./aether";
import { Constraint } from "./constraints";

export class Plan {
  constructor(public readonly aether: Aether) {
    /* TODO */
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
