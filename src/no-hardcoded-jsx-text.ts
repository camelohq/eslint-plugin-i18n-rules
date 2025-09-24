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
    detections?: {
      jsxText?: boolean;
      expressionContainers?: boolean;
      templateLiterals?: boolean;
      conditionalText?: boolean;
      partiallyHardcodedTemplates?: boolean;
    };
  },
];
type MessageIds =
  | "noHardcoded"
  | "noHardcodedTemplate"
  | "noHardcodedConditional"
  | "partiallyHardcodedTemplate";

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
      noHardcodedTemplate:
        "Avoid hardcoded template literal '{{ text }}' — use t() with interpolation.",
      noHardcodedConditional:
        "Avoid hardcoded text '{{ text }}' in conditional — use t() for both branches.",
      partiallyHardcodedTemplate:
        "Template literal '{{ text }}' contains hardcoded text — use t() with parameters.",
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
          detections: {
            type: "object",
            properties: {
              jsxText: { type: "boolean", default: true },
              expressionContainers: { type: "boolean", default: true },
              templateLiterals: { type: "boolean", default: true },
              conditionalText: { type: "boolean", default: true },
              partiallyHardcodedTemplates: { type: "boolean", default: false },
            },
            additionalProperties: false,
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
      detections: {
        jsxText: true,
        expressionContainers: true,
        templateLiterals: true,
        conditionalText: true,
        partiallyHardcodedTemplates: false, // Disabled by default to avoid breaking existing behavior
      },
    },
  ],
  create(context) {
    const options = context.options[0] || {};
    const defaultIgnoreLiterals = ["404", "N/A"];
    const {
      ignoreLiterals: customIgnoreLiterals = [],
      caseSensitive = false,
      trim: shouldTrim = true,
      detections = {},
    } = options;

    // Merge default and custom ignore literals
    const ignoreLiterals = [...defaultIgnoreLiterals, ...customIgnoreLiterals];

    // Detection settings with defaults
    const detectionsConfig = {
      jsxText: true,
      expressionContainers: true,
      templateLiterals: true,
      conditionalText: true,
      partiallyHardcodedTemplates: false, // Disabled by default to avoid breaking existing behavior
      ...detections,
    };

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

    const analyzeTemplateLiteral = (node: TSESTree.TemplateLiteral) => {
      if (node.expressions.length === 0) {
        // No expressions - handled by existing logic
        return null;
      }

      const quasis = node.quasis;
      const hasHardcodedParts = quasis.some((quasi) => {
        const text = quasi.value.cooked || "";
        const trimmedText = text.trim();

        // Skip empty or whitespace-only quasi
        if (!trimmedText) return false;

        // Skip if it doesn't contain alphanumeric characters
        if (!/[a-zA-Z0-9]/.test(trimmedText)) return false;

        // Skip if the entire quasi should be ignored
        if (shouldIgnoreString(text)) return false;

        // Check if this contains hardcoded words
        // Split by whitespace and check each word
        const words = trimmedText.split(/\s+/);
        return words.some((word) => {
          const cleanWord = word.replace(/[^\w]/g, "");
          return (
            cleanWord &&
            /[a-zA-Z]/.test(cleanWord) && // Contains letters
            !shouldIgnoreString(cleanWord) // Only check the clean word
          );
        });
      });

      if (hasHardcodedParts) {
        // Reconstruct the template literal text for display
        let reconstructedText = "";
        for (let i = 0; i < quasis.length; i++) {
          reconstructedText += quasis[i].value.cooked || "";
          if (i < node.expressions.length) {
            reconstructedText += "${...}";
          }
        }
        return reconstructedText.trim();
      }

      return null;
    };

    const isConditionalExpression = (node: TSESTree.Node): boolean => {
      return node.type === "ConditionalExpression";
    };

    const analyzeConditionalText = (
      node: TSESTree.ConditionalExpression
    ): { literalTexts: string[]; templateLiterals: TSESTree.TemplateLiteral[] } => {
      const literalTexts: string[] = [];
      const templateLiterals: TSESTree.TemplateLiteral[] = [];

      const checkBranch = (branch: TSESTree.Expression) => {
        if (branch.type === "Literal" && typeof branch.value === "string") {
          const text = branch.value.trim();
          if (text && /[a-zA-Z0-9]/.test(text) && !shouldIgnoreString(branch.value)) {
            literalTexts.push(text);
          }
        } else if (branch.type === "TemplateLiteral") {
          if (branch.expressions.length === 0) {
            // Static template literal
            const text = branch.quasis.map((q) => q.value.cooked ?? "").join("").trim();
            if (text && /[a-zA-Z0-9]/.test(text) && !shouldIgnoreString(text)) {
              literalTexts.push(text);
            }
          } else if (detectionsConfig.partiallyHardcodedTemplates) {
            // Partially hardcoded template literal - collect for separate analysis
            templateLiterals.push(branch);
          }
        }
      };

      checkBranch(node.consequent);
      checkBranch(node.alternate);

      return { literalTexts, templateLiterals };
    };

    return {
      JSXText(node: TSESTree.JSXText) {
        if (!detectionsConfig.jsxText) return;

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
        if (!detectionsConfig.expressionContainers) return;

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

        // Check for conditional expressions
        if (detectionsConfig.conditionalText && isConditionalExpression(expr)) {
          const { literalTexts, templateLiterals } = analyzeConditionalText(
            expr as TSESTree.ConditionalExpression
          );

          // Report literal texts
          literalTexts.forEach((text) => {
            context.report({
              node: expr,
              messageId: "noHardcodedConditional",
              data: { text },
            });
          });

          // Report partially hardcoded template literals
          templateLiterals.forEach((templateNode) => {
            const hardcodedText = analyzeTemplateLiteral(templateNode);
            if (hardcodedText) {
              context.report({
                node: templateNode,
                messageId: "partiallyHardcodedTemplate",
                data: { text: hardcodedText },
              });
            }
          });

          return;
        }
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

        // Template literals
        if (detectionsConfig.templateLiterals && expr.type === "TemplateLiteral") {
          // Handle template literals with no expressions: <div>{`Hello`}</div>
          if (expr.expressions.length === 0) {
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
              messageId: "noHardcoded", // Keep original message ID for backward compatibility
              data: { text },
            });
            return;
          }

          // Handle partially hardcoded templates: <div>{`Hello ${name}!`}</div>
          if (detectionsConfig.partiallyHardcodedTemplates && expr.expressions.length > 0) {
            const hardcodedText = analyzeTemplateLiteral(expr);
            if (hardcodedText) {
              context.report({
                node: expr,
                messageId: "partiallyHardcodedTemplate",
                data: { text: hardcodedText },
              });
            }
            return;
          }
        }
      },
    };
  },
});
