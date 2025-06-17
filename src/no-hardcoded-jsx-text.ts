import { TSESTree, ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  name =>
    `https://github.com/your-org/eslint-plugin-i18n-rules/blob/main/docs/rules/${name}.md`
);

type Options = [];
type MessageIds = 'noHardcoded';

export default createRule<Options, MessageIds>({
  name: 'no-hardcoded-jsx-text',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded string literals in JSX — use t() or <Trans>.',
    },
    messages: {
      noHardcoded: "Avoid hardcoded string '{{ text }}' in JSX — use t() or <Trans>.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXText(node: TSESTree.JSXText) {
        const value = node.value.trim();

        // Ignore purely whitespace or numeric strings
        if (!value || /^[\d\s.,-]+$/.test(value)) return;

        // Check tag name of parent JSX element
        const parent = node.parent;
        if (
          parent?.type === 'JSXElement' &&
          parent.openingElement.name.type === 'JSXIdentifier'
        ) {
          const tagName = parent.openingElement.name.name;
          const ignoredTags = ['title', 'style', 'script'];
          if (ignoredTags.includes(tagName)) return;
        }

        context.report({
          node,
          messageId: 'noHardcoded',
          data: { text: value },
        });
      },
    };
  },
});

