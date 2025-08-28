"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const no_hardcoded_jsx_text_1 = __importDefault(require("./no-hardcoded-jsx-text"));
const no_hardcoded_jsx_attributes_1 = __importDefault(require("./no-hardcoded-jsx-attributes"));
module.exports = {
    rules: {
        'no-hardcoded-jsx-text': no_hardcoded_jsx_text_1.default,
        'no-hardcoded-jsx-attributes': no_hardcoded_jsx_attributes_1.default,
    },
};
