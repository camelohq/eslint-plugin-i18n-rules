//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
let __typescript_eslint_utils = require("@typescript-eslint/utils");
__typescript_eslint_utils = __toESM(__typescript_eslint_utils);

//#region src/no-hardcoded-jsx-text.ts
const createRule$1 = __typescript_eslint_utils.ESLintUtils.RuleCreator((name) => `https://github.com/camelohq/eslint-plugin-i18n-rules/blob/main/docs/rules/${name}.md`);
var no_hardcoded_jsx_text_default = createRule$1({
	name: "no-hardcoded-jsx-text",
	meta: {
		type: "problem",
		docs: {
			description: "Disallow hardcoded string literals in JSX — use t() or <Trans>.",
			recommended: "error"
		},
		messages: { noHardcoded: "Avoid hardcoded string '{{ text }}' in JSX — use t() or <Trans>." },
		schema: [{
			type: "object",
			properties: {
				ignoreLiterals: {
					type: "array",
					items: { type: "string" },
					default: ["404", "N/A"]
				},
				caseSensitive: {
					type: "boolean",
					default: false
				},
				trim: {
					type: "boolean",
					default: true
				}
			},
			additionalProperties: false
		}]
	},
	defaultOptions: [{
		ignoreLiterals: ["404", "N/A"],
		caseSensitive: false,
		trim: true
	}],
	create(context) {
		const { ignoreLiterals = ["404", "N/A"], caseSensitive = false, trim: shouldTrim = true } = context.options[0] || {};
		const shouldIgnoreString = (text) => {
			let normalizedText = text;
			if (shouldTrim) normalizedText = normalizedText.trim();
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
		const isInsideTransComponent = (node) => {
			let current = node.parent;
			while (current) {
				if (current.type === "JSXElement" && current.openingElement.name.type === "JSXIdentifier" && current.openingElement.name.name === "Trans") return true;
				current = current.parent;
			}
			return false;
		};
		return {
			JSXText(node) {
				const raw = node.value;
				const value = raw.trim();
				if (!value) return;
				if (!/[a-zA-Z0-9]/.test(value)) return;
				if (isInsideTransComponent(node)) return;
				const parent = node.parent;
				if (parent?.type === "JSXElement" && parent.openingElement.name.type === "JSXIdentifier") {
					const tagName = parent.openingElement.name.name;
					if ([
						"title",
						"style",
						"script"
					].includes(tagName)) return;
				}
				if (/^[0-9]+$/.test(value)) return;
				if (value.startsWith("http:") || value.startsWith("https:")) return;
				if (shouldIgnoreString(raw)) return;
				context.report({
					node,
					messageId: "noHardcoded",
					data: { text: value }
				});
			},
			JSXExpressionContainer(node) {
				if (isInsideTransComponent(node)) return;
				const parent = node.parent;
				if (parent?.type === "JSXElement" && parent.openingElement.name.type === "JSXIdentifier") {
					const tagName = parent.openingElement.name.name;
					if ([
						"title",
						"style",
						"script"
					].includes(tagName)) return;
				}
				const expr = node.expression;
				if (expr.type === "Literal" && typeof expr.value === "string") {
					const text = expr.value.trim();
					if (!text) return;
					if (!/[a-zA-Z0-9]/.test(text)) return;
					if (/^[0-9]+$/.test(text)) return;
					if (text.startsWith("http:") || text.startsWith("https:")) return;
					if (shouldIgnoreString(expr.value)) return;
					context.report({
						node: expr,
						messageId: "noHardcoded",
						data: { text }
					});
					return;
				}
				if (expr.type === "TemplateLiteral" && expr.expressions.length === 0) {
					const cooked = expr.quasis.map((q) => q.value.cooked ?? "").join("");
					const text = cooked.trim();
					if (!text) return;
					if (!/[a-zA-Z0-9]/.test(text)) return;
					if (/^[0-9]+$/.test(text)) return;
					if (text.startsWith("http:") || text.startsWith("https:")) return;
					if (shouldIgnoreString(cooked)) return;
					context.report({
						node: expr,
						messageId: "noHardcoded",
						data: { text }
					});
					return;
				}
			}
		};
	}
});

//#endregion
//#region src/no-hardcoded-jsx-attributes.ts
const createRule = __typescript_eslint_utils.ESLintUtils.RuleCreator((name) => `https://github.com/camelohq/eslint-plugin-i18n-rules/blob/main/docs/rules/${name}.md`);
const TARGET_ATTRS = new Set([
	"aria-label",
	"aria-description",
	"aria-valuetext",
	"aria-roledescription",
	"title",
	"alt",
	"placeholder"
]);
var no_hardcoded_jsx_attributes_default = createRule({
	name: "no-hardcoded-jsx-attributes",
	meta: {
		type: "problem",
		docs: {
			description: "Disallow hardcoded string literals in user-visible JSX attributes — use t() instead.",
			recommended: false
		},
		messages: { noHardcodedAttr: "Avoid hardcoded string '{{ text }}' in JSX attribute '{{ attr }}' — use t()." },
		schema: [{
			type: "object",
			properties: {
				ignoreLiterals: {
					type: "array",
					items: { type: "string" },
					default: ["404", "N/A"]
				},
				caseSensitive: {
					type: "boolean",
					default: false
				},
				trim: {
					type: "boolean",
					default: true
				},
				ignoreComponentsWithTitle: {
					type: "array",
					items: { type: "string" },
					default: ["Layout", "SEO"]
				}
			},
			additionalProperties: false
		}]
	},
	defaultOptions: [{
		ignoreLiterals: ["404", "N/A"],
		caseSensitive: false,
		trim: true,
		ignoreComponentsWithTitle: ["Layout", "SEO"]
	}],
	create(context) {
		const { ignoreLiterals = ["404", "N/A"], caseSensitive = false, trim: shouldTrim = true, ignoreComponentsWithTitle = ["Layout", "SEO"] } = context.options[0] || {};
		const shouldIgnoreString = (text) => {
			let normalizedText = text;
			if (shouldTrim) normalizedText = normalizedText.trim();
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
		return { JSXAttribute(node) {
			if (node.name.type !== "JSXIdentifier") return;
			const attrName = node.name.name;
			if (!TARGET_ATTRS.has(attrName)) return;
			const parentEl = node.parent && node.parent.type === "JSXOpeningElement" && node.parent.name.type === "JSXIdentifier" ? node.parent.name.name : void 0;
			if (parentEl && [
				"title",
				"style",
				"script"
			].includes(parentEl)) return;
			if (attrName === "title" && parentEl && ignoreComponentsWithTitle.includes(parentEl)) return;
			const value = node.value;
			if (!value) return;
			if (value.type === "Literal" && typeof value.value === "string") {
				const text = value.value.trim();
				if (!text) return;
				if (!/[a-zA-Z0-9]/.test(text)) return;
				if (/^[0-9]+$/.test(text)) return;
				if (text.startsWith("http:") || text.startsWith("https:")) return;
				if (shouldIgnoreString(value.value)) return;
				context.report({
					node: value,
					messageId: "noHardcodedAttr",
					data: {
						text,
						attr: attrName
					}
				});
				return;
			}
			if (value.type === "JSXExpressionContainer") {
				const expr = value.expression;
				if (expr.type === "Literal" && typeof expr.value === "string") {
					const text = expr.value.trim();
					if (!text) return;
					if (!/[a-zA-Z0-9]/.test(text)) return;
					if (/^[0-9]+$/.test(text)) return;
					if (text.startsWith("http:") || text.startsWith("https:")) return;
					if (shouldIgnoreString(expr.value)) return;
					context.report({
						node: expr,
						messageId: "noHardcodedAttr",
						data: {
							text,
							attr: attrName
						}
					});
					return;
				}
				if (expr.type === "TemplateLiteral" && expr.expressions.length === 0) {
					const cooked = expr.quasis.map((q) => q.value.cooked ?? "").join("");
					const text = cooked.trim();
					if (!text) return;
					if (!/[a-zA-Z0-9]/.test(text)) return;
					if (/^[0-9]+$/.test(text)) return;
					if (text.startsWith("http:") || text.startsWith("https:")) return;
					if (shouldIgnoreString(cooked)) return;
					context.report({
						node: expr,
						messageId: "noHardcodedAttr",
						data: {
							text,
							attr: attrName
						}
					});
					return;
				}
			}
		} };
	}
});

//#endregion
//#region src/index.ts
module.exports = {
	rules: {
		"no-hardcoded-jsx-text": no_hardcoded_jsx_text_default,
		"no-hardcoded-jsx-attributes": no_hardcoded_jsx_attributes_default
	},
	configs: { recommended: {
		plugins: ["i18n-rules"],
		rules: {
			"i18n-rules/no-hardcoded-jsx-text": "error",
			"i18n-rules/no-hardcoded-jsx-attributes": ["warn", {
				ignoreLiterals: [
					"404",
					"N/A",
					"SKU-0001"
				],
				caseSensitive: false,
				trim: true
			}]
		}
	} }
};

//#endregion