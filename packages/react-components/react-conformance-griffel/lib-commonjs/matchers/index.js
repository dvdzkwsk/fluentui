"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _toContainClassNameLastInCalls = require("./toContainClassNameLastInCalls");
const _toHaveMergeClassesCalledTimesWithClassName = require("./toHaveMergeClassesCalledTimesWithClassName");
expect.extend({
    toContainClassNameLastInCalls: _toContainClassNameLastInCalls.toContainClassNameLastInCalls,
    toHaveMergeClassesCalledTimesWithClassName: _toHaveMergeClassesCalledTimesWithClassName.toHaveMergeClassesCalledTimesWithClassName
});
