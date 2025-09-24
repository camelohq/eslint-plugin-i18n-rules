# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ESLint plugin that provides internationalization (i18n) linting rules for React/JSX applications. The plugin includes two comprehensive rules that detect hardcoded string literals and encourage proper i18n practices using solutions like `t()` functions or `<Trans>` components.

## Commands

### Build

```bash
npm run build
# or
yarn build
```

Bundles TypeScript source files from `src/` to a single optimized `lib/index.js` file using tsup (esbuild-powered bundler).

### Build (Development)

```bash
npm run build:dev
# or
yarn build:dev
```

Compiles TypeScript source files to separate files using tsc (useful for debugging).

### Test

```bash
npm run test
# or
yarn test
```

Runs the custom test suite (builds first, then executes tests).

### Lint

```bash
npm run lint
# or
yarn lint
```

Runs ESLint on all TypeScript files in the project.

### Format

```bash
npm run format
# or
yarn format
```

Formats code using Prettier.

## Architecture

The plugin follows ESLint's standard plugin structure:

- **Entry point**: `src/index.ts` - Exports the plugin configuration with available rules and recommended config
- **Rules**: Individual rule implementations in `src/` directory
  - `no-hardcoded-jsx-text.ts` - Main rule for JSX content (recommended)
  - `no-hardcoded-jsx-attributes.ts` - Attribute rule (opt-in)
- **Build output**: `lib/` directory contains a single bundled CommonJS module (`index.js` + `index.d.ts`)
- **Package**: Publishes only the `lib/` directory as specified in `package.json`
- **Tests**: Custom test runner in `tests/` directory with comprehensive test cases
- **Documentation**: Rule docs in `docs/rules/` directory

### Rule Implementation Pattern

Rules are implemented using `@typescript-eslint/utils.RuleCreator` and follow this structure:

- Type definitions for options and message IDs
- Meta configuration with rule type, description, and error messages
- AST visitor functions that analyze specific node types (e.g., `JSXText`, `JSXAttribute`)
- Conditional logic to ignore certain cases (whitespace, specific HTML tags, Trans components, etc.)
- Configurable options for ignore lists, case sensitivity, and component exceptions

### Available Rules

#### `no-hardcoded-jsx-text` (Recommended - Error)

- **Status**: Enabled as "error" in recommended config
- **Targets**: JSX text nodes and expression containers
- **Ignores**: Whitespace-only content, punctuation, non-alphanumeric strings, numeric-only strings
- **Excludes**: HTML metadata tags (`title`, `style`, `script`)
- **Special handling**: Skips content inside `<Trans>` components
- **Supported patterns**: String literals, template literals, and expression containers
- **Configuration**: `ignoreLiterals`, `caseSensitive`, `trim` options

#### `no-hardcoded-jsx-attributes` (Recommended - Warning)

- **Status**: Enabled as "warn" in recommended config with default options
- **Targets**: Explicit allowlist of user-visible attributes:
  - Accessibility: `aria-label`, `aria-description`, `aria-valuetext`, `aria-roledescription`
  - User-facing: `title`, `alt`, `placeholder`
- **Ignores**: ID reference attributes (`aria-labelledby`, `aria-describedby`)
- **Special handling**: Configurable component exceptions for `title` attribute (Layout, SEO)
- **Smart filtering**: Punctuation/emoji-only, numeric-only, ignored tags
- **Configuration**: `ignoreLiterals`, `caseSensitive`, `trim`, `ignoreComponentsWithTitle` options

## Development Notes

- Uses TypeScript with strict mode enabled
- Target: ES2019, CommonJS modules
- Uses `@typescript-eslint/utils` for ESLint rule creation utilities
- Peer dependency on ESLint ^8.0.0
- Development dependencies include TypeScript ~5.0.4, Prettier for formatting, tsup for bundling
- Custom test runner instead of traditional test frameworks
- Bundle optimization: Single 9.7KB bundle (down from 12KB + multiple files)
- GitHub repository: https://github.com/camelohq/eslint-plugin-i18n-rules

## Configuration

The plugin exports a complete recommended configuration that includes both rules:

```javascript
configs: {
  recommended: {
    plugins: ["i18n-rules"],
    rules: {
      "i18n-rules/no-hardcoded-jsx-text": "error",
      "i18n-rules/no-hardcoded-jsx-attributes": [
        "warn",
        {
          ignoreLiterals: ["404", "N/A", "SKU-0001"],
          caseSensitive: false,
          trim: true,
        },
      ],
    },
  },
}
```

### Usage Patterns

**Recommended config usage:**

```json
{
  "extends": ["plugin:i18n-rules/recommended"]
}
```

**Manual configuration:**

```json
{
  "plugins": ["i18n-rules"],
  "rules": {
    "i18n-rules/no-hardcoded-jsx-text": "error",
    "i18n-rules/no-hardcoded-jsx-attributes": "warn"
  }
}
```

## Rule Documentation

- no-hardcoded-jsx-text: docs/rules/no-hardcoded-jsx-text.md
- no-hardcoded-jsx-attributes: docs/rules/no-hardcoded-jsx-attributes.md

# Workflow

- Checkout a new branch before do your task
- Be sure to type check (run `yarn test`, `yarn build`, `yarn format` ) when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
