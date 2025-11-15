"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "defaultTests", {
    enumerable: true,
    get: function() {
        return defaultTests;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _path = /*#__PURE__*/ _interop_require_wildcard._(require("path"));
const _react1 = require("@testing-library/react");
const _defaultErrorMessages = require("./defaultErrorMessages");
const _index = require("./utils/index");
const CALLBACK_REGEX = /^on(?!Render[A-Z])[A-Z]/;
/**
 * Find the target element where the attribute is applied using either `getTargetElement`,
 * or the first child of the container.
 */ function getTargetElement(testInfo, ...[result, attr]) {
    return testInfo.getTargetElement ? testInfo.getTargetElement(result, attr) : result.container.firstElementChild;
}
const defaultTests = {
    /** Component file exports a valid React element type  */ 'exports-component': (testInfo)=>{
        it(`exports component from file under correct name (exports-component)`, ()=>{
            const { componentPath, Component, displayName } = testInfo;
            const componentFile = require(componentPath);
            try {
                if (testInfo.useDefaultExport) {
                    expect(componentFile.default).toBe(Component);
                } else {
                    expect(componentFile[displayName]).toBe(Component);
                }
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['exports-component'](testInfo, e, Object.keys(componentFile)));
            }
        });
    },
    /** Component file exports a valid React element and can render it */ 'component-renders': (testInfo)=>{
        it(`renders (component-renders)`, ()=>{
            try {
                const { requiredProps, Component, renderOptions } = testInfo;
                expect(()=>(0, _react1.render)(/*#__PURE__*/ _react.createElement(Component, requiredProps), renderOptions)).not.toThrow();
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['component-renders'](testInfo, e));
            }
        });
    },
    /**
   * If functional component: component has a displayName
   * Else: component's constructor is a named function and matches displayName
   */ 'component-has-displayname': (testInfo)=>{
        const { Component } = testInfo;
        it(`has a displayName or constructor name (component-has-displayname)`, ()=>{
            try {
                var _Component_prototype;
                const constructorName = (_Component_prototype = Component.prototype) === null || _Component_prototype === void 0 ? void 0 : _Component_prototype.constructor.name;
                const displayName = Component.displayName || constructorName;
                // This check is needed in case the Component is wrapped with the v7 styled() helper, which returns a wrapper
                // component with constructor name Wrapped, and adds a Styled prefix to the displayName. Components passed to
                // styled() typically have Base in their name, so remove that too.
                expect(displayName).toMatch(new RegExp(`^(Customized|Styled)?${testInfo.displayName}(Base)?$`));
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['component-has-displayname'](testInfo, e));
            }
        });
    },
    /** Component handles ref */ 'component-handles-ref': (testInfo)=>{
        it(`handles ref (component-handles-ref)`, ()=>{
            // This test simply verifies that the passed ref is applied to an element *anywhere* in the DOM
            const { Component, requiredProps, elementRefName = 'ref', renderOptions } = testInfo;
            const rootRef = /*#__PURE__*/ _react.createRef();
            const mergedProps = {
                ...requiredProps,
                [elementRefName]: rootRef
            };
            const { baseElement } = (0, _react1.render)(/*#__PURE__*/ _react.createElement(Component, mergedProps), renderOptions);
            try {
                expect(rootRef.current).toBeInstanceOf(HTMLElement);
                expect(baseElement.contains(rootRef.current)).toBe(true);
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['component-handles-ref'](testInfo, e));
            }
        });
    },
    /** Component has ref applied to the root component DOM node */ 'component-has-root-ref': (testInfo)=>{
        it(`applies ref to root element (component-has-root-ref)`, ()=>{
            const { renderOptions, Component, requiredProps, elementRefName = 'ref', primarySlot = 'root' } = testInfo;
            const rootRef = /*#__PURE__*/ _react.createRef();
            const mergedProps = {
                ...requiredProps,
                ...primarySlot !== 'root' ? {
                    // If primarySlot is something other than 'root', add the ref to
                    // the root slot rather than to the component's props.
                    root: {
                        ref: rootRef
                    }
                } : {
                    [elementRefName]: rootRef
                }
            };
            const result = (0, _react1.render)(/*#__PURE__*/ _react.createElement(Component, mergedProps), renderOptions);
            const refEl = getTargetElement(testInfo, result, 'ref');
            expect(refEl).toBeTruthy();
            try {
                // Do an instanceof check first because if `ref` returns a class instance, the toBe check
                // will print out the very long stringified version in the error (which isn't helpful)
                expect(rootRef.current).toBeInstanceOf(HTMLElement);
                expect(rootRef.current).toBe(refEl);
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['component-has-root-ref'](testInfo, e));
            }
        });
    },
    /**
   * Component does not apply `size` as a native prop when a custom version is defined.
   *
   * Background: `input` and `select` support a `size` prop which is not very useful
   * (https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size).
   * Since we don't anticipate ever needing this functionality, and we often want to use the prop name
   * `size` to refer to visual size (like small/medium/large), we want to ensure that components defining
   * a custom `size` prop don't also apply it as a native prop by accident.
   *
   * (In the extremely unlikely event that someone has a compelling need for the native functionality
   * in the future, it can be added under an `htmlSize` prop.)
   */ 'omits-size-prop': (testInfo, componentInfo)=>{
        var _componentInfo_props_size_type, _componentInfo_props_size;
        const sizeType = (_componentInfo_props_size = componentInfo.props.size) === null || _componentInfo_props_size === void 0 ? void 0 : (_componentInfo_props_size_type = _componentInfo_props_size.type) === null || _componentInfo_props_size_type === void 0 ? void 0 : _componentInfo_props_size_type.name;
        if (!sizeType || componentInfo.props.htmlSize) {
            return;
        }
        // if the size prop is defined, type.name will probably be 'string | undefined'
        // or something like '"small" | "medium" | "large" | undefined'
        const sizeIsString = /\bstring\b/.test(sizeType);
        const sizeLiteralMatch = sizeType.match(/"(.*?)"/);
        if (!sizeIsString || sizeLiteralMatch) {
            return; // not a format we know how to test
        }
        it(`does not apply native size prop if custom one is defined (omits-size-prop)`, ()=>{
            const { renderOptions, Component, requiredProps } = testInfo;
            const size = (sizeLiteralMatch === null || sizeLiteralMatch === void 0 ? void 0 : sizeLiteralMatch[1]) || 'foo';
            const mergedProps = {
                ...requiredProps,
                size
            }; // we know the size prop is supported but there's not a good way to derive the actual type
            const { baseElement } = (0, _react1.render)(/*#__PURE__*/ _react.createElement(Component, mergedProps), renderOptions);
            const elementWithSize = baseElement.querySelector('[size]');
            try {
                expect(elementWithSize).toBeFalsy();
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['omits-size-prop'](testInfo, e, size, elementWithSize));
            }
        });
    },
    /** Component file handles classname prop */ 'component-handles-classname': (testInfo)=>{
        const { Component, requiredProps, renderOptions } = testInfo;
        const testClassName = 'testComponentClassName';
        let handledClassName = false;
        let defaultClassNames;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mergedProps = {
            ...requiredProps,
            className: testClassName
        };
        it('has default classNames', ()=>{
            // this is not a real test, it's just to get the default class names without causing
            // possible side effects within another test by rendering the component twice
            const defaultResult = (0, _react1.render)(/*#__PURE__*/ _react.createElement(Component, requiredProps), renderOptions);
            const defaultEl = getTargetElement(testInfo, defaultResult, 'className');
            defaultClassNames = classListToStrings(defaultEl.classList);
        });
        it(`handles className prop (component-handles-classname)`, ()=>{
            const result = (0, _react1.render)(/*#__PURE__*/ _react.createElement(Component, mergedProps), renderOptions);
            const domNode = getTargetElement(testInfo, result, 'className');
            expect(domNode).toBeTruthy();
            const classNames = classListToStrings(domNode.classList);
            try {
                expect(classNames).toContain(testClassName);
                handledClassName = true;
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['component-handles-classname'](testInfo, e, testClassName, classNames, domNode));
            }
        });
        it(`preserves component's default classNames (component-preserves-default-classname)`, ()=>{
            if (!handledClassName || !(defaultClassNames === null || defaultClassNames === void 0 ? void 0 : defaultClassNames.length)) {
                return; // don't run this test if the main className test failed or there are no defaults
            }
            const result = (0, _react1.render)(/*#__PURE__*/ _react.createElement(Component, mergedProps), renderOptions);
            const el = getTargetElement(testInfo, result, 'className');
            const classNames = classListToStrings(el.classList);
            let defaultClassName = '';
            try {
                for (defaultClassName of defaultClassNames){
                    expect(classNames).toContain(defaultClassName);
                }
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['component-preserves-default-classname'](testInfo, e, testClassName, defaultClassName, classNames));
            }
        });
    },
    /** Component file has assigned and exported static classnames object */ 'component-has-static-classnames-object': (testInfo)=>{
        var _testOptions_componenthasstaticclassname;
        const { componentPath, Component, testOptions = {}, requiredProps, renderOptions } = testInfo;
        const componentName = testInfo.displayName;
        var _testOptions_componenthasstaticclassname_prefix;
        const classNamePrefix = (_testOptions_componenthasstaticclassname_prefix = testOptions === null || testOptions === void 0 ? void 0 : (_testOptions_componenthasstaticclassname = testOptions['component-has-static-classname']) === null || _testOptions_componenthasstaticclassname === void 0 ? void 0 : _testOptions_componenthasstaticclassname.prefix) !== null && _testOptions_componenthasstaticclassname_prefix !== void 0 ? _testOptions_componenthasstaticclassname_prefix : 'fui';
        const componentClassName = `${classNamePrefix}-${componentName}`;
        const exportName = `${componentName[0].toLowerCase()}${componentName.slice(1)}ClassNames`;
        const indexPath = _path.join((0, _index.getPackagePath)(componentPath), 'src', 'index');
        let handledClassNamesObjectExport = false;
        it('has static classnames exported at top-level (component-has-static-classnames-object)', ()=>{
            if (testInfo.isInternal) {
                return;
            }
            try {
                const indexFile = require(indexPath);
                const classNamesFromFile = indexFile[exportName];
                expect(classNamesFromFile).toBeTruthy();
                handledClassNamesObjectExport = true;
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['component-has-static-classnames-object-exported'](testInfo, e, exportName));
            }
        });
        it('has static classnames in correct format (component-has-static-classnames-object)', ()=>{
            if (!handledClassNamesObjectExport) {
                return;
            }
            const indexFile = require(indexPath);
            const classNamesFromFile = indexFile[exportName];
            const expectedClassNames = Object.keys(classNamesFromFile).reduce((obj, key)=>{
                obj[key] = key === 'root' ? componentClassName : `${componentClassName}__${key}`;
                return obj;
            }, {});
            try {
                expect(classNamesFromFile).toEqual(expectedClassNames);
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['component-has-static-classnames-in-correct-format'](testInfo, e, exportName));
            }
        });
        it(`has static classnames in rendered component (component-has-static-classnames-object)`, ()=>{
            if (!handledClassNamesObjectExport) {
                return;
            }
            var _testOptions_hasstaticclassnames;
            const staticClassNameVariants = (_testOptions_hasstaticclassnames = testOptions['has-static-classnames']) !== null && _testOptions_hasstaticclassnames !== void 0 ? _testOptions_hasstaticclassnames : [
                {
                    props: {}
                }
            ];
            for (const staticClassNames of staticClassNameVariants){
                const mergedProps = {
                    ...requiredProps,
                    ...staticClassNames.props
                };
                const result = (0, _react1.render)(/*#__PURE__*/ _react.createElement(Component, mergedProps), renderOptions);
                const rootEl = getTargetElement(testInfo, result, 'className');
                const portalEl = staticClassNames.getPortalElement && staticClassNames.getPortalElement(result);
                const indexFile = require(indexPath);
                const classNamesFromFile = indexFile[exportName];
                var _staticClassNames_expectedClassNames;
                const expectedClassNames = (_staticClassNames_expectedClassNames = staticClassNames.expectedClassNames) !== null && _staticClassNames_expectedClassNames !== void 0 ? _staticClassNames_expectedClassNames : classNamesFromFile;
                let missingClassNames = Object.values(expectedClassNames).filter((className)=>!rootEl.classList.contains(className) && !rootEl.querySelector(`.${className}`));
                if (missingClassNames.length && portalEl) {
                    missingClassNames = missingClassNames.filter((className)=>!portalEl.classList.contains(className) && !portalEl.querySelector(`.${className}`));
                }
                try {
                    expect(missingClassNames).toHaveLength(0);
                } catch (e) {
                    throw new Error(_defaultErrorMessages.defaultErrorMessages['component-has-static-classnames'](testInfo, e, componentName, missingClassNames.join(', '), rootEl));
                }
            }
        });
    },
    /** Constructor/component name matches filename */ 'name-matches-filename': (testInfo)=>{
        it(`Component/constructor name matches filename (name-matches-filename)`, ()=>{
            try {
                const { componentPath, displayName } = testInfo;
                const fileName = _path.basename(componentPath, _path.extname(componentPath));
                expect(displayName).toMatch(fileName);
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['name-matches-filename'](testInfo, e));
            }
        });
    },
    /** Ensures component is exported at top level allowing `import { Component } from 'packageName'` */ 'exported-top-level': (testInfo)=>{
        if (testInfo.isInternal) {
            return;
        }
        it(`is exported at top-level (exported-top-level)`, ()=>{
            try {
                const { displayName, componentPath, Component } = testInfo;
                const indexFile = require(_path.join((0, _index.getPackagePath)(componentPath), 'src', 'index'));
                expect(indexFile[displayName]).toBe(Component);
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['exported-top-level'](testInfo, e));
            }
        });
    },
    /** Ensures component has top level file in package/src/componentName */ 'has-top-level-file': (testInfo)=>{
        if (testInfo.isInternal) {
            return;
        }
        it(`has corresponding top-level file 'package/src/Component' (has-top-level-file)`, ()=>{
            try {
                const { displayName, componentPath, Component } = testInfo;
                const topLevelFile = require(_path.join((0, _index.getPackagePath)(componentPath), 'src', displayName));
                expect(topLevelFile[displayName]).toBe(Component);
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['has-top-level-file'](testInfo, e));
            }
        });
    },
    /** Ensures aria attributes are kebab cased */ 'kebab-aria-attributes': (testInfo, componentInfo)=>{
        it(`uses kebab-case for aria attributes (kebab-aria-attributes)`, ()=>{
            const invalidProps = Object.keys(componentInfo.props).filter((prop)=>prop.startsWith('aria') && !/^aria-[a-z]+$/.test(prop));
            try {
                expect(invalidProps).toEqual([]);
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['kebab-aria-attributes'](testInfo, invalidProps));
            }
        });
    },
    // TODO: Test last word of callback name against list of valid verbs
    /** Ensures that components have consistent custom callback names i.e. on[Part][Event] */ 'consistent-callback-names': (testInfo, componentInfo)=>{
        it(`has consistent custom callback names (consistent-callback-names)`, ()=>{
            var _testOptions_consistentcallbacknames;
            const { testOptions = {} } = testInfo;
            const propNames = Object.keys(componentInfo.props);
            const ignoreProps = ((_testOptions_consistentcallbacknames = testOptions['consistent-callback-names']) === null || _testOptions_consistentcallbacknames === void 0 ? void 0 : _testOptions_consistentcallbacknames.ignoreProps) || [];
            const invalidProps = propNames.filter((propName)=>{
                if (!ignoreProps.includes(propName) && CALLBACK_REGEX.test(propName)) {
                    const words = propName.slice(2).match(/[A-Z][a-z]+/g);
                    if (words) {
                        // Make sure last word doesn't end with ed
                        const lastWord = words[words.length - 1];
                        return lastWord.endsWith('ed');
                    }
                }
                return false;
            });
            try {
                expect(invalidProps).toEqual([]);
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['consistent-callback-names'](testInfo, invalidProps));
            }
        });
    },
    /**
   * Ensures that components have consistent callback arguments (ev, data)
   * @deprecated this test is for existing callbacks. The newly added callbacks' type will be guarded by eslint rule consistent-callback-type
   */ 'consistent-callback-args': (testInfo, componentInfo, tsProgram)=>{
        it('has consistent custom callback arguments (consistent-callback-args)', ()=>{
            var _testOptions_consistentcallbackargs;
            const { testOptions = {} } = testInfo;
            const propNames = Object.keys(componentInfo.props);
            const legacyCallbacks = ((_testOptions_consistentcallbackargs = testOptions['consistent-callback-args']) === null || _testOptions_consistentcallbackargs === void 0 ? void 0 : _testOptions_consistentcallbackargs.legacyCallbacks) || [];
            // verify that legacyCallbacks option contains real props:
            const legacyCallbacksNotInProp = legacyCallbacks.filter((legacyCallback)=>!propNames.includes(legacyCallback));
            if (legacyCallbacksNotInProp.length) {
                throw new Error([
                    `Option "consistent-callback-args.legacyCallbacks" contains "${legacyCallbacksNotInProp.join(', ')}" prop,`,
                    'which is not present in component props.'
                ].join(' '));
            }
            const invalidProps = propNames.reduce((errors, propName)=>{
                if (legacyCallbacks.includes(propName)) {
                    const propInfo = componentInfo.props[propName];
                    if (!propInfo.declarations) {
                        throw new Error([
                            `Definition for "${propName}" does not have ".declarations" produced by "react-docgen-typescript".`,
                            'Please report a bug in Fluent UI repo if this happens. Include in a bug report details about file',
                            'where it happens and used interfaces.'
                        ].join(' '));
                    }
                    if (propInfo.declarations.length !== 1) {
                        throw new Error([
                            `Definition for "${propName}" has multiple elements in ".declarations" produced by `,
                            `"react-docgen-typescript".`,
                            'Please report a bug in Fluent UI repo if this happens. Include in a bug report details about file',
                            'where it happens and used interfaces.'
                        ].join(' '));
                    }
                    const rootFileName = propInfo.declarations[0].fileName;
                    const propsTypeName = propInfo.declarations[0].name;
                    try {
                        (0, _index.validateCallbackArguments)((0, _index.getCallbackArguments)(tsProgram, rootFileName, propsTypeName, propName));
                    } catch (err) {
                        console.log('err', err);
                        return {
                            ...errors,
                            [propName]: err
                        };
                    }
                }
                return errors;
            }, {});
            try {
                expect(invalidProps).toEqual({});
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['consistent-callback-args'](testInfo, invalidProps));
            }
        });
    },
    /** If the primary slot is specified, it receives native props other than 'className' and 'style' */ 'primary-slot-gets-native-props': (testInfo)=>{
        it(`applies correct native props to the primary and root slots (primary-slot-gets-native-props)`, ()=>{
            try {
                const { Component, requiredProps, primarySlot = 'root', renderOptions } = testInfo;
                // This test only applies if this component has a primary slot other than 'root'
                // (this also prevents the test from running for northstar and v8)
                if (primarySlot === 'root') {
                    return;
                }
                // Add this data attribute directly to the primary slot so that its DOM node can be
                // found to verify that the props went to the correct element
                const primarySlotDataTag = 'data-primary-slot';
                // Add these values to the component's props to make sure they are forwarded to the appropriate slot
                const ref = /*#__PURE__*/ _react.createRef();
                const testDataAttribute = 'data-conformance-test'; // A data attribute is a proxy for any arbitrary native prop
                const testClass = 'conformance-test-class-name';
                const testStyleFontFamily = 'conformance-test-font-family';
                const mergedProps = {
                    ...requiredProps,
                    [primarySlot]: {
                        [primarySlotDataTag]: true
                    },
                    ref,
                    className: testClass,
                    style: {
                        fontFamily: testStyleFontFamily
                    },
                    [testDataAttribute]: testDataAttribute
                };
                const { container } = (0, _react1.render)(/*#__PURE__*/ _react.createElement(Component, mergedProps), renderOptions);
                const rootNode = container.firstElementChild;
                expect(rootNode).toBeTruthy();
                (0, _react1.act)(()=>{
                    // Find the node that represents the primary slot, searching for its data attribute
                    const primaryNode = rootNode.querySelector(`[${primarySlotDataTag}]`);
                    // We should have found the primary slot's node
                    expect(primaryNode).toBeInstanceOf(HTMLElement);
                    if (!(primaryNode instanceof HTMLElement)) {
                        return;
                    }
                    // className and style should go the *root* slot
                    expect(classListToStrings(rootNode.classList)).toContain(testClass);
                    expect(rootNode.style.fontFamily).toEqual(testStyleFontFamily);
                    // ... and not the primary slot
                    expect(classListToStrings(primaryNode.classList)).not.toContain(testClass);
                    expect(primaryNode.style.fontFamily).not.toEqual(testStyleFontFamily);
                    // Ref and all other native props should go to the *primary* slot
                    expect(primaryNode).toBe(ref.current);
                    expect(primaryNode.getAttribute(testDataAttribute)).toEqual(testDataAttribute);
                    // ... and not the root slot
                    expect(rootNode).not.toBe(ref.current);
                    expect(rootNode.getAttribute(testDataAttribute)).not.toEqual(testDataAttribute);
                });
            } catch (e) {
                throw new Error(_defaultErrorMessages.defaultErrorMessages['primary-slot-gets-native-props'](testInfo, e));
            }
        });
    }
};
function classListToStrings(classList) {
    // We should be able to just do [...classList] but that requires lib: dom.iterable in tsconfig.json.
    // Due to path aliases, react-conformance gets type-checked with each converged package,
    // so we'd need to add dom.iterable in all converged packages too.
    // This function is a workaround.
    const result = [];
    for(let i = 0; i < classList.length; i++){
        result.push(classList[i]);
    }
    return result;
}
