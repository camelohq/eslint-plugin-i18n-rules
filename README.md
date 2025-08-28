# eslint-plugin-i18n-rules

ESLint rules to prevent hardcoded, user-visible strings in React/JSX and encourage proper i18n.

## Install
```bash
npm i -D eslint-plugin-i18n-rules
# or
yarn add -D eslint-plugin-i18n-rules
```

## Usage
Add to your ESLint config:
```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-text": "error",
    "i18n-rules/no-hardcoded-jsx-attributes": "off" // opt-in
  }
}
```

## Rules & Docs
- no-hardcoded-jsx-text: docs/rules/no-hardcoded-jsx-text.md
- no-hardcoded-jsx-attributes (opt-in): docs/rules/no-hardcoded-jsx-attributes.md
