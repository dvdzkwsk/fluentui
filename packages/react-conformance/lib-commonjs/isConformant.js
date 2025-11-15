"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isConformant", {
    enumerable: true,
    get: function() {
        return isConformant;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _fs = /*#__PURE__*/ _interop_require_wildcard._(require("fs"));
const _defaultTests = require("./defaultTests");
const _merge = require("./utils/merge");
const _createTsProgram = require("./utils/createTsProgram");
const _getComponentDoc = require("./utils/getComponentDoc");
function isConformant(...testInfo) {
    const mergedOptions = (0, _merge.merge)(...testInfo);
    const { componentPath, displayName, disabledTests = [], extraTests, tsConfig, // eslint-disable-next-line @typescript-eslint/no-deprecated
    tsconfigDir, disableTypeTests } = mergedOptions;
    var _tsConfig_configDir;
    const mergedTsConfig = {
        configDir: (_tsConfig_configDir = tsConfig === null || tsConfig === void 0 ? void 0 : tsConfig.configDir) !== null && _tsConfig_configDir !== void 0 ? _tsConfig_configDir : tsconfigDir,
        configName: tsConfig === null || tsConfig === void 0 ? void 0 : tsConfig.configName
    };
    describe('isConformant', ()=>{
        if (!_fs.existsSync(componentPath)) {
            throw new Error(`Path ${componentPath} does not exist`);
        }
        if (disableTypeTests) {
            runNonTypeTests(mergedOptions);
            return;
        }
        const tsProgram = (0, _createTsProgram.createTsProgram)(componentPath, mergedTsConfig);
        const components = (0, _getComponentDoc.getComponentDoc)(componentPath, tsProgram);
        const mainComponents = components.filter((comp)=>comp.displayName === displayName);
        if (mainComponents.length === 1) {
            const componentInfo = mainComponents[0];
            for (const test of Object.keys(_defaultTests.defaultTests)){
                if (!disabledTests.includes(test)) {
                    _defaultTests.defaultTests[test](mergedOptions, componentInfo, tsProgram);
                }
            }
            if (extraTests) {
                describe('extraTests', ()=>{
                    for (const test of Object.keys(extraTests)){
                        if (!disabledTests.includes(test)) {
                            extraTests[test](mergedOptions, componentInfo, tsProgram);
                        }
                    }
                });
            }
        } else if (components.length === 0) {
            throw new Error(`No exported components found at path: ${componentPath}`);
        } else {
            throw new Error(`No component with name "${displayName}" was found at "${componentPath}".\n\n` + 'These are the exported component names: ' + components.map((component)=>component.displayName).join(', '));
        }
    });
}
/**
 * Run default and extra tests that don't require TypeScript information
 * @param mergedOptions
 */ function runNonTypeTests(mergedOptions) {
    const { disabledTests = [], extraTests } = mergedOptions;
    for (const test of Object.keys(_defaultTests.defaultTests)){
        if (!disabledTests.includes(test)) {
            const func = _defaultTests.defaultTests[test];
            if (isNonTypeTest(func)) {
                func(mergedOptions);
            }
        }
    }
    if (extraTests) {
        describe('extraTests', ()=>{
            for (const test of Object.keys(extraTests)){
                if (!disabledTests.includes(test)) {
                    const func = extraTests[test];
                    if (isNonTypeTest(func)) {
                        func(mergedOptions);
                    }
                }
            }
        });
    }
}
/**
 * Verifies that a test function has only one parameter. If so, this test does not require TS info.
 */ function isNonTypeTest(func) {
    return func.length === 1;
}
