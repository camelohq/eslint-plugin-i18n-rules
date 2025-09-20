import * as _typescript_eslint_utils_dist_ts_eslint_Rule from '@typescript-eslint/utils/dist/ts-eslint/Rule';

declare const _default: {
    rules: {
        "no-hardcoded-jsx-text": _typescript_eslint_utils_dist_ts_eslint_Rule.RuleModule<"noHardcoded", [{
            ignoreLiterals?: string[] | undefined;
            caseSensitive?: boolean | undefined;
            trim?: boolean | undefined;
        }], _typescript_eslint_utils_dist_ts_eslint_Rule.RuleListener>;
        "no-hardcoded-jsx-attributes": _typescript_eslint_utils_dist_ts_eslint_Rule.RuleModule<"noHardcodedAttr", [{
            ignoreLiterals?: string[] | undefined;
            caseSensitive?: boolean | undefined;
            trim?: boolean | undefined;
            ignoreComponentsWithTitle?: string[] | undefined;
        }], _typescript_eslint_utils_dist_ts_eslint_Rule.RuleListener>;
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

export { _default as default };
