/** Maximum observed query counts for each schema fixture. */
const maximumPasses: Record<string, number> = {
  "a,b,c": 4,
  b: 5,
  c: 8,
  cjk: 4,
  d: 4,
  enum_tables: 4,
  geometry: 5,
  index_expressions: 4,
  inheritence: 4,
  issue_2334: 4,
  js_reserved: 4,
  nested_arrays: 4,
  network_types: 4,
  no_fields: 4,
  partitions: 4,
  pg11: 7,
  polymorphic: 4,
  refs: 4,
  scifi: 4,
  simple_collections: 4,
  smart_comment_relations: 4,
};

export function assertIntrospectionPasses(
  schemas: string[],
  passes: number | undefined,
  options: { ignoreRBAC?: boolean; ignoreIndexes?: boolean } = {},
): void {
  const key = schemas.join(",");
  let maximum = maximumPasses[key];
  if (key === "a,b,c" && options.ignoreRBAC === false) {
    maximum = 5;
  } else if (key === "a,b,c" && options.ignoreIndexes === false) {
    maximum = 4;
  }
  expect(maximum).toBeDefined();
  expect(passes).toBeGreaterThan(0);
  expect(passes).toBeLessThanOrEqual(maximum);
}
