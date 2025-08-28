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
            JSXExpressionContainer(node) {
                const parent = node.parent;
                if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'JSXElement' &&
                    parent.openingElement.name.type === 'JSXIdentifier') {
                    const tagName = parent.openingElement.name.name;
                    const ignoredTags = ['title', 'style', 'script'];
                    if (ignoredTags.includes(tagName))
                        return;
                }
                const expr = node.expression;
                // Literal string: <div>{'Hello'}</div>
                if (expr.type === 'Literal' && typeof expr.value === 'string') {
                    const text = expr.value.trim();
                    if (!text)
                        return;
                    if (!/[a-zA-Z0-9]/.test(text))
                        return;
                    context.report({ node: expr, messageId: 'noHardcoded', data: { text } });
                    return;
                }
                // Template literal with no expressions: <div>{`Hello`}</div>
                if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
                    const cooked = expr.quasis.map(q => { var _a; return (_a = q.value.cooked) !== null && _a !== void 0 ? _a : ''; }).join('');
                    const text = cooked.trim();
                    if (!text)
                        return;
                    if (!/[a-zA-Z0-9]/.test(text))
                        return;
                    context.report({ node: expr, messageId: 'noHardcoded', data: { text } });
                    return;
                }
            },
        };
    },
});
