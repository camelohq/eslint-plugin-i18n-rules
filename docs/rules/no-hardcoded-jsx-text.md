# no-hardcoded-jsx-text

Disallow hardcoded, user-visible text in JSX. Use your i18n helper (e.g., `t()` or `<Trans>`).

## Why
Hardcoded strings block localization and consistency. This rule helps surface them early.

## What it checks
- JSX text nodes: `<div>Hello</div>`
- Static strings in expression containers: `<div>{'Hello'}</div>`, `<div>{` + "`Hello`" + `}</div>`
- Ignores: whitespace-only, non-alphanumeric-only (punctuation/emoji), and content inside `title`, `style`, `script` tags.

## Examples
### Invalid
```tsx
const C = () => <div>Hello</div>;
const C = () => <div>{'Hello world'}</div>;
const C = () => <p>Hi — 2024</p>;
```

### Valid
```tsx
const C = () => <div>{t('home.title')}</div>;
const C = () => <Trans>Clicks: {count}</Trans>;
const C = () => <div>{' '}</div>;       // whitespace only
const C = () => <div>🙂🙂</div>;          // emoji only
const C = () => <style>{'.foo{color:red}'}</style>; // ignored tag
```

## Configuration
```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-text": "error"
  }
}
```
