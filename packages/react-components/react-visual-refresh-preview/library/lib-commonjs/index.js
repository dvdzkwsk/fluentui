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
    CAPThemeProvider: function() {
        return _CAPThemeProvider.CAPThemeProvider;
    },
    CAP_THEME_ONE_DRIVE: function() {
        return _CAPTheme.CAP_THEME_ONE_DRIVE;
    },
    CAP_THEME_SHAREPOINT: function() {
        return _CAPTheme.CAP_THEME_SHAREPOINT;
    },
    CAP_THEME_TEAMS: function() {
        return _CAPTheme.CAP_THEME_TEAMS;
    }
});
const _CAPThemeProvider = require("./CAPThemeProvider");
const _CAPTheme = require("./CAPTheme");
