"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CAPThemeProvider", {
    enumerable: true,
    get: function() {
        return CAPThemeProvider;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _reactcomponents = require("@fluentui/react-components");
const _CAPButton = require("./components/CAPButton");
const _CAPBadge = require("./components/CAPBadge");
const _CAPInput = require("./components/CAPInput");
const _CAPCard = require("./components/CAPCard");
const CAPThemeProvider = ({ children, theme })=>{
    const customStyleHooks = _react.useMemo(()=>{
        return {
            useBadgeStyles_unstable: (state)=>(0, _CAPBadge.useCAPBadgeStylesHook)(state),
            useButtonStyles_unstable: (state)=>(0, _CAPButton.useCAPButtonStylesHook)(state),
            useCardStyles_unstable: (state)=>(0, _CAPCard.useCAPCardStylesHook)(state),
            useInputStyles_unstable: (state)=>(0, _CAPInput.useCAPInputStylesHook)(state)
        };
    }, []);
    const styles = {};
    for (const [tokenName, tokenValue] of Object.entries(theme)){
        styles[`--cap-${tokenName}`] = tokenValue;
    }
    return /*#__PURE__*/ _react.createElement(_reactcomponents.FluentProvider, {
        theme: theme,
        customStyleHooks_unstable: customStyleHooks,
        style: styles
    }, children);
};
