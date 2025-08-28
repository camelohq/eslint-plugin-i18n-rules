import { TSESTree, ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  name =>
    `https://github.com/camelohq/eslint-plugin-i18n-rules/blob/main/docs/rules/${name}.md`
);

type Options = [];
type MessageIds = 'noHardcodedAttr';

const TARGET_ATTRS = new Set([
  'aria-label',
  'aria-description',
  'aria-valuetext',
  'aria-roledescription',
  'title',
  'alt',
  'placeholder',
]);

const IDREF_ATTRS = new Set([
  'aria-labelledby',
  'aria-describedby',
]);

export default createRule<Options, MessageIds>({
  name: 'no-hardcoded-jsx-attributes',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow hardcoded string literals in user-visible JSX attributes — use t() instead.',
      recommended: false,
    },
    messages: {
      noHardcodedAttr:
        "Avoid hardcoded string '{{ text }}' in JSX attribute '{{ attr }}' — use t().",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        // Resolve attribute name
        if (node.name.type !== 'JSXIdentifier') return;
        const attrName = node.name.name;

        // Only check target attributes; skip ID reference attributes
        if (IDREF_ATTRS.has(attrName)) return;
        if (!TARGET_ATTRS.has(attrName) && !attrName.startsWith('aria-')) return;

        // Skip on ignored tags
        const parentEl = node.parent &&
          node.parent.type === 'JSXOpeningElement' &&
          node.parent.name.type === 'JSXIdentifier'
          ? node.parent.name.name
          : undefined;
        const ignoredTags = ['title', 'style', 'script'];
        if (parentEl && ignoredTags.includes(parentEl)) return;

        const value = node.value;
        if (!value) return; // boolean attributes

        // title="Hello"
        if (value.type === 'Literal' && typeof value.value === 'string') {
          const text = value.value.trim();
          if (!text) return;
          if (!/[a-zA-Z0-9]/.test(text)) return;
          context.report({ node: value, messageId: 'noHardcodedAttr', data: { text, attr: attrName } });
          return;
        }

        // title={'Hello'} or title={`Hello`}
        if (value.type === 'JSXExpressionContainer') {
          const expr = value.expression;
          if (expr.type === 'Literal' && typeof expr.value === 'string') {
            const text = expr.value.trim();
            if (!text) return;
            if (!/[a-zA-Z0-9]/.test(text)) return;
            context.report({ node: expr, messageId: 'noHardcodedAttr', data: { text, attr: attrName } });
            return;
          }
          if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
            const cooked = expr.quasis.map(q => q.value.cooked ?? '').join('');
            const text = cooked.trim();
            if (!text) return;
            if (!/[a-zA-Z0-9]/.test(text)) return;
            context.report({ node: expr, messageId: 'noHardcodedAttr', data: { text, attr: attrName } });
            return;
          }
        }
      },
    };
  },
});

