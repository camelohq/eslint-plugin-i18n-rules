# Tests

- Runner: Node executes RuleTester specs against the built rule in `lib/`.
- Entry: `tests/no-hardcoded-jsx-text.test.js`.

## Run
- `npm test`
- Or: `npm run build && node tests/no-hardcoded-jsx-text.test.js`

## Notes
- Build required: tests import from `lib/`. The test script runs `tsc` first.
- Parser: `@typescript-eslint/parser` with JSX enabled.
- Scope: The rule flags hardcoded strings in JSXText and in JSX expression containers when they are static (string/empty-template literal). Attributes are out of scope.
