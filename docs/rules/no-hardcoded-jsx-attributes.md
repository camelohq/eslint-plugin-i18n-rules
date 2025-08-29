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
<script title="Hello" />          // ignored tag
```

## Configuration
```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-attributes": "error"
  }
}
```

**Note:** Numeric-only strings (e.g., `"1"`, `"123"`, `"999"`) are automatically ignored as they typically don't require internationalization.
