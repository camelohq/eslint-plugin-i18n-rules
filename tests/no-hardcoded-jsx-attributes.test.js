/* eslint-disable no-console */
const { ESLintUtils } = require('@typescript-eslint/utils');
const path = require('path');

// Load the built rule from lib/
const rule = require(path.resolve(__dirname, '../lib/no-hardcoded-jsx-attributes.js')).default;

const ruleTester = new ESLintUtils.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run('no-hardcoded-jsx-attributes', rule, {
  valid: [
    // dynamic i18n usage
    { code: 'const C = () => <button aria-label={t("actions.save")} />;' },
    // attributes not targeted
    { code: 'const C = () => <a href="/home" />;' },
    { code: 'const C = () => <div id="foo" className="bar" />;' },
    // aria idrefs allowed
    { code: 'const C = () => <div aria-labelledby="heading-id" />;' },
    { code: 'const C = () => <div aria-describedby={"desc-id"} />;' },
    // punctuation / emoji only
    { code: 'const C = () => <div title="— —" />;' },
    { code: 'const C = () => <div alt={"🙂"} />;' },
    // numeric only -> ignored
    { code: 'const C = () => <div aria-label="123" />;' },
    { code: 'const C = () => <img alt={"999"} />;' },
    { code: 'const C = () => <input placeholder={`42`} />;' },
    { code: 'const C = () => <div title="1" />;' },
    // ignored tags
    { code: 'const C = () => <script title="Hello" />;' },
  ],
  invalid: [
    { code: 'const C = () => <button type="button" aria-label="Save" />;', errors: [{ messageId: 'noHardcodedAttr' }] },
    { code: 'const C = () => <button type="button" aria-label={"Save"} />;', errors: [{ messageId: 'noHardcodedAttr' }] },
    { code: 'const C = () => <img alt="User avatar" />;', errors: [{ messageId: 'noHardcodedAttr' }] },
    { code: 'const C = () => <input placeholder={"Search"} />;', errors: [{ messageId: 'noHardcodedAttr' }] },
    { code: 'const C = () => <div title={`Hello`} />;', errors: [{ messageId: 'noHardcodedAttr' }] },
    { code: 'const C = () => <div aria-description="Helpful text" />;', errors: [{ messageId: 'noHardcodedAttr' }] },
    { code: 'const C = () => <div aria-roledescription={"Button-like"} />;', errors: [{ messageId: 'noHardcodedAttr' }] },
  ],
});

console.log('Attribute rule tests executed successfully.');

