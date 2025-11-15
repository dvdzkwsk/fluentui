"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toHaveMergeClassesCalledTimesWithClassName", {
    enumerable: true,
    get: function() {
        return toHaveMergeClassesCalledTimesWithClassName;
    }
});
const toHaveMergeClassesCalledTimesWithClassName = (result, className, expectedTimes)=>{
    let pass = true;
    let message = '';
    const callCount = result.reduce((acc, classesList)=>{
        if (classesList.includes(className)) {
            return acc + 1;
        }
        return acc;
    }, 0);
    if (callCount !== expectedTimes) {
        pass = false;
        message = [
            `There were ${callCount} call(s) of mergeClasses() that contain "${className}".`,
            `Expected: ${expectedTimes}`,
            `Got: ${callCount}`,
            `Last call: ${result[result.length - 1].join(' ')}`
        ].join('\n');
    }
    return {
        pass,
        message: ()=>message
    };
};
