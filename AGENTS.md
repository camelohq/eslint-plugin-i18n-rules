# Repository Guidelines

## Project Structure & Module Organization

- **Source**: `src/` (TypeScript). Entry at `src/index.ts`; rules implemented alongside (e.g., `src/no-hardcoded-jsx-text.ts`, `src/no-hardcoded-jsx-attributes.ts`).
- **Build output**: `lib/` (CommonJS). Only `lib/` is published via `package.json#files`.
- **Tests**: Custom test runner at `tests/index.js` that requires both rule test files.
- **Documentation**: Rule docs in `docs/rules/` directory with detailed examples and configurations.
- **Legacy artifacts**: `dist/` may exist but is not the published entry; prefer `lib/`.

## Available Rules

- **`no-hardcoded-jsx-text`** (Recommended): Detects hardcoded strings in JSX content and expression containers
- **`no-hardcoded-jsx-attributes`** (Opt-in): Detects hardcoded strings in user-visible JSX attributes like `aria-label`, `title`, `alt`, `placeholder`

## Build, Test, and Development Commands

- `npm run build` / `yarn build`: Bundle TypeScript to single optimized `lib/index.js` using tsup (esbuild).
- `npm run build:dev` / `yarn build:dev`: Compile TypeScript to separate files using `tsc` (for debugging).
- `npm run test` / `yarn test`: Build and run custom test suite against compiled rules.
- `npm run lint` / `yarn lint`: Lint all `.ts` files via ESLint.
- `npm run format` / `yarn format`: Format code using Prettier.
- `npm run format:check` / `yarn format:check`: Check code formatting without modifying files.
- Local plugin testing: after building, consume from another project by linking the plugin and enabling rules.
  - Example ESLint config: `{ "plugins": ["i18n-rules"], "rules": { "i18n-rules/no-hardcoded-jsx-text": "error", "i18n-rules/no-hardcoded-jsx-attributes": "warn" } }`.

## Coding Style & Naming Conventions

- **Language**: TypeScript (CommonJS). Target: ES2019, strict mode enabled.
- **Formatting**: 2 spaces indentation; use semicolons; prefer double quotes for strings (Prettier enforced).
- **Rule IDs and filenames**: kebab-case (e.g., `no-hardcoded-jsx-text.ts`, rule id `no-hardcoded-jsx-text`).
- **Variables/functions**: camelCase; Types and Interfaces: PascalCase.
- **Linting**: keep `npm run lint` clean before submitting.
- **Formatting**: run `npm run format` to ensure consistent code style.

## Rule Implementation Guidelines

- Use `@typescript-eslint/utils.RuleCreator` for consistent rule structure.
- Include comprehensive TypeScript types for options and message IDs.
- Implement smart filtering to avoid false positives (whitespace, punctuation, emojis, etc.).
- Handle multiple JSX contexts: direct text, expression containers, string literals, template literals.
- Provide configurable options with sensible defaults.
- Add proper JSDoc documentation for rule options.

## Testing Guidelines

- Uses custom test runner under `tests/` (see `tests/index.js`).
- Individual test files: `tests/no-hardcoded-jsx-text.test.js`, `tests/no-hardcoded-jsx-attributes.test.js`.
- Run: `npm test` (builds then runs tests against compiled `lib/` output).
- Cover all AST node visitors and edge cases:
  - Ignored tags (`title`, `style`, `script`)
  - Whitespace-only content
  - Emoji and punctuation patterns
  - Trans component detection
  - Attribute-specific scenarios
  - Configuration option variations

## Configuration & Plugin Structure

- Plugin exports both rules and a recommended configuration.
- Recommended config includes sensible defaults for the attribute rule.
- Support for `ignoreLiterals`, `caseSensitive`, `trim`, and component-specific ignores.
- Maintain backward compatibility when adding new options.

## Commit & Pull Request Guidelines

- **Commits**: imperative and concise (e.g., `feat: add attribute rule`, `fix: handle template literals in expressions`). Group related changes.
- **PRs should include**:
  - Summary of changes and motivation; link related issues.
  - Minimal repro snippets showing expected vs. actual lint messages.
  - Test coverage for new functionality.
  - Documentation updates if adding features or changing behavior.
  - Notes on breaking changes or configuration updates.
- **Documentation**: if adding a rule, include comprehensive `docs/rules/<rule-name>.md` with examples.

## Agent-Specific Tips

- **Never edit compiled output**: Do not edit `lib/` or `dist/` directly. Modify `src/` and run `npm run build`.
- **Rule quality**: Keep rule `meta` accurate and messages actionable; add fixers only when safe and deterministic.
- **Compatibility**: Maintain peer compatibility with ESLint `^8` as declared in `peerDependencies`.
- **Testing workflow**: Always run `npm run build && npm run test` after making changes.
- **Smart filtering**: Consider edge cases like emojis, punctuation, numeric strings when implementing detection logic.
- **AST patterns**: Understand JSX AST structure for both content (`JSXText`, `JSXExpressionContainer`) and attributes (`JSXAttribute`).
- **Trans component handling**: Be aware of i18n component patterns that should be ignored.

## Rule Documentation

- **`no-hardcoded-jsx-text`**: `docs/rules/no-hardcoded-jsx-text.md` (comprehensive examples, configuration)
- **`no-hardcoded-jsx-attributes`**: `docs/rules/no-hardcoded-jsx-attributes.md` (attribute-specific guidance)

## Agent Workflow & Tooling

- Run shell commands with `bash -lc` and always set the `workdir` argument; avoid relying on `cd`.
- Prefer `rg`/`rg --files` for searches; fall back to other tools only when unavailable.
- Be mindful of sandboxing: filesystem writes allowed in the workspace, network is restricted, and approvals require `with_escalated_permissions` plus a justification.

## Planning & Editing

- Use the planning tool for multi-step work, but skip it for the simplest tasks; never submit a single-step plan.
- Do not revert or overwrite user changes you did not author; coordinate if unexpected edits appear.
- Default to ASCII output, add comments only when they clarify complex code, and never touch compiled artifacts in `lib/` or `dist/` directly.
- When testing, prefer `npm run build && npm run test`; keep lint and format commands clean before handing off.

## Communication Guidelines

- Keep responses concise with a collaborative tone; lead with the key change before diving into detail.
- Reference files using inline paths like `src/index.ts:12` so they remain clickable.
- Offer natural next steps (tests, commits, verification) when relevant; omit them when there are none.
