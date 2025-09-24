# no-hardcoded-jsx-text

Disallow hardcoded, user-visible text in JSX. Use your i18n helper (e.g., `t()` or `<Trans>`).

## Why

Hardcoded strings block localization and consistency. This rule helps surface them early.

## What it checks

- JSX text nodes: `<div>Hello</div>`
- Static strings in expression containers: `<div>{'Hello'}</div>`, `<div>{` + "`Hello`" + `}</div>`
- Ignores: whitespace-only, non-alphanumeric-only (punctuation/emoji), numeric-only strings, content inside `title`, `style`, `script` tags, and **content inside `<Trans>` components**.

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
// Trans component content is ignored
const C = () => <Trans i18nKey="welcome">Welcome to our app</Trans>;
const C = () => (
  <Trans>
    Your request to join <span>company</span> has been approved
  </Trans>
);
```

## Enhanced Detection Rules

This rule now includes advanced detection capabilities that can catch more complex patterns of hardcoded text:

### 🔍 **Conditional Text Detection** (enabled by default)
Detects hardcoded strings in ternary expressions:
```tsx
// ❌ Triggers rule
{isError ? "Something went wrong" : "Success"}

// ✅ Preferred
{isError ? t("error.message") : t("success.message")}
```

### 🔍 **Partially Hardcoded Templates** (opt-in)
Detects template literals that mix hardcoded text with dynamic content:
```tsx
// ❌ Triggers rule (when enabled)
{`Hello ${name}!`}
{`User ${user.name} has ${count} items`}

// ✅ Preferred
{t("greeting", { name })}
{t("user.itemCount", { userName: user.name, count })}
```

### 🔍 **Granular Detection Control**
Fine-tune which patterns to detect with the `detections` option.

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

- `ignoreLiterals` (string[], default: `["404", "N/A"]`) - Array of string literals to ignore. These strings will not trigger the rule when found in JSX text. **Custom values are merged with defaults**, so `"404"` and `"N/A"` are always ignored even when you provide custom values.
- `caseSensitive` (boolean, default: `false`) - Whether to use case-sensitive matching when comparing against `ignoreLiterals`.
- `trim` (boolean, default: `true`) - Whether to trim whitespace from strings before comparing against `ignoreLiterals`.
- `detections` (object) - Fine-grained control over detection patterns:
  - `jsxText` (boolean, default: `true`) - Detect hardcoded text in JSX text nodes
  - `expressionContainers` (boolean, default: `true`) - Detect hardcoded strings in JSX expression containers
  - `templateLiterals` (boolean, default: `true`) - Detect hardcoded static template literals
  - `conditionalText` (boolean, default: `true`) - Detect hardcoded text in ternary expressions
  - `partiallyHardcodedTemplates` (boolean, default: `false`) - Detect template literals with hardcoded parts

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
const Product = () => <div>SKU-123</div>; // ignored (custom)
const Version = () => <span>v1.0</span>; // ignored (custom)
const ErrorPage = () => <div>404</div>; // ignored (default, still preserved)
const UserProfile = () => <span>N/A</span>; // ignored (default, still preserved)
```

### Enhanced Detection Examples

#### Conditional Text Detection (enabled by default)

```tsx
// ❌ Invalid
const Status = () => <div>{loading ? "Loading..." : "Done"}</div>;

// ✅ Valid
const Status = () => <div>{loading ? t("loading") : t("done")}</div>;
```

#### Partially Hardcoded Templates (opt-in)

```json
{
  "rules": {
    "i18n-rules/no-hardcoded-jsx-text": [
      "error",
      {
        "detections": {
          "partiallyHardcodedTemplates": true
        }
      }
    ]
  }
}
```

```tsx
// ❌ Invalid (when enabled)
const Greeting = () => <div>{`Hello ${name}!`}</div>;
const Status = () => <div>{`Found ${count} results`}</div>;

// ✅ Valid
const Greeting = () => <div>{t("greeting", { name })}</div>;
const Status = () => <div>{t("search.results", { count })}</div>;
```

#### Selective Detection Control

```json
{
  "rules": {
    "i18n-rules/no-hardcoded-jsx-text": [
      "error",
      {
        "detections": {
          "conditionalText": false,
          "partiallyHardcodedTemplates": true
        }
      }
    ]
  }
}
```
