"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "merge", {
    enumerable: true,
    get: function() {
        return merge;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _lodash = /*#__PURE__*/ _interop_require_wildcard._(require("lodash"));
const _reactis = /*#__PURE__*/ _interop_require_wildcard._(require("react-is"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (o)=>o !== null && typeof o === 'object' && !Array.isArray(o);
function merge(...objs) {
    const merged = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customMerge = (dest, src)=>{
        if (_reactis.isValidElementType(dest) || _reactis.isValidElementType(src)) {
            // Don't try to merge components!! (isValidElementType will also return true for all strings
            // and functions, but that's fine because the same merging logic would apply.)
            return src !== null && src !== void 0 ? src : dest;
        }
        if (_lodash.isArray(dest)) {
            return _lodash.uniq(dest.concat(src));
        }
        if (isObject(dest) && isObject(src)) {
            return _lodash.mergeWith({}, dest, src, customMerge);
        }
        return src !== null && src !== void 0 ? src : dest;
    };
    _lodash.mergeWith(merged, ...objs, customMerge);
    return merged;
}
