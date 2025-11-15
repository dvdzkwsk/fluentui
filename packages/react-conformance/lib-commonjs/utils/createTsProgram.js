"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createTsProgram", {
    enumerable: true,
    get: function() {
        return createTsProgram;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _path = /*#__PURE__*/ _interop_require_wildcard._(require("path"));
const _fs = /*#__PURE__*/ _interop_require_wildcard._(require("fs"));
const _typescript = /*#__PURE__*/ _interop_require_wildcard._(require("typescript"));
let program;
function createTsProgram(sourcePath, options = {}) {
    const { configName, configDir } = options;
    if (!program) {
        // Calling parse() from react-docgen-typescript would create a new ts.Program for every component,
        // which can take multiple seconds in a large project. For better performance, we create a single
        // ts.Program per package and pass it to parseWithProgramProvider().
        const tsconfigPath = _typescript.findConfigFile(configDir !== null && configDir !== void 0 ? configDir : sourcePath, _fs.existsSync, configName);
        if (!tsconfigPath) {
            throw new Error(`Cannot find ${configName}`);
        }
        const compilerOptions = getCompilerOptions(tsconfigPath);
        // To reduce the number of files parsed, only list the index file as the entry point.
        // This should work okay because it would be strange if a component being conformance tested
        // was not also referenced from some file eventually imported by the index file.
        const rootFile = _path.join(_path.dirname(tsconfigPath), 'src', 'index.ts');
        if (!_fs.existsSync(rootFile)) {
            throw new Error(`Index file does not exist at expected path ${rootFile}`);
        }
        program = _typescript.createProgram([
            rootFile
        ], compilerOptions);
    }
    if (!program.getSourceFile(sourcePath)) {
        // See earlier comment for why it's handled this way (can reconsider if it becomes a problem)
        throw new Error(`Component file "${sourcePath}" does not appear to be referenced from the project index file`);
    }
    return program;
}
function getCompilerOptions(tsconfigPath) {
    const basePath = _path.dirname(tsconfigPath);
    const { config, error } = _typescript.readConfigFile(tsconfigPath, (filename)=>_fs.readFileSync(filename, 'utf8'));
    if (error !== undefined) {
        const errorText = `Cannot load custom tsconfig.json from provided path: ${tsconfigPath}, ` + `with error code: ${error.code}, message: ${error.messageText}`;
        throw new Error(errorText);
    }
    const { options, errors } = _typescript.parseJsonConfigFileContent(config, _typescript.sys, basePath, {}, tsconfigPath);
    if (errors && errors.length) {
        throw errors[0];
    }
    return options;
}
