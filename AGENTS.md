# Repository Guidelines

## Project Structure & Module Organization

- Source: `src/` (TypeScript). Entry at `src/index.ts`; rules live alongside (e.g., `src/no-hardcoded-jsx-text.ts`).
- Build output: `lib/` (CommonJS). Only `lib/` is published via `package.json#files`.
- Legacy artifacts: `dist/` may exist but is not the published entry; prefer `lib/`.

## Build, Test, and Development Commands

- `npm run build` / `yarn build`: Compile TypeScript to `lib/` using `tsc`.
- `npm run lint` / `yarn lint`: Lint all `.ts` files via ESLint.
- Local plugin testing: after building, consume from another project by linking the plugin and enabling the rule.
  - Example ESLint config in a consumer: `{ "plugins": ["i18n-rules"], "rules": { "i18n-rules/no-hardcoded-jsx-text": "error" } }`.

## Coding Style & Naming Conventions

- Language: TypeScript (CommonJS). Indentation: 2 spaces; use semicolons; single quotes for strings.
- Rule IDs and filenames: kebab-case (e.g., `no-hardcoded-jsx-text.ts`, rule id `no-hardcoded-jsx-text`).
- Variables/functions: camelCase; Types and Interfaces: PascalCase.
- Linting: keep `npm run lint` clean before submitting.

## Testing Guidelines

- Uses `@typescript-eslint/utils` RuleTester under `tests/` (see `tests/index.js`).
- Run: `npm test` (builds then runs tests against `lib/`).
- Cover visitors and edge cases (ignored tags, whitespace, emoji/punctuation, attributes).

## Commit & Pull Request Guidelines

- Commits: imperative and concise (e.g., `rule: refine no-hardcoded-jsx-text reporting`). Group related changes.
- PRs should include:
  - Summary of changes and motivation; link related issues.
  - Minimal repro snippets showing expected vs. actual lint messages.
  - Notes on breaking changes or configuration updates.
- Docs: if adding a rule, include or reference `docs/rules/<rule-name>.md` (matches the rule docs URL pattern).

## Agent-Specific Tips

- Do not edit `lib/` or `dist/` directly. Modify `src/` and run `npm run build`.
- Keep rule `meta` accurate and messages actionable; add fixers only when safe and deterministic.
- Maintain peer compatibility with ESLint `^8` as declared in `peerDependencies`.

## Rule Docs

- `no-hardcoded-jsx-text`: `docs/rules/no-hardcoded-jsx-text.md`
- `no-hardcoded-jsx-attributes` (opt-in): `docs/rules/no-hardcoded-jsx-attributes.md`
