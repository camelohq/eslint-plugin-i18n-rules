# no-hardcoded-jsx-attributes

Disallow hardcoded, user-visible strings in JSX attributes. Prefer `t()` or equivalent.

## Why

User-facing attribute text (e.g., `aria-label`, `title`, `alt`) must be localizable and consistent.

## What it checks

- Attributes: `aria-label`, `aria-description`, `aria-valuetext`, `aria-roledescription`, `title`, `alt`, `placeholder`.
- Static values: `attr="Hello"`, `attr={'Hello'}`, `attr={` + "`Hello`" + `}`.
- Ignores: tags `title`, `style`, `script`, punctuation/emoji-only strings, and numeric-only strings.

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
    "i18n-rules/no-hardcoded-jsx-attributes": "warn"
  }
}
```

### With options

```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-attributes": [
      "warn",
      {
        "ignoreLiterals": ["404", "N/A", "SKU-0001"],
        "caseSensitive": false,
        "trim": true,
        "ignoreComponentsWithTitle": ["Layout", "SEO"]
      }
    ]
  }
}
```

### Options

- `ignoreLiterals` (string[], default: `["404", "N/A"]`) - Array of string literals to ignore. These strings will not trigger the rule when found in JSX attributes. **Custom values are merged with defaults**, so `"404"` and `"N/A"` are always ignored even when you provide custom values.
- `caseSensitive` (boolean, default: `false`) - Whether to use case-sensitive matching when comparing against `ignoreLiterals`.
- `trim` (boolean, default: `true`) - Whether to trim whitespace from strings before comparing against `ignoreLiterals`.
- `ignoreComponentsWithTitle` (string[], default: `["Layout", "SEO"]`) - Array of component names where hardcoded `title` props are allowed. Only applies to the `title` attribute specifically. **Custom values are merged with defaults**, so `"Layout"` and `"SEO"` are always allowed even when you provide custom components.

**Note:** Numeric-only strings (e.g., `"1"`, `"123"`, `"999"`) are automatically ignored regardless of configuration options.

### Examples with ignore list

#### Valid (with default options)

```tsx
const ErrorPage = () => <div aria-label="404" />; // ignored by default
const UserProfile = () => <img alt="N/A" />; // ignored by default
```

#### Valid (with custom ignore list)

```tsx
// With configuration: { "ignoreLiterals": ["SKU-123", "v1.0"] }
const Product = () => <div title="SKU-123" />; // ignored (custom)
const Version = () => <span aria-label="v1.0" />; // ignored (custom)
const ErrorPage = () => <div aria-label="404" />; // ignored (default, still preserved)
const UserProfile = () => <img alt="N/A" />; // ignored (default, still preserved)
```

### Examples with component title exceptions

#### Valid (with default ignoreComponentsWithTitle)

```tsx
// Layout and SEO components allow hardcoded title props by default
const HomePage = () => <Layout title="Welcome to Our Site" />;
const BlogPost = () => <SEO title={"Post Title"} />;
const Dashboard = () => <Layout title={`User Dashboard`} />;
```

#### Invalid (other components still trigger the rule)

```tsx
// Other components with title props still trigger the rule
const Tooltip = () => <Button title="Click me" />; // ❌ triggers rule
const Card = () => <div title="Card description" />; // ❌ triggers rule

// Non-title attributes on ignored components also trigger the rule
const Page = () => <Layout aria-label="Main navigation" />; // ❌ triggers rule
const Meta = () => <SEO alt="Logo" />; // ❌ triggers rule
```

#### Custom component configuration

```tsx
// With configuration: { "ignoreComponentsWithTitle": ["PageWrapper", "Container"] }
const CustomPage = () => <PageWrapper title="Custom Page" />; // ✅ allowed (custom)
const Section = () => <Container title="Section Title" />; // ✅ allowed (custom)
const HomePage = () => <Layout title="Welcome" />; // ✅ allowed (default, still preserved)
const BlogPost = () => <SEO title="Post Title" />; // ✅ allowed (default, still preserved)
```
