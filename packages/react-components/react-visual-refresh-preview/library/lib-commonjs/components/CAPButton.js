"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useCAPButtonStylesHook", {
    enumerable: true,
    get: function() {
        return useCAPButtonStylesHook;
    }
});
const _react = require("@griffel/react");
const _CAPTheme = require("../CAPTheme");
const useCAPButtonStyles = (0, _react.makeStyles)({
    root: {
        borderRadius: '12px'
    },
    primary: {
        backgroundColor: _CAPTheme.CAPTokens.buttonPrimaryBackgroundColor,
        ':hover': {
            backgroundColor: _CAPTheme.CAPTokens.buttonPrimaryBackgroundColorHover
        }
    },
    secondary: {
        backgroundColor: _CAPTheme.CAPTokens.buttonSecondaryBackgroundColor,
        ':hover': {
            backgroundColor: _CAPTheme.CAPTokens.buttonSecondaryBackgroundColorHover
        }
    },
    outline: {
        backgroundColor: _CAPTheme.CAPTokens.buttonOutlineBackgroundColor,
        ':hover': {
            backgroundColor: _CAPTheme.CAPTokens.buttonOutlineBackgroundColorHover
        }
    },
    subtle: {},
    tint: {
        backgroundColor: _CAPTheme.CAPTokens.buttonTintBackgroundColor,
        ':hover': {
            backgroundColor: _CAPTheme.CAPTokens.buttonTintBackgroundColorHover
        }
    },
    transparent: {}
});
function useCAPButtonStylesHook(state) {
    const styles = useCAPButtonStyles();
    state.root.className = (0, _react.mergeClasses)(state.root.className, styles.root, state.appearance && styles[state.appearance]);
    return state;
}
