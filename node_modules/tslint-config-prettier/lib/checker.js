"use strict";
exports.__esModule = true;
var tslint_1 = require("tslint");
// tslint:disable-next-line:no-var-requires
var tslintConfigPrettier = require("..");
exports.check = function (configFilePath) {
    if (typeof configFilePath !== "string") {
        throw new Error("Usage: tslint-config-prettier-check <pathToConfigFile>");
    }
    var _a = tslint_1.Linter.loadConfigurationFromPath(configFilePath), rules = _a.rules, jsRules = _a.jsRules;
    var conflictRules = [];
    Object.keys(tslintConfigPrettier.rules).forEach(function (conflictRuleName) {
        if (isConflict(conflictRuleName, rules) || isConflict(conflictRuleName, jsRules)) {
            conflictRules.push(conflictRuleName);
        }
    });
    if (conflictRules.length !== 0) {
        throw new Error("Conflict rule(s) detected in " + configFilePath + ":\n" + conflictRules.join("\n"));
    }
    // tslint:disable-next-line:no-console
    console.log("No conflict rule detected in " + configFilePath);
};
function isConflict(conflictRuleName, rules) {
    return (rules.has(conflictRuleName) &&
        rules.get(conflictRuleName).ruleSeverity !== "off");
}
