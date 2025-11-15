"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getComponentDoc", {
    enumerable: true,
    get: function() {
        return getComponentDoc;
    }
});
const _reactdocgentypescript = require("react-docgen-typescript");
let parser;
function getComponentDoc(componentPath, program) {
    if (!parser) {
        parser = (0, _reactdocgentypescript.withCompilerOptions)(program.getCompilerOptions(), {
            // Props need to be filtered since react-docgen shows all the props including inherited
            // native props or React built-in props. (Check for both @types/react and react/index.d.ts
            // because there may be some variation in which format is used.)
            propFilter: (prop)=>{
                var _prop_parent;
                return !/@types[\\/]react[\\/]|\breact[\\/]index\.d\.ts$/.test(((_prop_parent = prop.parent) === null || _prop_parent === void 0 ? void 0 : _prop_parent.fileName) || '');
            }
        });
    }
    if (!program.getSourceFile(componentPath)) {
        // See earlier comment for why it's handled this way (can reconsider if it becomes a problem)
        throw new Error(`Component file "${componentPath}" does not appear to be referenced from the project index file`);
    }
    return parser.parseWithProgramProvider(componentPath, ()=>program);
}
