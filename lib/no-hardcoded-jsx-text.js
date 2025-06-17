"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator(name => `https://github.com/your-org/eslint-plugin-i18n-rules/blob/main/docs/rules/${name}.md`);
exports.default = createRule({
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
            JSXText(node) {
                const raw = node.value;
                const value = raw.trim();
                // Ignore empty or only whitespace
                if (!value)
                    return;
                // Ignore if string does not contain any alphabet or digit
                if (!/[a-zA-Z0-9]/.test(value))
                    return;
                // Skip specific tags like <title>, <style>, etc.
                const parent = node.parent;
                if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'JSXElement' &&
                    parent.openingElement.name.type === 'JSXIdentifier') {
                    const tagName = parent.openingElement.name.name;
                    const ignoredTags = ['title', 'style', 'script'];
                    if (ignoredTags.includes(tagName))
                        return;
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
