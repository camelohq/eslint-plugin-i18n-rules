# no-hardcoded-jsx-text

Disallow hardcoded, user-visible text in JSX. Use your i18n helper (e.g., `t()` or `<Trans>`).

## Why

Hardcoded strings block localization and consistency. This rule helps surface them early.

## What it checks

- JSX text nodes: `<div>Hello</div>`
- Static strings in expression containers: `<div>{'Hello'}</div>`, `<div>{` + "`Hello`" + `}</div>`
- Ignores: whitespace-only, non-alphanumeric-only (punctuation/emoji), numeric-only strings, and content inside `title`, `style`, `script` tags.

## Examples

### Invalid

```tsx
const C = () => <div>Hello</div>;
const C = () => <div>{"Hello world"}</div>;
const C = () => <p>Hi — 2024</p>;
```

### Valid

```tsx
const C = () => <div>{t("home.title")}</div>;
const C = () => <Trans>Clicks: {count}</Trans>;
const C = () => <div> </div>; // whitespace only
const C = () => <div>🙂🙂</div>; // emoji only
const C = () => <div>123</div>; // numeric only
const C = () => <span>{"999"}</span>; // numeric only
const C = () => <style>{".foo{color:red}"}</style>; // ignored tag
```

## Configuration

### Basic usage

```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-text": "error"
  }
}
```

### With options

```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-text": [
      "error",
      {
        "ignoreLiterals": ["404", "N/A", "SKU-0001"],
        "caseSensitive": false,
        "trim": true
      }
    ]
  }
}
```

### Options

- `ignoreLiterals` (string[], default: `["404", "N/A"]`) - Array of string literals to ignore. These strings will not trigger the rule when found in JSX text.
- `caseSensitive` (boolean, default: `false`) - Whether to use case-sensitive matching when comparing against `ignoreLiterals`.
- `trim` (boolean, default: `true`) - Whether to trim whitespace from strings before comparing against `ignoreLiterals`.

**Note:** Numeric-only strings (e.g., `"1"`, `"123"`, `"999"`) are automatically ignored regardless of configuration options.

### Examples with ignore list

#### Valid (with default options)

```tsx
const ErrorPage = () => <div>404</div>; // ignored by default
const UserProfile = () => <span>N/A</span>; // ignored by default
```

#### Valid (with custom ignore list)

```tsx
// With configuration: { "ignoreLiterals": ["SKU-123", "v1.0"] }
const Product = () => <div>SKU-123</div>; // ignored
const Version = () => <span>v1.0</span>; // ignored
```
