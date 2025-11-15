"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useCAPCardStylesHook", {
    enumerable: true,
    get: function() {
        return useCAPCardStylesHook;
    }
});
const _react = require("@griffel/react");
const useCAPCardStyles = (0, _react.makeStyles)({
    root: {}
});
function useCAPCardStylesHook(state) {
    const styles = useCAPCardStyles();
    state.root.className = (0, _react.mergeClasses)(state.root.className, styles.root);
    return state;
}
