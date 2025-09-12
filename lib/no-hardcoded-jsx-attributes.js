"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/camelohq/eslint-plugin-i18n-rules/blob/main/docs/rules/${name}.md`,
);
const TARGET_ATTRS = new Set([
  "aria-label",
  "aria-description",
  "aria-valuetext",
  "aria-roledescription",
  "title",
  "alt",
  "placeholder",
]);
exports.default = createRule({
  name: "no-hardcoded-jsx-attributes",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow hardcoded string literals in user-visible JSX attributes — use t() instead.",
      recommended: false,
    },
    messages: {
      noHardcodedAttr:
        "Avoid hardcoded string '{{ text }}' in JSX attribute '{{ attr }}' — use t().",
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
          ignoreComponentsWithTitle: {
            type: "array",
            items: { type: "string" },
            default: ["Layout", "SEO"],
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
      ignoreComponentsWithTitle: ["Layout", "SEO"],
    },
  ],
  create(context) {
    const options = context.options[0] || {};
    const {
      ignoreLiterals = ["404", "N/A"],
      caseSensitive = false,
      trim: shouldTrim = true,
      ignoreComponentsWithTitle = ["Layout", "SEO"],
    } = options;
    const shouldIgnoreString = (text) => {
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
    return {
      JSXAttribute(node) {
        // Resolve attribute name
        if (node.name.type !== "JSXIdentifier") return;
        const attrName = node.name.name;
        // Only check a known allowlist of user-visible attributes
        if (!TARGET_ATTRS.has(attrName)) return;
        // Skip on ignored tags
        const parentEl =
          node.parent &&
          node.parent.type === "JSXOpeningElement" &&
          node.parent.name.type === "JSXIdentifier"
            ? node.parent.name.name
            : undefined;
        const ignoredTags = ["title", "style", "script"];
        if (parentEl && ignoredTags.includes(parentEl)) return;
        // Skip title attributes on ignored components
        if (
          attrName === "title" &&
          parentEl &&
          ignoreComponentsWithTitle.includes(parentEl)
        )
          return;
        const value = node.value;
        if (!value) return; // boolean attributes
        // title="Hello"
        if (value.type === "Literal" && typeof value.value === "string") {
          const text = value.value.trim();
          if (!text) return;
          if (!/[a-zA-Z0-9]/.test(text)) return;
          // Ignore numeric-only strings
          if (/^[0-9]+$/.test(text)) return;
          // Check if the string should be ignored based on configuration
          if (shouldIgnoreString(value.value)) return;
          context.report({
            node: value,
            messageId: "noHardcodedAttr",
            data: { text, attr: attrName },
          });
          return;
        }
        // title={'Hello'} or title={`Hello`}
        if (value.type === "JSXExpressionContainer") {
          const expr = value.expression;
          if (expr.type === "Literal" && typeof expr.value === "string") {
            const text = expr.value.trim();
            if (!text) return;
            if (!/[a-zA-Z0-9]/.test(text)) return;
            // Ignore numeric-only strings
            if (/^[0-9]+$/.test(text)) return;
            // Check if the string should be ignored based on configuration
            if (shouldIgnoreString(expr.value)) return;
            context.report({
              node: expr,
              messageId: "noHardcodedAttr",
              data: { text, attr: attrName },
            });
            return;
          }
          if (
            expr.type === "TemplateLiteral" &&
            expr.expressions.length === 0
          ) {
            const cooked = expr.quasis
              .map((q) => {
                var _a;
                return (_a = q.value.cooked) !== null && _a !== void 0
                  ? _a
                  : "";
              })
              .join("");
            const text = cooked.trim();
            if (!text) return;
            if (!/[a-zA-Z0-9]/.test(text)) return;
            // Ignore numeric-only strings
            if (/^[0-9]+$/.test(text)) return;
            // Check if the string should be ignored based on configuration
            if (shouldIgnoreString(cooked)) return;
            context.report({
              node: expr,
              messageId: "noHardcodedAttr",
              data: { text, attr: attrName },
            });
            return;
          }
        }
      },
    };
  },
});
