import { PgLtreePlugin } from "../dist/plugins/PgLtreePlugin.js";

const hook = PgLtreePlugin.schema?.hooks?.init;
if (typeof hook !== "function") {
  throw new Error("PgLtreePlugin init hook is not defined");
}

function makeBuild(alreadySet: ReadonlyArray<"input" | "output">) {
  const codec = { name: "ltree" };
  return {
    pgCodecs: { ltree: codec },
    inflection: { builtin: (name: string) => name },
    wrapDescription: (description: string) => description,
    hasGraphQLTypeForPgCodec: jest.fn(
      (_codec: unknown, situation: "input" | "output") =>
        alreadySet.includes(situation),
    ),
    registerScalarType: jest.fn(),
    setGraphQLTypeForPgCodec: jest.fn(),
  };
}

const runInit = (build: ReturnType<typeof makeBuild>) => {
  const init = {};
  expect(hook(init as never, build as never, {} as never)).toBe(init);
};

test("registers the LTree scalar for input and output by default", () => {
  const build = makeBuild([]);
  runInit(build);
  expect(build.registerScalarType).toHaveBeenCalledTimes(1);
  expect(build.setGraphQLTypeForPgCodec.mock.calls).toEqual([
    [build.pgCodecs.ltree, "output", "LTree"],
    [build.pgCodecs.ltree, "input", "LTree"],
  ]);
});

test("leaves the codec alone when an earlier plugin set both types", () => {
  const build = makeBuild(["input", "output"]);
  runInit(build);
  expect(build.registerScalarType).not.toHaveBeenCalled();
  expect(build.setGraphQLTypeForPgCodec).not.toHaveBeenCalled();
});

test("only fills in the situation an earlier plugin left unset", () => {
  const build = makeBuild(["output"]);
  runInit(build);
  expect(build.registerScalarType).toHaveBeenCalledTimes(1);
  expect(build.setGraphQLTypeForPgCodec.mock.calls).toEqual([
    [build.pgCodecs.ltree, "input", "LTree"],
  ]);
});
