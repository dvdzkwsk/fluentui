"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _overridesWin = require("./overridesWin");
const makeStylesTests = {
    [_overridesWin.OVERRIDES_WIN_TEST_NAME]: _overridesWin.overridesWin
};
const _default = makeStylesTests;
