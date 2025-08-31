import noHardcodedJsxText from "./no-hardcoded-jsx-text";
import noHardcodedJsxAttributes from "./no-hardcoded-jsx-attributes";

export = {
  rules: {
    "no-hardcoded-jsx-text": noHardcodedJsxText,
    "no-hardcoded-jsx-attributes": noHardcodedJsxAttributes,
  },
  configs: {
    recommended: {
      rules: {
        "i18n-rules/no-hardcoded-jsx-attributes": [
          "warn",
          {
            ignoreLiterals: ["404", "N/A", "SKU-0001"],
            caseSensitive: false,
            trim: true,
          },
        ],
      },
    },
  },
};
