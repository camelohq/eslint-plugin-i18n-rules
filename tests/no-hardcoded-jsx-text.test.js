/* eslint-disable no-console */
const { ESLintUtils } = require("@typescript-eslint/utils");
const path = require("path");

// Load the built rule from bundled lib/
const plugin = require(path.resolve(__dirname, "../lib/index.js"));
const rule = plugin.rules["no-hardcoded-jsx-text"];

const ruleTester = new ESLintUtils.RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
});

// =============================================================================
// Basic functionality tests
// =============================================================================
console.log("Running no-hardcoded-jsx-text basic functionality tests...");

ruleTester.run("no-hardcoded-jsx-text", rule, {
  valid: [
    // Valid i18n usage
    { code: 'const C = () => <div>{t("home.title")}</div>;' },
    { code: 'const C = () => <Trans>{t("stats.clicks")} {count}</Trans>;' },

    // Whitespace only
    { code: 'const C = () => <div>{" "}</div>;' },

    // Special tags (ignored)
    { code: 'const C = () => <style>{".foo{color:red}"}</style>;' },
    { code: "const C = () => <title>Home</title>;" },
    { code: "const C = () => <script>var a=1;</script>;" },

    // Punctuation / symbols only -> ignored (no a-zA-Z0-9)
    { code: "const C = () => <div>— … • ✓</div>;" },

    // Emoji only -> ignored
    { code: "const C = () => <div>🙂🙂</div>;" },

    // Numeric only -> ignored
    { code: "const C = () => <div>123</div>;" },
    { code: "const C = () => <div>1</div>;" },
    { code: "const C = () => <div>999</div>;" },

    // Attribute text is not JSXText -> not reported by this rule
    { code: 'const C = () => <div aria-label="Hello" />;' },

    // Expression containers: dynamic -> allowed
    { code: 'const C = () => <div>{t("home.title")}</div>;' },
    { code: "const C = () => <div>{`Hello ${name}`}</div>;" },
    { code: 'const C = () => <title>{"Home"}</title>;' },
    { code: 'const C = () => <div>{"🙂"}</div>;' },

    // Numeric only in expression containers -> ignored
    { code: 'const C = () => <div>{"123"}</div>;' },
    { code: "const C = () => <div>{`999`}</div>;" },

    // HTTP/HTTPS URLs -> ignored
    { code: "const C = () => <div>https://example.com</div>;" },
    { code: "const C = () => <div>http://localhost:3000</div>;" },
    { code: 'const C = () => <div>{"https://api.example.com"}</div>;' },
    { code: "const C = () => <div>{`http://localhost:8080/api`}</div>;" },
    // Trans component content should be ignored
    {
      code: 'const C = () => <Trans i18nKey="key">Hardcoded text inside Trans</Trans>;',
    },
    {
      code: "const C = () => <Trans>Your request to join <span>company</span> has been approved</Trans>;",
    },
    {
      code: 'const C = () => <Trans i18nKey="nested"><div>Nested content <span>should be ignored</span></div></Trans>;',
    },
    { code: 'const C = () => <Trans>{"Static string in expression"}</Trans>;' },
    { code: "const C = () => <Trans>{`Template literal content`}</Trans>;" },
  ],
  invalid: [
    {
      code: "const C = () => <div>Hello</div>;",
      errors: [{ messageId: "noHardcoded" }],
    },
    {
      code: "const C = () => <div>  Hello world!  </div>;",
      errors: [{ messageId: "noHardcoded" }],
    },
    {
      code: "const C = () => <div><span>Nested Text</span></div>;",
      errors: [{ messageId: "noHardcoded" }],
    },
    {
      code: "const C = () => <p>Hi — 2024</p>;",
      errors: [{ messageId: "noHardcoded" }],
    },

    // Expression containers: static strings -> disallow
    {
      code: 'const C = () => <div>{"Hello"}</div>;',
      errors: [{ messageId: "noHardcoded" }],
    },
    {
      code: "const C = () => <div>{`Hello`}</div>;",
      errors: [{ messageId: "noHardcoded" }],
    },
    {
      code: 'const C = () => <div><span>{"Nested"}</span></div>;',
      errors: [{ messageId: "noHardcoded" }],
    },
  ],
});

