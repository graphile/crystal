import { it } from "mocha";
import { expect } from "chai";

import type { Constraint } from "./../src/constraints";
import { matchesConstraints } from "./../src/constraints";

it("matches array constraints", () => {
  const constraints: Constraint[] = [
    {
      type: "value",
      path: ["a"],
      value: ["last_name"],
    },
  ];

  const variableObject = {
    a: ["last_name"],
  };

  expect(matchesConstraints(constraints, variableObject)).to.be.true;
});
