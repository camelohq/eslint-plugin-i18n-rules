# eslint-plugin-i18n-rules

ESLint rules to prevent hardcoded, user-visible strings in React/JSX and encourage proper internationalization.

## Overview

This plugin provides comprehensive ESLint rules to catch hardcoded strings in JSX that should be internationalized. It helps maintain consistent i18n practices by detecting user-visible text in both JSX content and attributes.

## Features

- 🚀 **JSX Text Detection**: Catches hardcoded strings in JSX elements and expression containers
- 🎯 **JSX Attributes Validation**: Detects hardcoded strings in accessibility and user-facing attributes  
- 🧠 **Smart Filtering**: Ignores whitespace, punctuation-only content, and non-user-visible elements
- ⚙️ **Configurable**: Opt-in rules with granular control
- 📝 **TypeScript Support**: Full TypeScript compatibility

## Install

```bash
npm install --save-dev eslint-plugin-i18n-rules
# or
yarn add --dev eslint-plugin-i18n-rules
```

## Usage

### Basic Configuration

Add to your ESLint config:

```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-text": "error",
    "i18n-rules/no-hardcoded-jsx-attributes": "warn"
  }
}
```

### JavaScript/TypeScript Config

```javascript
module.exports = {
  plugins: ['i18n-rules'],
  rules: {
    'i18n-rules/no-hardcoded-jsx-text': 'error',
    'i18n-rules/no-hardcoded-jsx-attributes': 'warn', // Start with warnings
  },
};
```

## Rules

### `no-hardcoded-jsx-text` ✅ Recommended

Prevents hardcoded strings in JSX text content and expression containers.

#### ❌ Invalid

```jsx
<div>Hello World</div>                    // Direct text
<span>{"Welcome back"}</span>             // String literal in expression  
<p>{`Static message`}</p>                 // Template literal (no expressions)
<button>Save</button>                     // Button text
```

#### ✅ Valid

```jsx
<div>{t('hello.world')}</div>             // i18n function
<span>{t('welcome.back')}</span>          // Internationalized
<p>{`Hello ${userName}`}</p>              // Dynamic template literal
<Trans>Welcome {name}</Trans>             // i18n component
<div>{" "}</div>                          // Whitespace (ignored)
<title>Page Title</title>                 // HTML metadata (ignored)
```

### `no-hardcoded-jsx-attributes` 🆕

Detects hardcoded strings in user-visible JSX attributes that should be internationalized.

#### Targeted Attributes

- **Accessibility**: `aria-label`, `aria-description`, `aria-valuetext`, `aria-roledescription`  
- **User-facing**: `title`, `alt`, `placeholder`
- **Dynamic**: All `aria-*` attributes (auto-detected)

#### ❌ Invalid

```jsx
<button aria-label="Save document" />     // Accessibility label
<img alt="User profile picture" />        // Image alt text  
<input placeholder="Enter your name" />   // Form placeholder
<div title="Click to expand" />           // Tooltip text
<div aria-description="Helpful info" />   // ARIA description
```

#### ✅ Valid

```jsx
<button aria-label={t('actions.save')} />           // i18n function
<img alt={t('user.profilePicture')} />              // Internationalized
<input placeholder={t('forms.enterName')} />        // Proper i18n
<div aria-labelledby="heading-id" />                // ID reference (allowed)
<div aria-describedby="description-id" />           // ID reference (allowed)  
<div title="🎉" />                                  // Emoji only (ignored)
```

## Smart Detection

The plugin intelligently filters out content that doesn't need internationalization:

### Ignored Content
- **Whitespace-only**: `<div> </div>`, `<span>{"   "}</span>`
- **Punctuation/Symbols**: `<div>— • ✓</div>`, `<span>{"..."}</span>`  
- **Emojis**: `<div>🎉🚀</div>`, `<button>{"😊"}</button>`
- **HTML Metadata**: `<title>`, `<style>`, `<script>` content
- **ID References**: `aria-labelledby`, `aria-describedby` attributes

### Dynamic Content (Allowed)
- **Template literals with expressions**: `<div>{`Hello ${name}`}</div>`
- **Function calls**: `<span>{formatDate(date)}</span>`
- **Variables**: `<p>{userMessage}</p>`

## Examples

### Before (❌ Hardcoded)

```jsx
function UserProfile({ user }) {
  return (
    <div>
      <h1>User Profile</h1>
      <img 
        src={user.avatar} 
        alt="Profile picture" 
        title="Click to change avatar"
      />
      <button aria-label="Edit profile">
        Edit
      </button>
      <p>Welcome back, {user.name}!</p>
    </div>
  );
}
```

### After (✅ Internationalized)

```jsx
function UserProfile({ user }) {
  return (
    <div>
      <h1>{t('profile.title')}</h1>
      <img 
        src={user.avatar} 
        alt={t('profile.picture')} 
        title={t('profile.changeAvatar')}
      />
      <button aria-label={t('actions.editProfile')}>
        {t('actions.edit')}
      </button>
      <p>{t('welcome.back', { name: user.name })}</p>
    </div>
  );
}
```

## Documentation

- **Rule Details**: [`no-hardcoded-jsx-text`](docs/rules/no-hardcoded-jsx-text.md)
- **Rule Details**: [`no-hardcoded-jsx-attributes`](docs/rules/no-hardcoded-jsx-attributes.md)

## Development

```bash
# Install dependencies
yarn install

# Build the plugin
yarn build

# Run tests
yarn test

# Run linting
yarn lint
```

## Requirements

- **ESLint**: ^8.0.0
- **TypeScript**: ~5.0.4 (for development)
- **Node.js**: >= 14

## Contributing

Contributions are welcome! Please read our contributing guidelines and ensure all tests pass before submitting a pull request.

## License

MIT
