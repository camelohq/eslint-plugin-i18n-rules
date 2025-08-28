/* eslint-disable no-console */
const { ESLintUtils } = require('@typescript-eslint/utils');
const path = require('path');

// Load the built rule from lib/
const rule = require(path.resolve(__dirname, '../lib/no-hardcoded-jsx-text.js')).default;

const ruleTester = new ESLintUtils.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run('no-hardcoded-jsx-text', rule, {
  valid: [
    { code: 'const C = () => <div>{t("home.title")}</div>;' },
    { code: 'const C = () => <Trans>{t("stats.clicks")} {count}</Trans>;' },
    { code: 'const C = () => <div>{" "}</div>;' },
    { code: 'const C = () => <style>{".foo{color:red}"}</style>;' },
    { code: 'const C = () => <title>Home</title>;' },
    // Punctuation / symbols only -> ignored (no a-zA-Z0-9)
    { code: 'const C = () => <div>— … • ✓</div>;' },
    // Emoji only -> ignored
    { code: 'const C = () => <div>🙂🙂</div>;' },
    // Attribute text is not JSXText -> not reported by this rule
    { code: 'const C = () => <div aria-label="Hello" />;' },
    // Script tag content ignored by rule
    { code: 'const C = () => <script>var a=1;</script>;' },
    // Expression containers: dynamic -> allowed
    { code: 'const C = () => <div>{t("home.title")}</div>;' },
    { code: 'const C = () => <div>{`Hello ${name}`}</div>;' },
    { code: 'const C = () => <title>{"Home"}</title>;' },
    { code: 'const C = () => <div>{"🙂"}</div>;' },
  ],
  invalid: [
    {
      code: 'const C = () => <div>Hello</div>;',
      errors: [{ messageId: 'noHardcoded' }],
    },
    {
      code: 'const C = () => <div>  Hello world!  </div>;',
      errors: [{ messageId: 'noHardcoded' }],
    },
    {
      code: 'const C = () => <div>123</div>;',
      errors: [{ messageId: 'noHardcoded' }],
    },
    {
      code: 'const C = () => <div><span>Nested Text</span></div>;',
      errors: [{ messageId: 'noHardcoded' }],
    },
    {
      code: 'const C = () => <p>Hi — 2024</p>;',
      errors: [{ messageId: 'noHardcoded' }],
    },
    // Expression containers: static strings -> disallow
    {
      code: 'const C = () => <div>{"Hello"}</div>;',
      errors: [{ messageId: 'noHardcoded' }],
    },
    {
      code: 'const C = () => <div>{`Hello`}</div>;',
      errors: [{ messageId: 'noHardcoded' }],
    },
    {
      code: 'const C = () => <div>{"123"}</div>;',
      errors: [{ messageId: 'noHardcoded' }],
    },
    {
      code: 'const C = () => <div><span>{"Nested"}</span></div>;',
      errors: [{ messageId: 'noHardcoded' }],
    },
  ],
});

console.log('Rule tests executed.');
