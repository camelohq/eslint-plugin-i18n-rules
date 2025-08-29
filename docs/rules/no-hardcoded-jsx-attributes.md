# no-hardcoded-jsx-attributes

Disallow hardcoded, user-visible strings in JSX attributes. Prefer `t()` or equivalent.

## Why
User-facing attribute text (e.g., `aria-label`, `title`, `alt`) must be localizable and consistent.

## What it checks
- Attributes: `aria-label`, `aria-description`, `aria-valuetext`, `aria-roledescription`, `title`, `alt`, `placeholder`, and other `aria-*` (excludes idrefs).
- Static values: `attr="Hello"`, `attr={'Hello'}`, `attr={` + "`Hello`" + `}`.
- Ignores: `aria-labelledby`, `aria-describedby` (ID refs), tags `title`, `style`, `script`, punctuation/emoji-only strings, and numeric-only strings.

## Examples
### Invalid
```tsx
<button aria-label="Save" />
<img alt={"User avatar"} />
<input placeholder={`Search`} />
```

### Valid
```tsx
<button aria-label={t('actions.save')} />
<div aria-labelledby="heading-id" />
<div title="— —" />              // punctuation only
<div aria-label="123" />         // numeric only
<img alt={'999'} />              // numeric only
<div title="404" />              // ignored by default
<span aria-label="N/A" />       // ignored by default
<script title="Hello" />          // ignored tag
```

## Configuration

### Basic usage
```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-attributes": "error"
  }
}
```

### With options
```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-attributes": ["error", {
      "ignoreLiterals": ["404", "N/A", "SKU-0001"],
      "caseSensitive": false,
      "trim": true
    }]
  }
}
```

### Options

- `ignoreLiterals` (string[], default: `["404", "N/A"]`) - Array of string literals to ignore. These strings will not trigger the rule when found in JSX attributes.
- `caseSensitive` (boolean, default: `false`) - Whether to use case-sensitive matching when comparing against `ignoreLiterals`.
- `trim` (boolean, default: `true`) - Whether to trim whitespace from strings before comparing against `ignoreLiterals`.

**Note:** Numeric-only strings (e.g., `"1"`, `"123"`, `"999"`) are automatically ignored regardless of configuration options.

### Examples with ignore list

#### Valid (with default options)
```tsx
const ErrorPage = () => <div aria-label="404" />;     // ignored by default
const UserProfile = () => <img alt="N/A" />;         // ignored by default
```

#### Valid (with custom ignore list)
```tsx
// With configuration: { "ignoreLiterals": ["SKU-123", "v1.0"] }
const Product = () => <div title="SKU-123" />;       // ignored
const Version = () => <span aria-label="v1.0" />;   // ignored
```
