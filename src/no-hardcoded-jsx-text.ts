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
      recommended: false,
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
        const raw = node.value;
        const value = raw.trim();

        // Ignore empty or only whitespace
        if (!value) return;

        // Ignore if string does not contain any alphabet or digit
        if (!/[a-zA-Z0-9]/.test(value)) return;

        // Skip specific tags like <title>, <style>, etc.
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
      JSXExpressionContainer(node: TSESTree.JSXExpressionContainer) {
        const parent = node.parent;
        if (
          parent?.type === 'JSXElement' &&
          parent.openingElement.name.type === 'JSXIdentifier'
        ) {
          const tagName = parent.openingElement.name.name;
          const ignoredTags = ['title', 'style', 'script'];
          if (ignoredTags.includes(tagName)) return;
        }

        const expr = node.expression;
        // Literal string: <div>{'Hello'}</div>
        if (expr.type === 'Literal' && typeof expr.value === 'string') {
          const text = expr.value.trim();
          if (!text) return;
          if (!/[a-zA-Z0-9]/.test(text)) return;
          context.report({ node: expr, messageId: 'noHardcoded', data: { text } });
          return;
        }

        // Template literal with no expressions: <div>{`Hello`}</div>
        if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
          const cooked = expr.quasis.map(q => q.value.cooked ?? '').join('');
          const text = cooked.trim();
          if (!text) return;
          if (!/[a-zA-Z0-9]/.test(text)) return;
          context.report({ node: expr, messageId: 'noHardcoded', data: { text } });
          return;
        }
      },
    };
  },
});
