import {
  wrapSchemaPlaceholder,
  isSchemaPlaceholder,
  buildSchemaRemapTransform,
  extractTemplateSchemaNames,
} from "../src/multiTenancy.ts";

// ---------------------------------------------------------------------------
// wrapSchemaPlaceholder
// ---------------------------------------------------------------------------
describe("wrapSchemaPlaceholder", () => {
  it("wraps a simple schema name", () => {
    expect(wrapSchemaPlaceholder("app_public")).toBe("__pgmt_app_public__");
  });

  it("wraps a schema name with special characters", () => {
    expect(wrapSchemaPlaceholder('my"schema')).toBe('__pgmt_my"schema__');
  });
});

// ---------------------------------------------------------------------------
// isSchemaPlaceholder
// ---------------------------------------------------------------------------
describe("isSchemaPlaceholder", () => {
  it("returns true for a valid placeholder", () => {
    expect(isSchemaPlaceholder("__pgmt_app_public__")).toBe(true);
  });

  it("returns false for a non-placeholder", () => {
    expect(isSchemaPlaceholder("app_public")).toBe(false);
  });

  it("returns false for partial prefix match", () => {
    expect(isSchemaPlaceholder("__pgmt_app_public")).toBe(false);
  });

  it("returns false for partial suffix match", () => {
    expect(isSchemaPlaceholder("app_public__")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// extractTemplateSchemaNames
// ---------------------------------------------------------------------------
describe("extractTemplateSchemaNames", () => {
  it("extracts schema names from placeholders", () => {
    expect(
      extractTemplateSchemaNames([
        "__pgmt_app_public__",
        "__pgmt_app_private__",
      ]),
    ).toEqual(["app_public", "app_private"]);
  });

  it("passes through non-placeholder names", () => {
    expect(
      extractTemplateSchemaNames(["__pgmt_app_public__", "plain_schema"]),
    ).toEqual(["app_public", "plain_schema"]);
  });

  it("handles empty array", () => {
    expect(extractTemplateSchemaNames([])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// buildSchemaRemapTransform
// ---------------------------------------------------------------------------
describe("buildSchemaRemapTransform", () => {
  it("returns identity for empty schema map", () => {
    const transform = buildSchemaRemapTransform({});
    const sql = 'SELECT * FROM "app_public"."users"';
    expect(transform(sql)).toBe(sql);
  });

  it("replaces a single placeholder", () => {
    const transform = buildSchemaRemapTransform({
      app_public: "tenant_42_public",
    });
    const input = 'SELECT * FROM "__pgmt_app_public__"."users"';
    const expected = 'SELECT * FROM "tenant_42_public"."users"';
    expect(transform(input)).toBe(expected);
  });

  it("replaces multiple placeholders in a single pass", () => {
    const transform = buildSchemaRemapTransform({
      app_public: "t2_public",
      app_private: "t2_private",
    });
    const input =
      'SELECT * FROM "__pgmt_app_public__"."users" JOIN "__pgmt_app_private__"."secrets" ON true';
    const expected =
      'SELECT * FROM "t2_public"."users" JOIN "t2_private"."secrets" ON true';
    expect(transform(input)).toBe(expected);
  });

  it("replaces all occurrences of the same placeholder", () => {
    const transform = buildSchemaRemapTransform({
      app_public: "tenant_1",
    });
    const input =
      'SELECT * FROM "__pgmt_app_public__"."a" WHERE "__pgmt_app_public__"."a"."id" = 1';
    const expected =
      'SELECT * FROM "tenant_1"."a" WHERE "tenant_1"."a"."id" = 1';
    expect(transform(input)).toBe(expected);
  });

  it("handles schema names with special characters safely", () => {
    const transform = buildSchemaRemapTransform({
      app_public: 'tenant "special"',
    });
    const input = 'SELECT * FROM "__pgmt_app_public__"."users"';
    // escapeSqlIdentifier doubles internal quotes
    const expected = 'SELECT * FROM "tenant ""special"""."users"';
    expect(transform(input)).toBe(expected);
  });

  it("does not modify non-placeholder text", () => {
    const transform = buildSchemaRemapTransform({
      app_public: "tenant_1",
    });
    const input = "SELECT 'hello world' AS greeting";
    expect(transform(input)).toBe(input);
  });

  // Performance: verify single-pass regex handles large SQL efficiently
  it("performs well on large SQL strings", () => {
    const transform = buildSchemaRemapTransform({
      app_public: "t_pub",
      app_private: "t_priv",
      app_hidden: "t_hid",
    });

    // Build a large SQL string with many placeholder references
    const fragments: string[] = [];
    for (let i = 0; i < 1000; i++) {
      fragments.push(
        `SELECT * FROM "__pgmt_app_public__"."table_${i}" JOIN "__pgmt_app_private__"."ref_${i}" ON true`,
      );
    }
    const largeSql = fragments.join(" UNION ALL ");

    const start = performance.now();
    const result = transform(largeSql);
    const elapsed = performance.now() - start;

    // Verify correctness
    expect(result).toContain('"t_pub"."table_0"');
    expect(result).toContain('"t_priv"."ref_999"');
    expect(result).not.toContain("__pgmt_");

    // Should complete in well under 100ms for 1000 unions
    expect(elapsed).toBeLessThan(100);
  });
});
