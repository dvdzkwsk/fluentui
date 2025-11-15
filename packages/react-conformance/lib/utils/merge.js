import * as _ from 'lodash';
import * as ReactIs from 'react-is';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (o)=>o !== null && typeof o === 'object' && !Array.isArray(o);
/**
 * Merge function with specific type
 * @param objs - objects to be merged
 */ export function merge(...objs) {
    const merged = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customMerge = (dest, src)=>{
        if (ReactIs.isValidElementType(dest) || ReactIs.isValidElementType(src)) {
            // Don't try to merge components!! (isValidElementType will also return true for all strings
            // and functions, but that's fine because the same merging logic would apply.)
            return src !== null && src !== void 0 ? src : dest;
        }
        if (_.isArray(dest)) {
            return _.uniq(dest.concat(src));
        }
        if (isObject(dest) && isObject(src)) {
            return _.mergeWith({}, dest, src, customMerge);
        }
        return src !== null && src !== void 0 ? src : dest;
    };
    _.mergeWith(merged, ...objs, customMerge);
    return merged;
}
