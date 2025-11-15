"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useCAPBadgeStylesHook", {
    enumerable: true,
    get: function() {
        return useCAPBadgeStylesHook;
    }
});
const _react = require("@griffel/react");
const useCAPBadgeStyles = (0, _react.makeStyles)({
    root: {}
});
function useCAPBadgeStylesHook(state) {
    const styles = useCAPBadgeStyles();
    state.root.className = (0, _react.mergeClasses)(state.root.className, styles.root);
    return state;
}
