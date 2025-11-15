"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPackagePath", {
    enumerable: true,
    get: function() {
        return getPackagePath;
    }
});
function getPackagePath(componentPath) {
    // Use lastIndexOf in case anyone has all their repos under a folder called "src" (it happens)
    const srcIndex = componentPath.replace(/\\/g, '/').lastIndexOf('/src/');
    return componentPath.slice(0, srcIndex);
}