// =============================================================================
// Option tests: ignoreLiterals
// =============================================================================
console.log("Running no-hardcoded-jsx-text ignoreLiterals tests...");

ruleTester.run("no-hardcoded-jsx-text with custom ignore list", rule, {
  valid: [
    {
      // default ignoreLiterals: [404,N/A]
      code: "const C = () => <div>N/A</div>;",
      options: [{ ignoreLiterals: ["SKU-123", "v1.0"] }],
    },
    {
      code: "const C = () => <div>SKU-123</div>;",
      options: [{ ignoreLiterals: ["SKU-123", "v1.0"] }],
    },
    {
      code: 'const C = () => <p>{"v1.0"}</p>;',
      options: [{ ignoreLiterals: ["SKU-123", "v1.0"] }],
    },
  ],
  invalid: [
    {
      code: "const C = () => <div>Hello</div>;",
      options: [{ ignoreLiterals: ["SKU-123", "v1.0"] }],
      errors: [{ messageId: "noHardcoded" }],
    },
  ],
});

// =============================================================================
// Option tests: caseSensitive
// =============================================================================
console.log("Running no-hardcoded-jsx-text caseSensitive tests...");

ruleTester.run("no-hardcoded-jsx-text case sensitivity", rule, {
  valid: [
    {
      code: "const C = () => <div>hello</div>;",
      options: [{ ignoreLiterals: ["HELLO"], caseSensitive: false }],
    },
  ],
  invalid: [
    {
      code: "const C = () => <div>hello</div>;",
      options: [{ ignoreLiterals: ["HELLO"], caseSensitive: true }],
      errors: [{ messageId: "noHardcoded" }],
    },
  ],
});

// =============================================================================
// Option tests: trim
// =============================================================================
console.log("Running no-hardcoded-jsx-text trim tests...");

ruleTester.run("no-hardcoded-jsx-text trim option", rule, {
  valid: [
    {
      code: "const C = () => <div>  hello  </div>;",
      options: [{ ignoreLiterals: ["hello"], trim: true }],
    },
  ],
  invalid: [
    {
      code: "const C = () => <div>  hello  </div>;",
      options: [{ ignoreLiterals: ["hello"], trim: false }],
      errors: [{ messageId: "noHardcoded" }],
    },
  ],
});

// =============================================================================
// Enhanced Detection Rules Tests
// =============================================================================
console.log("Running no-hardcoded-jsx-text enhanced detection tests...");

// Test conditional text detection
ruleTester.run("no-hardcoded-jsx-text conditional text detection", rule, {
  valid: [
    // Conditional expressions with t() usage
    { code: 'const C = () => <div>{isError ? t("error.message") : t("success.message")}</div>;' },
    { code: 'const C = () => <div>{loading ? null : t("content.loaded")}</div>;' },
    // Non-text conditionals
    { code: 'const C = () => <div>{count > 0 ? count : 0}</div>;' },
    // Ignored literals in conditionals
    { code: 'const C = () => <div>{showNA ? "N/A" : "404"}</div>;' },
  ],
  invalid: [
    {
      code: 'const C = () => <div>{isError ? "Something went wrong" : "Success"}</div>;',
      errors: [
        { messageId: "noHardcodedConditional" },
        { messageId: "noHardcodedConditional" },
      ],
    },
    {
      code: 'const C = () => <div>{loading ? "Loading..." : data}</div>;',
      errors: [{ messageId: "noHardcodedConditional" }],
    },
    {
      code: 'const C = () => <div>{status === "error" ? `Error occurred` : "All good"}</div>;',
      errors: [
        { messageId: "noHardcodedConditional" },
        { messageId: "noHardcodedConditional" },
      ],
    },
  ],
});

