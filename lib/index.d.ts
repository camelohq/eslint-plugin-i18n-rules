import * as _typescript_eslint_utils_dist_ts_eslint_Rule0 from "@typescript-eslint/utils/dist/ts-eslint/Rule";

//#region src/index.d.ts
declare const _default: {
  rules: {
    "no-hardcoded-jsx-text": _typescript_eslint_utils_dist_ts_eslint_Rule0.RuleModule<"noHardcoded" | "noHardcodedTemplate" | "noHardcodedConditional" | "partiallyHardcodedTemplate", [{
      ignoreLiterals?: string[] | undefined;
      caseSensitive?: boolean | undefined;
      trim?: boolean | undefined;
      detections?: {
        jsxText?: boolean | undefined;
        expressionContainers?: boolean | undefined;
        templateLiterals?: boolean | undefined;
        conditionalText?: boolean | undefined;
        partiallyHardcodedTemplates?: boolean | undefined;
      } | undefined;
    }], _typescript_eslint_utils_dist_ts_eslint_Rule0.RuleListener>;
    "no-hardcoded-jsx-attributes": _typescript_eslint_utils_dist_ts_eslint_Rule0.RuleModule<"noHardcodedAttr", [{
      ignoreLiterals?: string[] | undefined;
      caseSensitive?: boolean | undefined;
      trim?: boolean | undefined;
      ignoreComponentsWithTitle?: string[] | undefined;
    }], _typescript_eslint_utils_dist_ts_eslint_Rule0.RuleListener>;
  };
  configs: {
    recommended: {
      plugins: string[];
      rules: {
        "i18n-rules/no-hardcoded-jsx-text": string;
        "i18n-rules/no-hardcoded-jsx-attributes": (string | {
          ignoreLiterals: string[];
          caseSensitive: boolean;
          trim: boolean;
        })[];
      };
    };
  };
};
export = _default;