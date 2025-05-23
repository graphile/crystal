import { get, Step } from "../../dist/index.js";

export function delegate(
  $primary: Step,
  delegatedAttributes: string[],
  $secondary: Step,
) {
  return new DelegateStep($primary, delegatedAttributes, $secondary);
}

class DelegateStep extends Step {
  // Don't export
  static $$export = null;
  constructor(
    $primary: Step,
    private delegatedAttributes: string[],
    $secondary: Step,
  ) {
    super();
    this.addDataDependency($primary);
    this.addDataDependency($secondary);
  }
  get(attr: string) {
    if (this.delegatedAttributes.includes(attr)) {
      return get(this.getDep(1), attr);
    } else {
      return get(this.getDep(0), attr);
    }
  }
  optimize() {
    return this.getDep(0);
  }
}