// Test partially hardcoded template literals (explicitly enabled)
ruleTester.run("no-hardcoded-jsx-text partially hardcoded templates", rule, {
  valid: [
    // Pure dynamic templates (no hardcoded parts)
    {
      code: 'const C = () => <div>{`${greeting} ${name}`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
    },
    {
      code: 'const C = () => <div>{`${count}`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
    },
    // Templates with only punctuation between variables
    {
      code: 'const C = () => <div>{`${value1}${value2}`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
    },
    // Using t() for templates
    {
      code: 'const C = () => <div>{t("greeting", { name })}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
    },
  ],
  invalid: [
    {
      code: 'const C = () => <div>{`Hello ${name}!`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
      errors: [{ messageId: "partiallyHardcodedTemplate" }],
    },
    {
      code: 'const C = () => <div>{`Welcome to ${siteName} - enjoy your stay`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
      errors: [{ messageId: "partiallyHardcodedTemplate" }],
    },
    {
      code: 'const C = () => <div>{`Error: ${message}`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
      errors: [{ messageId: "partiallyHardcodedTemplate" }],
    },
    {
      code: 'const C = () => <div>{`User ${user.name} has ${count} items`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
      errors: [{ messageId: "partiallyHardcodedTemplate" }],
    },
  ],
});

// Test detection configuration options
ruleTester.run("no-hardcoded-jsx-text detection configuration", rule, {
  valid: [
    // Disable conditional text detection
    {
      code: 'const C = () => <div>{isError ? "Error" : "Success"}</div>;',
      options: [{ detections: { conditionalText: false } }],
    },
    // Disable partially hardcoded templates
    {
      code: 'const C = () => <div>{`Hello ${name}!`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: false } }],
    },
    // Disable template literals entirely
    {
      code: 'const C = () => <div>{`Static text`}</div>;',
      options: [{ detections: { templateLiterals: false } }],
    },
    // Disable JSX text detection
    {
      code: 'const C = () => <div>Hardcoded text</div>;',
      options: [{ detections: { jsxText: false } }],
    },
    // Disable expression containers
    {
      code: 'const C = () => <div>{"Static string"}</div>;',
      options: [{ detections: { expressionContainers: false } }],
    },
  ],
  invalid: [
    // These should still trigger with default settings (conditionalText enabled by default)
    {
      code: 'const C = () => <div>{isError ? "Error" : "Success"}</div>;',
      errors: [{ messageId: "noHardcodedConditional" }, { messageId: "noHardcodedConditional" }],
    },
    // This should trigger when partially hardcoded templates are explicitly enabled
    {
      code: 'const C = () => <div>{`Hello ${name}!`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
      errors: [{ messageId: "partiallyHardcodedTemplate" }],
    },
  ],
});

// Test mixed detection scenarios
ruleTester.run("no-hardcoded-jsx-text mixed scenarios", rule, {
  valid: [
    // Complex valid patterns
    { code: 'const C = () => <div>{data ? t("data.loaded", data) : t("data.empty")}</div>;' },
    { code: 'const C = () => <div>{t("greeting", { name: user?.name || t("common.anonymous") })}</div>;' },
  ],
  invalid: [
    // Complex invalid patterns (with enhanced detection enabled)
    {
      code: 'const C = () => <div>{user ? `Welcome ${user.name}` : "Please log in"}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
      errors: [
        { messageId: "noHardcodedConditional" },
        { messageId: "partiallyHardcodedTemplate" },
      ],
    },
    {
      code: 'const C = () => <div>{loading ? "Loading data..." : `Found ${count} results`}</div>;',
      options: [{ detections: { partiallyHardcodedTemplates: true } }],
      errors: [
        { messageId: "noHardcodedConditional" },
        { messageId: "partiallyHardcodedTemplate" },
      ],
    },
  ],
});

console.log("✓ no-hardcoded-jsx-text enhanced detection tests completed successfully.");
console.log("✓ no-hardcoded-jsx-text tests completed successfully.");
