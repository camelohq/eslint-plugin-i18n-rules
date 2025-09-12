/* eslint-disable no-console */
const { ESLintUtils } = require("@typescript-eslint/utils");
const path = require("path");

// Load the built rule from lib/
const rule = require(
  path.resolve(__dirname, "../lib/no-hardcoded-jsx-attributes.js"),
).default;

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
console.log("Running no-hardcoded-jsx-attributes basic functionality tests...");

ruleTester.run("no-hardcoded-jsx-attributes", rule, {
  valid: [
    // Valid i18n usage
    { code: 'const C = () => <button aria-label={t("actions.save")} />;' },

    // Attributes not targeted
    { code: 'const C = () => <a href="/home" />;' },
    { code: 'const C = () => <div id="foo" className="bar" />;' },

    // ARIA idrefs allowed (no longer checked since PR scope refinement)
    { code: 'const C = () => <div aria-labelledby="heading-id" />;' },
    { code: 'const C = () => <div aria-describedby={"desc-id"} />;' },

    // Punctuation / emoji only
    { code: 'const C = () => <div title="— —" />;' },
    { code: 'const C = () => <div alt={"🙂"} />;' },

    // Numeric only -> ignored
    { code: 'const C = () => <div aria-label="123" />;' },
    { code: 'const C = () => <img alt={"999"} />;' },
    { code: "const C = () => <input placeholder={`42`} />;" },
    { code: 'const C = () => <div title="1" />;' },

    // Ignored tags
    { code: 'const C = () => <script title="Hello" />;' },

    // Default ignore list
    { code: 'const C = () => <div aria-label="404" />;' },
    { code: 'const C = () => <img alt="N/A" />;' },
    { code: 'const C = () => <div title={"404"} />;' },
    { code: "const C = () => <span aria-label={`N/A`} />;" },

    // aria-hidden is not in TARGET_ATTRS allowlist anymore
    { code: 'const C = () => <span aria-hidden="true" />;' },
    { code: 'const C = () => <span aria-hidden="false" />;' },
  ],
  invalid: [
    {
      code: 'const C = () => <button type="button" aria-label="Save" />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },
    {
      code: 'const C = () => <button type="button" aria-label={"Save"} />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },
    {
      code: 'const C = () => <img alt="User avatar" />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },
    {
      code: 'const C = () => <input placeholder={"Search"} />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },
    {
      code: "const C = () => <div title={`Hello`} />;",
      errors: [{ messageId: "noHardcodedAttr" }],
    },
    {
      code: 'const C = () => <div aria-description="Helpful text" />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },
    {
      code: 'const C = () => <div aria-roledescription={"Button-like"} />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },
  ],
});

// =============================================================================
// Option tests: ignoreLiterals
// =============================================================================
console.log("Running no-hardcoded-jsx-attributes ignoreLiterals tests...");

ruleTester.run("no-hardcoded-jsx-attributes with custom ignore list", rule, {
  valid: [
    {
      code: 'const C = () => <div aria-label="SKU-123" />;',
      options: [{ ignoreLiterals: ["SKU-123", "v1.0"] }],
    },
    {
      code: 'const C = () => <img alt={"v1.0"} />;',
      options: [{ ignoreLiterals: ["SKU-123", "v1.0"] }],
    },
  ],
  invalid: [
    {
      code: 'const C = () => <div aria-label="Hello" />;',
      options: [{ ignoreLiterals: ["SKU-123", "v1.0"] }],
      errors: [{ messageId: "noHardcodedAttr" }],
    },
  ],
});

// =============================================================================
// Option tests: caseSensitive
// =============================================================================
console.log("Running no-hardcoded-jsx-attributes caseSensitive tests...");

ruleTester.run("no-hardcoded-jsx-attributes case sensitivity", rule, {
  valid: [
    {
      code: 'const C = () => <div aria-label="hello" />;',
      options: [{ ignoreLiterals: ["HELLO"], caseSensitive: false }],
    },
  ],
  invalid: [
    {
      code: 'const C = () => <div aria-label="hello" />;',
      options: [{ ignoreLiterals: ["HELLO"], caseSensitive: true }],
      errors: [{ messageId: "noHardcodedAttr" }],
    },
  ],
});

// =============================================================================
// Option tests: trim
// =============================================================================
console.log("Running no-hardcoded-jsx-attributes trim tests...");

ruleTester.run("no-hardcoded-jsx-attributes trim option", rule, {
  valid: [
    {
      code: 'const C = () => <div aria-label="  hello  " />;',
      options: [{ ignoreLiterals: ["hello"], trim: true }],
    },
  ],
  invalid: [
    {
      code: 'const C = () => <div aria-label="  hello  " />;',
      options: [{ ignoreLiterals: ["hello"], trim: false }],
      errors: [{ messageId: "noHardcodedAttr" }],
    },
  ],
});

// =============================================================================
// Option tests: ignoreComponentsWithTitle
// =============================================================================
console.log(
  "Running no-hardcoded-jsx-attributes ignoreComponentsWithTitle tests...",
);

ruleTester.run("no-hardcoded-jsx-attributes ignoreComponentsWithTitle", rule, {
  valid: [
    // Default ignored components (Layout, SEO) with title props
    { code: 'const C = () => <Layout title="Page Title" />;' },
    { code: 'const C = () => <SEO title={"Page Title"} />;' },
    { code: "const C = () => <Layout title={`Page Title`} />;" },

    // Custom ignored components
    {
      code: 'const C = () => <PageWrapper title="Page Title" />;',
      options: [{ ignoreComponentsWithTitle: ["PageWrapper", "Container"] }],
    },
    {
      code: 'const C = () => <Container title={"Title"} />;',
      options: [{ ignoreComponentsWithTitle: ["PageWrapper", "Container"] }],
    },
  ],
  invalid: [
    // Other components with title should still be reported
    {
      code: 'const C = () => <Button title="Click Me" />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },
    {
      code: 'const C = () => <div title={"Tooltip text"} />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },

    // Non-title attributes on ignored components should still be reported
    {
      code: 'const C = () => <Layout aria-label="Navigation" />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },
    {
      code: 'const C = () => <SEO alt={"Description"} />;',
      errors: [{ messageId: "noHardcodedAttr" }],
    },

    // Components not in ignore list should be reported even with title
    {
      code: 'const C = () => <Button title="Click Me" />;',
      options: [{ ignoreComponentsWithTitle: ["Layout"] }],
      errors: [{ messageId: "noHardcodedAttr" }],
    },
  ],
});

console.log("✓ no-hardcoded-jsx-attributes tests completed successfully.");
