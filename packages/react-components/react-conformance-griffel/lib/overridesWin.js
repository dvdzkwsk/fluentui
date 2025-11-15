import './matchers/index';
export const OVERRIDES_WIN_TEST_NAME = 'make-styles-overrides-win';
/**
 * Requires a component from a file path, required for proper mocking.
 */ async function getReactComponent(componentPath, testInfo) {
    const componentModule = await import(componentPath);
    if (testInfo.useDefaultExport) {
        return componentModule.default;
    }
    return componentModule[testInfo.displayName];
}
/**
 * A conformance test for mergeClasses() that ensures that a classname from props is passed as a last param,
 * i.e. ensures that user's overrides have higher priority.
 */ export const overridesWin = (testInfo)=>{
    const testOptions = testInfo.testOptions;
    let container = null;
    const mergeClasses = jest.fn().mockImplementation(()=>'');
    jest.mock('@griffel/react', ()=>{
        const module = jest.requireActual('@griffel/react');
        return {
            ...module,
            mergeClasses
        };
    });
    beforeEach(()=>{
        var _testInfo_renderOptions;
        jest.clearAllMocks();
        jest.resetModules();
        if ((_testInfo_renderOptions = testInfo.renderOptions) === null || _testInfo_renderOptions === void 0 ? void 0 : _testInfo_renderOptions.container) {
            container = testInfo.renderOptions.container;
        } else {
            container = document.createElement('div');
            document.body.appendChild(container);
        }
    });
    afterEach(async ()=>{
        if (container) {
            document.body.removeChild(container);
        }
        container = null;
    });
    it('"className" passed last wins', async ()=>{
        var _testOptions_OVERRIDES_WIN_TEST_NAME;
        // To mock mergeClasses() we need require a component again, this could be done via "jest.isolateModules()"
        // but a bug that prevents it was fixed only in Jest 27.
        // https://github.com/facebook/jest/pull/10963
        //
        // React should be imported after "jest.resetModules()" as otherwise we will will get two copies: one from this
        // test, a second from a component itself.
        // https://github.com/facebook/jest/issues/8987#issuecomment-584898030
        /* eslint-disable @fluentui/no-global-react */ const React = await import('react');
        const className = 'make-styles-classname';
        const Component = await getReactComponent(testInfo.componentPath, testInfo);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const element = React.createElement(Component, {
            ...testInfo.requiredProps,
            className
        });
        const { unmount } = await render(element, container);
        expect(mergeClasses.mock.calls.length).toBeGreaterThanOrEqual(1);
        expect(mergeClasses.mock.calls).toContainClassNameLastInCalls(className);
        expect(mergeClasses.mock.calls).toHaveMergeClassesCalledTimesWithClassName(className, (testOptions === null || testOptions === void 0 ? void 0 : (_testOptions_OVERRIDES_WIN_TEST_NAME = testOptions[OVERRIDES_WIN_TEST_NAME]) === null || _testOptions_OVERRIDES_WIN_TEST_NAME === void 0 ? void 0 : _testOptions_OVERRIDES_WIN_TEST_NAME.callCount) || 1);
        unmount();
    });
};
/**
 * Utility to render React elements that works with both React 17 and React 18
 */ async function render(element, container) {
    const React = await import('react');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - ReactDOMClient is not available in React 17
    const ReactDOMClient = await import('react-dom/client').catch(()=>null);
    let unmount;
    // Check if we have React 18's createRoot (react-dom/client)
    if (ReactDOMClient && 'createRoot' in ReactDOMClient) {
        // React 18 approach
        const root = ReactDOMClient.createRoot(container);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - act doesn't exist on react in React 17
        React.act(()=>{
            root.render(element);
        });
        unmount = ()=>{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - act doesn't exist on react in React 17
            React.act(()=>{
                root.unmount();
            });
        };
    } else {
        // augment legacy react-dom APIs when using React 18 types
        const ReactDOM = await import('react-dom');
        /* eslint-disable @typescript-eslint/no-deprecated -- This is expect to support React 17 */ ReactDOM.render(element, container);
        unmount = ()=>ReactDOM.unmountComponentAtNode(container);
    /* eslint-enable @typescript-eslint/no-deprecated */ }
    return {
        container,
        unmount
    };
}
