import { TSESTree, ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/camelohq/eslint-plugin-i18n-rules/blob/main/docs/rules/${name}.md`,
);

type Options = [
  {
    ignoreLiterals?: string[];
    caseSensitive?: boolean;
    trim?: boolean;
  },
];
type MessageIds = "noHardcoded";

export default createRule<Options, MessageIds>({
  name: "no-hardcoded-jsx-text",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow hardcoded string literals in JSX — use t() or <Trans>.",
      recommended: "error",
    },
    messages: {
      noHardcoded:
        "Avoid hardcoded string '{{ text }}' in JSX — use t() or <Trans>.",
    },
    schema: [
      {
        type: "object",
        properties: {
          ignoreLiterals: {
            type: "array",
            items: { type: "string" },
            default: ["404", "N/A"],
          },
          caseSensitive: {
            type: "boolean",
            default: false,
          },
          trim: {
            type: "boolean",
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      ignoreLiterals: ["404", "N/A"],
      caseSensitive: false,
      trim: true,
    },
  ],
  create(context) {
    const options = context.options[0] || {};
    const {
      ignoreLiterals = ["404", "N/A"],
      caseSensitive = false,
      trim: shouldTrim = true,
    } = options;

    const shouldIgnoreString = (text: string): boolean => {
      let normalizedText = text;

      if (shouldTrim) {
        normalizedText = normalizedText.trim();
      }

      return ignoreLiterals.some((ignored) => {
        let normalizedIgnored = ignored;
        let textToCompare = normalizedText;

        if (!caseSensitive) {
          normalizedIgnored = normalizedIgnored.toLowerCase();
          textToCompare = textToCompare.toLowerCase();
        }

        return textToCompare === normalizedIgnored;
      });
    };

    const isInsideTransComponent = (node: TSESTree.Node): boolean => {
      let current = node.parent;
      while (current) {
        if (
          current.type === "JSXElement" &&
          current.openingElement.name.type === "JSXIdentifier" &&
          current.openingElement.name.name === "Trans"
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    };

    return {
      JSXText(node: TSESTree.JSXText) {
        const raw = node.value;
        const value = raw.trim();

        // Ignore empty or only whitespace
        if (!value) return;

        // Ignore if string does not contain any alphabet or digit
        if (!/[a-zA-Z0-9]/.test(value)) return;

        // Skip if inside a Trans component
        if (isInsideTransComponent(node)) return;

        // Skip specific tags like <title>, <style>, etc.
        const parent = node.parent;
        if (
          parent?.type === "JSXElement" &&
          parent.openingElement.name.type === "JSXIdentifier"
        ) {
          const tagName = parent.openingElement.name.name;
          const ignoredTags = ["title", "style", "script"];
          if (ignoredTags.includes(tagName)) return;
        }

        // Ignore numeric-only strings
        if (/^[0-9]+$/.test(value)) return;

        // Ignore HTTP/HTTPS URLs
        if (value.startsWith("http:") || value.startsWith("https:")) return;

        // Check if the string should be ignored based on configuration
        if (shouldIgnoreString(raw)) return;

        context.report({
          node,
          messageId: "noHardcoded",
          data: { text: value },
        });
      },
      JSXExpressionContainer(node: TSESTree.JSXExpressionContainer) {
        // Skip if inside a Trans component
        if (isInsideTransComponent(node)) return;

        const parent = node.parent;
        if (
          parent?.type === "JSXElement" &&
          parent.openingElement.name.type === "JSXIdentifier"
        ) {
          const tagName = parent.openingElement.name.name;
          const ignoredTags = ["title", "style", "script"];
          if (ignoredTags.includes(tagName)) return;
        }

        const expr = node.expression;
        // Literal string: <div>{'Hello'}</div>
        if (expr.type === "Literal" && typeof expr.value === "string") {
          const text = expr.value.trim();
          if (!text) return;
          if (!/[a-zA-Z0-9]/.test(text)) return;
          // Ignore numeric-only strings
          if (/^[0-9]+$/.test(text)) return;
          // Ignore HTTP/HTTPS URLs
          if (text.startsWith("http:") || text.startsWith("https:")) return;
          if (shouldIgnoreString(expr.value)) return;
          context.report({
            node: expr,
            messageId: "noHardcoded",
            data: { text },
          });
          return;
        }

        // Template literal with no expressions: <div>{`Hello`}</div>
        if (expr.type === "TemplateLiteral" && expr.expressions.length === 0) {
          const cooked = expr.quasis.map((q) => q.value.cooked ?? "").join("");
          const text = cooked.trim();
          if (!text) return;
          if (!/[a-zA-Z0-9]/.test(text)) return;
          // Ignore numeric-only strings
          if (/^[0-9]+$/.test(text)) return;
          // Ignore HTTP/HTTPS URLs
          if (text.startsWith("http:") || text.startsWith("https:")) return;
          if (shouldIgnoreString(cooked)) return;
          context.report({
            node: expr,
            messageId: "noHardcoded",
            data: { text },
          });
          return;
        }
      },
    };
  },
});
