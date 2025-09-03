# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ESLint plugin that provides internationalization (i18n) linting rules. The plugin currently includes one rule: `no-hardcoded-jsx-text`, which detects hardcoded string literals in JSX and suggests using i18n solutions like `t()` or `<Trans>` components.

## Commands

### Build

```bash
npm run build
# or
yarn build
```

Compiles TypeScript source files from `src/` to `lib/` directory.

### Lint

```bash
npm run lint
# or
yarn lint
```

Runs ESLint on all TypeScript files in the project.

## Architecture

The plugin follows ESLint's standard plugin structure:

- **Entry point**: `src/index.ts` - Exports the plugin configuration with available rules
- **Rules**: Individual rule implementations in `src/` directory (currently `no-hardcoded-jsx-text.ts`)
- **Build output**: `lib/` directory contains compiled CommonJS modules
- **Package**: Publishes only the `lib/` directory as specified in `package.json`

### Rule Implementation Pattern

Rules are implemented using `@typescript-eslint/utils.RuleCreator` and follow this structure:

- Type definitions for options and message IDs
- Meta configuration with rule type, description, and error messages
- AST visitor functions that analyze specific node types (e.g., `JSXText`)
- Conditional logic to ignore certain cases (whitespace, specific HTML tags, etc.)

The `no-hardcoded-jsx-text` rule specifically:

- Targets JSX text nodes
- Ignores whitespace-only content and non-alphanumeric strings
- Excludes specific HTML tags like `title`, `style`, `script`
- Reports violations with contextual error messages

## Development Notes

- Uses TypeScript with strict mode enabled
- Target: ES2019, CommonJS modules
- Uses `@typescript-eslint/utils` for ESLint rule creation utilities
- Peer dependency on ESLint ^8.0.0

## Rule Docs

- no-hardcoded-jsx-text: docs/rules/no-hardcoded-jsx-text.md
- no-hardcoded-jsx-attributes (opt-in): docs/rules/no-hardcoded-jsx-attributes.md

# Workflow

- Checkout a new branch before do your task
- Be sure to type check (run `yarn test`, `yarn build`) when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
