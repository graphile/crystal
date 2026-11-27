/** Maximum observed query counts for each schema fixture. */
const maximumPasses: Record<string, number> = {
  "a,b,c": 3,
  b: 5,
  c: 8,
  cjk: 3,
  d: 3,
  enum_tables: 3,
  geometry: 4,
  index_expressions: 3,
  inheritence: 3,
  issue_2212: 8,
  issue_2334: 3,
  js_reserved: 3,
  nested_arrays: 3,
  network_types: 3,
  no_fields: 3,
  partitions: 3,
  pg11: 7,
  polymorphic: 3,
  refs: 3,
  scifi: 3,
  simple_collections: 3,
  smart_comment_relations: 3,
};

export function assertIntrospectionPasses(
  schemas: string[],
  passes: number | undefined,
  options: { ignoreRBAC?: boolean; ignoreIndexes?: boolean } = {},
): void {
  const key = schemas.join(",");
  let maximum = maximumPasses[key];
  if (key === "a,b,c" && options.ignoreRBAC === false) {
    maximum = 4;
  }
  expect(maximum).toBeDefined();
  expect(passes).toBeGreaterThan(1);
  expect(passes).toBeLessThanOrEqual(maximum);
}
