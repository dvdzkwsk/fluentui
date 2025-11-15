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
        return _errorMessages.errorMessageColors;
    },
    formatArray: function() {
        return _errorMessages.formatArray;
    },
    formatErrors: function() {
        return _errorMessages.formatErrors;
    },
    getCallbackArguments: function() {
        return _getCallbackArguments.getCallbackArguments;
    },
    getErrorMessage: function() {
        return _errorMessages.getErrorMessage;
    },
    getPackagePath: function() {
        return _getPackagePath.getPackagePath;
    },
    validateCallbackArguments: function() {
        return _validateCallbackArguments.validateCallbackArguments;
    }
});
const _errorMessages = require("./errorMessages");
const _getCallbackArguments = require("./getCallbackArguments");
const _getPackagePath = require("./getPackagePath");
const _validateCallbackArguments = require("./validateCallbackArguments");
