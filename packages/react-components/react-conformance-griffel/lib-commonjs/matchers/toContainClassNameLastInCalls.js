"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toContainClassNameLastInCalls", {
    enumerable: true,
    get: function() {
        return toContainClassNameLastInCalls;
    }
});
const toContainClassNameLastInCalls = (result, className)=>{
    let pass = true;
    let message = '';
    result.forEach((classesList)=>{
        const indexInClassList = classesList.indexOf(className);
        if (indexInClassList >= 0) {
            if (classesList.indexOf(className, indexInClassList + 1) !== -1) {
                pass = false;
                message = [
                    `A call to mergeClasses() contains "${className}" more than once.`,
                    `Got: ${classesList.join(' ')}`
                ].join(' ');
                return;
            }
            if (indexInClassList !== classesList.length - 1) {
                pass = false;
                message = [
                    `A call to mergeClasses() does not "${className}" as a last param.`,
                    `Got: ${classesList.join(' ')}`
                ].join(' ');
                return;
            }
        }
    });
    return {
        pass,
        message: ()=>message
    };
};
