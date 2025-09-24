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

console.log("✓ no-hardcoded-jsx-text tests completed successfully.");
