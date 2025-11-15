"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    errorMessageColors: function() {
        return errorMessageColors;
    },
    formatArray: function() {
        return formatArray;
    },
    formatErrors: function() {
        return formatErrors;
    },
    getErrorMessage: function() {
        return getErrorMessage;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _chalk = /*#__PURE__*/ _interop_require_default._(require("chalk"));
const _os = require("os");
const errorMessageColors = {
    // Colors for the defaultErrorMessage section.
    testErrorText: _chalk.default.yellow,
    testErrorName: _chalk.default.white,
    testErrorInfo: _chalk.default.green,
    testErrorPath: _chalk.default.green.italic,
    // Colors for the resolveErrorMessages section.
    resolveText: _chalk.default.cyan,
    resolveInfo: _chalk.default.hex('#e00000'),
    // Colors for the receivedErrorMessage section.
    receivedErrorHeader: _chalk.default.white.bold.bgRed,
    // Other colors.
    failedError: _chalk.default.red,
    // Color for section headers.
    sectionBackground: _chalk.default.white.bold.italic.bgHex('#2e2e2e')
};
function getErrorMessage(params) {
    const { testErrorText, testErrorName, resolveText, sectionBackground, receivedErrorHeader } = errorMessageColors;
    const { displayName, overview, details = [], error, suggestions } = params;
    const messageParts = [
        testErrorText(`It appears that ${testErrorName(displayName)} ${overview}`)
    ];
    if (details) {
        messageParts.push(details.join(_os.EOL));
    }
    if (suggestions) {
        messageParts.push(sectionBackground('Possible solutions:'), suggestions.map((msg, i)=>resolveText(`${i + 1}. ${msg}`)).join(_os.EOL));
    }
    if (error) {
        messageParts.push(`Also check the ${receivedErrorHeader('original error message')} in case there's some other issue:`, error.stack || error.message || String(error));
    }
    return messageParts.join(_os.EOL + _os.EOL);
}
function formatArray(arr) {
    return arr ? arr.map((value)=>`    ${value}`).join(_os.EOL) : 'received undefined';
}
function formatErrors(value) {
    return value ? Object.entries(value).map(([propName, error])=>`    ${propName}: ${error.message}`).join(_os.EOL) : 'received undefined';
}
