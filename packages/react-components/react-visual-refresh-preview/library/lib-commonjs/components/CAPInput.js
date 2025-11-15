"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useCAPInputStylesHook", {
    enumerable: true,
    get: function() {
        return useCAPInputStylesHook;
    }
});
const _react = require("@griffel/react");
const useCAPInputStyles = (0, _react.makeStyles)({
    root: {}
});
function useCAPInputStylesHook(state) {
    const styles = useCAPInputStyles();
    state.root.className = (0, _react.mergeClasses)(state.root.className, styles.root);
    return state;
}
