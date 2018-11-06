"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exceptions_public_1 = require("./exceptions_public");
var lang_extensions_1 = require("../lang/lang_extensions");
var checks_1 = require("./grammar/checks");
var utils_1 = require("../utils/utils");
var follow_1 = require("./grammar/follow");
var tokens_public_1 = require("../scan/tokens_public");
var lookahead_1 = require("./grammar/lookahead");
var gast_builder_1 = require("./gast_builder");
var interpreter_1 = require("./grammar/interpreter");
var constants_1 = require("./constants");
var tokens_1 = require("../scan/tokens");
var cst_1 = require("./cst/cst");
var keys_1 = require("./grammar/keys");
var cst_visitor_1 = require("./cst/cst_visitor");
var errors_public_1 = require("./errors_public");
var gast_public_1 = require("./grammar/gast/gast_public");
var gast_resolver_public_1 = require("./grammar/gast/gast_resolver_public");
var IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException";
exports.END_OF_FILE = tokens_public_1.createTokenInstance(tokens_public_1.EOF, "", NaN, NaN, NaN, NaN, NaN, NaN);
Object.freeze(exports.END_OF_FILE);
var DEFAULT_PARSER_CONFIG = Object.freeze({
    recoveryEnabled: false,
    maxLookahead: 4,
    ignoredIssues: {},
    dynamicTokensEnabled: false,
    outputCst: false,
    errorMessageProvider: errors_public_1.defaultParserErrorProvider,
    serializedGrammar: null
});
var DEFAULT_RULE_CONFIG = Object.freeze({
    recoveryValueFunc: function () { return undefined; },
    resyncEnabled: true
});
var ParserDefinitionErrorType;
(function (ParserDefinitionErrorType) {
    ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_RULE_NAME"] = 0] = "INVALID_RULE_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["DUPLICATE_RULE_NAME"] = 1] = "DUPLICATE_RULE_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_RULE_OVERRIDE"] = 2] = "INVALID_RULE_OVERRIDE";
    ParserDefinitionErrorType[ParserDefinitionErrorType["DUPLICATE_PRODUCTIONS"] = 3] = "DUPLICATE_PRODUCTIONS";
    ParserDefinitionErrorType[ParserDefinitionErrorType["UNRESOLVED_SUBRULE_REF"] = 4] = "UNRESOLVED_SUBRULE_REF";
    ParserDefinitionErrorType[ParserDefinitionErrorType["LEFT_RECURSION"] = 5] = "LEFT_RECURSION";
    ParserDefinitionErrorType[ParserDefinitionErrorType["NONE_LAST_EMPTY_ALT"] = 6] = "NONE_LAST_EMPTY_ALT";
    ParserDefinitionErrorType[ParserDefinitionErrorType["AMBIGUOUS_ALTS"] = 7] = "AMBIGUOUS_ALTS";
    ParserDefinitionErrorType[ParserDefinitionErrorType["CONFLICT_TOKENS_RULES_NAMESPACE"] = 8] = "CONFLICT_TOKENS_RULES_NAMESPACE";
    ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_TOKEN_NAME"] = 9] = "INVALID_TOKEN_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_NESTED_RULE_NAME"] = 10] = "INVALID_NESTED_RULE_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["DUPLICATE_NESTED_NAME"] = 11] = "DUPLICATE_NESTED_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["NO_NON_EMPTY_LOOKAHEAD"] = 12] = "NO_NON_EMPTY_LOOKAHEAD";
    ParserDefinitionErrorType[ParserDefinitionErrorType["AMBIGUOUS_PREFIX_ALTS"] = 13] = "AMBIGUOUS_PREFIX_ALTS";
    ParserDefinitionErrorType[ParserDefinitionErrorType["TOO_MANY_ALTS"] = 14] = "TOO_MANY_ALTS";
})(ParserDefinitionErrorType = exports.ParserDefinitionErrorType || (exports.ParserDefinitionErrorType = {}));
function EMPTY_ALT(value) {
    if (value === void 0) { value = undefined; }
    return function () {
        return value;
    };
}
exports.EMPTY_ALT = EMPTY_ALT;
var EOF_FOLLOW_KEY = {};
var Parser = /** @class */ (function () {
    function Parser(input, tokenVocabulary, config) {
        if (config === void 0) { config = DEFAULT_PARSER_CONFIG; }
        // caching
        this.resyncFollows = new lang_extensions_1.HashTable();
        this.allRuleNames = [];
        this.lookAheadFuncsCache = [];
        this.gastProductionsCache = new lang_extensions_1.HashTable();
        this._errors = [];
        // These configuration properties are also assigned in the constructor
        // This is a little bit of duplication but seems to help with performance regression on V8
        // Probably due to hidden class changes.
        /**
         * This flag enables or disables error recovery (fault tolerance) of the parser.
         * If this flag is disabled the parser will halt on the first error.
         */
        this.recoveryEnabled = DEFAULT_PARSER_CONFIG.recoveryEnabled;
        this.dynamicTokensEnabled = DEFAULT_PARSER_CONFIG.dynamicTokensEnabled;
        this.maxLookahead = DEFAULT_PARSER_CONFIG.maxLookahead;
        this.ignoredIssues = DEFAULT_PARSER_CONFIG.ignoredIssues;
        this.outputCst = DEFAULT_PARSER_CONFIG.outputCst;
        this.serializedGrammar = DEFAULT_PARSER_CONFIG.serializedGrammar;
        // adapters
        this.errorMessageProvider = DEFAULT_PARSER_CONFIG.errorMessageProvider;
        this.isBackTrackingStack = [];
        this.className = "Parser";
        this.RULE_STACK = [];
        this.RULE_OCCURRENCE_STACK = [];
        this.CST_STACK = [];
        this.tokensMap = {};
        this.firstAfterRepMap = new lang_extensions_1.HashTable();
        this.definitionErrors = [];
        this.definedRulesNames = [];
        this.shortRuleNameToFull = new lang_extensions_1.HashTable();
        this.fullRuleNameToShort = new lang_extensions_1.HashTable();
        // The shortName Index must be coded "after" the first 8bits to enable building unique lookahead keys
        this.ruleShortNameIdx = 256;
        this.tokenMatcher = tokens_1.tokenStructuredMatcherNoCategories;
        this.LAST_EXPLICIT_RULE_STACK = [];
        this.selfAnalysisDone = false;
        // lexerState
        this.tokVector = [];
        this.tokVectorLength = 0;
        this.currIdx = -1;
        this.input = input;
        // configuration
        this.recoveryEnabled = utils_1.has(config, "recoveryEnabled")
            ? config.recoveryEnabled
            : DEFAULT_PARSER_CONFIG.recoveryEnabled;
        // performance optimization, NOOP will be inlined which
        // effectively means that this optional feature does not exist
        // when not used.
        if (!this.recoveryEnabled) {
            this.attemptInRepetitionRecovery = utils_1.NOOP;
        }
        this.dynamicTokensEnabled = utils_1.has(config, "dynamicTokensEnabled")
            ? config.dynamicTokensEnabled
            : DEFAULT_PARSER_CONFIG.dynamicTokensEnabled;
        this.maxLookahead = utils_1.has(config, "maxLookahead")
            ? config.maxLookahead
            : DEFAULT_PARSER_CONFIG.maxLookahead;
        this.ignoredIssues = utils_1.has(config, "ignoredIssues")
            ? config.ignoredIssues
            : DEFAULT_PARSER_CONFIG.ignoredIssues;
        this.outputCst = utils_1.has(config, "outputCst")
            ? config.outputCst
            : DEFAULT_PARSER_CONFIG.outputCst;
        this.errorMessageProvider = utils_1.defaults(config.errorMessageProvider, DEFAULT_PARSER_CONFIG.errorMessageProvider);
        this.serializedGrammar = utils_1.has(config, "serializedGrammar")
            ? config.serializedGrammar
            : DEFAULT_PARSER_CONFIG.serializedGrammar;
        if (!this.outputCst) {
            this.cstInvocationStateUpdate = utils_1.NOOP;
            this.cstFinallyStateUpdate = utils_1.NOOP;
            this.cstPostTerminal = utils_1.NOOP;
            this.cstPostNonTerminal = utils_1.NOOP;
            this.getLastExplicitRuleShortName = this.getLastExplicitRuleShortNameNoCst;
            this.getPreviousExplicitRuleShortName = this.getPreviousExplicitRuleShortNameNoCst;
            this.getLastExplicitRuleOccurrenceIndex = this.getLastExplicitRuleOccurrenceIndexNoCst;
            this.manyInternal = this.manyInternalNoCst;
            this.orInternal = this.orInternalNoCst;
            this.optionInternal = this.optionInternalNoCst;
            this.atLeastOneInternal = this.atLeastOneInternalNoCst;
            this.manySepFirstInternal = this.manySepFirstInternalNoCst;
            this.atLeastOneSepFirstInternal = this.atLeastOneSepFirstInternalNoCst;
        }
        this.className = lang_extensions_1.classNameFromInstance(this);
        if (utils_1.isArray(tokenVocabulary)) {
            this.tokensMap = utils_1.reduce(tokenVocabulary, function (acc, tokenClazz) {
                acc[tokens_public_1.tokenName(tokenClazz)] = tokenClazz;
                return acc;
            }, {});
        }
        else if (utils_1.has(tokenVocabulary, "modes") &&
            utils_1.every(utils_1.flatten(utils_1.values(tokenVocabulary.modes)), tokens_1.isTokenType)) {
            var allTokenTypes = utils_1.flatten(utils_1.values(tokenVocabulary.modes));
            var uniqueTokens = utils_1.uniq(allTokenTypes);
            this.tokensMap = utils_1.reduce(uniqueTokens, function (acc, tokenClazz) {
                acc[tokens_public_1.tokenName(tokenClazz)] = tokenClazz;
                return acc;
            }, {});
        }
        else if (utils_1.isObject(tokenVocabulary)) {
            this.tokensMap = utils_1.cloneObj(tokenVocabulary);
        }
        else {
            throw new Error("<tokensDictionary> argument must be An Array of Token constructors" +
                " A dictionary of Token constructors or an IMultiModeLexerDefinition");
        }
        var noTokenCategoriesUsed = utils_1.every(utils_1.values(tokenVocabulary), function (tokenConstructor) { return utils_1.isEmpty(tokenConstructor.categoryMatches); });
        this.tokenMatcher = noTokenCategoriesUsed
            ? tokens_1.tokenStructuredMatcherNoCategories
            : tokens_1.tokenStructuredMatcher;
        // always add EOF to the tokenNames -> constructors map. it is useful to assure all the input has been
        // parsed with a clear error message ("expecting EOF but found ...")
        /* tslint:disable */
        this.tokensMap["EOF"] = tokens_public_1.EOF;
        /* tslint:enable */
        // Because ES2015+ syntax should be supported for creating Token classes
        // We cannot assume that the Token classes were created using the "extendToken" utilities
        // Therefore we must augment the Token classes both on Lexer initialization and on Parser initialization
        tokens_1.augmentTokenTypes(utils_1.values(this.tokensMap));
    }
    /**
     *  @deprecated use the **instance** method with the same name instead
     */
    Parser.performSelfAnalysis = function (parserInstance) {
        parserInstance.performSelfAnalysis();
    };
    Parser.prototype.performSelfAnalysis = function () {
        var _this = this;
        var defErrorsMsgs;
        this.selfAnalysisDone = true;
        var className = lang_extensions_1.classNameFromInstance(this);
        var productions = this.gastProductionsCache;
        if (this.serializedGrammar) {
            var rules = gast_builder_1.deserializeGrammar(this.serializedGrammar, this.tokensMap);
            utils_1.forEach(rules, function (rule) {
                _this.gastProductionsCache.put(rule.name, rule);
            });
        }
        var resolverErrors = gast_resolver_public_1.resolveGrammar({
            rules: productions.values()
        });
        this.definitionErrors.push.apply(this.definitionErrors, resolverErrors); // mutability for the win?
        // only perform additional grammar validations IFF no resolving errors have occurred.
        // as unresolved grammar may lead to unhandled runtime exceptions in the follow up validations.
        if (utils_1.isEmpty(resolverErrors)) {
            var validationErrors = gast_resolver_public_1.validateGrammar({
                rules: productions.values(),
                maxLookahead: this.maxLookahead,
                tokenTypes: utils_1.values(this.tokensMap),
                ignoredIssues: this.ignoredIssues,
                errMsgProvider: errors_public_1.defaultGrammarValidatorErrorProvider,
                grammarName: className
            });
            this.definitionErrors.push.apply(this.definitionErrors, validationErrors); // mutability for the win?
        }
        if (utils_1.isEmpty(this.definitionErrors)) {
            // this analysis may fail if the grammar is not perfectly valid
            var allFollows = follow_1.computeAllProdsFollows(productions.values());
            this.resyncFollows = allFollows;
        }
        var cstAnalysisResult = cst_1.analyzeCst(productions.values(), this.fullRuleNameToShort);
        this.allRuleNames = cstAnalysisResult.allRuleNames;
        if (!Parser.DEFER_DEFINITION_ERRORS_HANDLING &&
            !utils_1.isEmpty(this.definitionErrors)) {
            defErrorsMsgs = utils_1.map(this.definitionErrors, function (defError) { return defError.message; });
            throw new Error("Parser Definition Errors detected:\n " + defErrorsMsgs.join("\n-------------------------------\n"));
        }
    };
    Object.defineProperty(Parser.prototype, "errors", {
        get: function () {
            return utils_1.cloneArr(this._errors);
        },
        set: function (newErrors) {
            this._errors = newErrors;
        },
        enumerable: true,
        configurable: true
    });
    Parser.prototype.reset = function () {
        this.resetLexerState();
        this.isBackTrackingStack = [];
        this.errors = [];
        this.RULE_STACK = [];
        this.LAST_EXPLICIT_RULE_STACK = [];
        this.CST_STACK = [];
        this.RULE_OCCURRENCE_STACK = [];
    };
    Parser.prototype.isAtEndOfInput = function () {
        return this.tokenMatcher(this.LA(1), tokens_public_1.EOF);
    };
    Parser.prototype.getBaseCstVisitorConstructor = function () {
        if (utils_1.isUndefined(this.baseCstVisitorConstructor)) {
            var newBaseCstVisitorConstructor = cst_visitor_1.createBaseSemanticVisitorConstructor(this.className, this.allRuleNames);
            this.baseCstVisitorConstructor = newBaseCstVisitorConstructor;
            return newBaseCstVisitorConstructor;
        }
        return this.baseCstVisitorConstructor;
    };
    Parser.prototype.getBaseCstVisitorConstructorWithDefaults = function () {
        if (utils_1.isUndefined(this.baseCstVisitorWithDefaultsConstructor)) {
            var newConstructor = cst_visitor_1.createBaseVisitorConstructorWithDefaults(this.className, this.allRuleNames, this.getBaseCstVisitorConstructor());
            this.baseCstVisitorWithDefaultsConstructor = newConstructor;
            return newConstructor;
        }
        return this.baseCstVisitorWithDefaultsConstructor;
    };
    Parser.prototype.getGAstProductions = function () {
        return this.gastProductionsCache;
    };
    Parser.prototype.getSerializedGastProductions = function () {
        return gast_public_1.serializeGrammar(this.gastProductionsCache.values());
    };
    Parser.prototype.computeContentAssist = function (startRuleName, precedingInput) {
        var startRuleGast = this.gastProductionsCache.get(startRuleName);
        if (utils_1.isUndefined(startRuleGast)) {
            throw Error("Rule ->" + startRuleName + "<- does not exist in this grammar.");
        }
        return interpreter_1.nextPossibleTokensAfter([startRuleGast], precedingInput, this.tokenMatcher, this.maxLookahead);
    };
    Parser.prototype.BACKTRACK = function (grammarRule, args) {
        return function () {
            // save org state
            this.isBackTrackingStack.push(1);
            var orgState = this.saveRecogState();
            try {
                grammarRule.apply(this, args);
                // if no exception was thrown we have succeed parsing the rule.
                return true;
            }
            catch (e) {
                if (exceptions_public_1.isRecognitionException(e)) {
                    return false;
                }
                else {
                    throw e;
                }
            }
            finally {
                this.reloadRecogState(orgState);
                this.isBackTrackingStack.pop();
            }
        };
    };
    Parser.prototype.SAVE_ERROR = function (error) {
        if (exceptions_public_1.isRecognitionException(error)) {
            error.context = {
                ruleStack: this.getHumanReadableRuleStack(),
                ruleOccurrenceStack: utils_1.cloneArr(this.RULE_OCCURRENCE_STACK)
            };
            this._errors.push(error);
            return error;
        }
        else {
            throw Error("Trying to save an Error which is not a RecognitionException");
        }
    };
    Parser.prototype.isBackTracking = function () {
        return !utils_1.isEmpty(this.isBackTrackingStack);
    };
    Parser.prototype.getCurrRuleFullName = function () {
        var shortName = this.getLastExplicitRuleShortName();
        return this.shortRuleNameToFull.get(shortName);
    };
    Parser.prototype.shortRuleNameToFullName = function (shortName) {
        return this.shortRuleNameToFull.get(shortName);
    };
    Parser.prototype.getHumanReadableRuleStack = function () {
        var _this = this;
        if (!utils_1.isEmpty(this.LAST_EXPLICIT_RULE_STACK)) {
            return utils_1.map(this.LAST_EXPLICIT_RULE_STACK, function (currIdx) {
                return _this.shortRuleNameToFullName(_this.RULE_STACK[currIdx]);
            });
        }
        else {
            return utils_1.map(this.RULE_STACK, function (currShortName) {
                return _this.shortRuleNameToFullName(currShortName);
            });
        }
    };
    // Parsing DSL
    Parser.prototype.CONSUME = function (tokType, options) {
        return this.consumeInternal(tokType, 0, options);
    };
    Parser.prototype.CONSUME1 = function (tokType, options) {
        return this.consumeInternal(tokType, 1, options);
    };
    Parser.prototype.CONSUME2 = function (tokType, options) {
        return this.consumeInternal(tokType, 2, options);
    };
    Parser.prototype.CONSUME3 = function (tokType, options) {
        return this.consumeInternal(tokType, 3, options);
    };
    Parser.prototype.CONSUME4 = function (tokType, options) {
        return this.consumeInternal(tokType, 4, options);
    };
    Parser.prototype.CONSUME5 = function (tokType, options) {
        return this.consumeInternal(tokType, 5, options);
    };
    Parser.prototype.CONSUME6 = function (tokType, options) {
        return this.consumeInternal(tokType, 6, options);
    };
    Parser.prototype.CONSUME7 = function (tokType, options) {
        return this.consumeInternal(tokType, 7, options);
    };
    Parser.prototype.CONSUME8 = function (tokType, options) {
        return this.consumeInternal(tokType, 8, options);
    };
    Parser.prototype.CONSUME9 = function (tokType, options) {
        return this.consumeInternal(tokType, 9, options);
    };
    Parser.prototype.SUBRULE = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 0, options);
    };
    Parser.prototype.SUBRULE1 = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 1, options);
    };
    Parser.prototype.SUBRULE2 = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 2, options);
    };
    Parser.prototype.SUBRULE3 = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 3, options);
    };
    Parser.prototype.SUBRULE4 = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 4, options);
    };
    Parser.prototype.SUBRULE5 = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 5, options);
    };
    Parser.prototype.SUBRULE6 = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 6, options);
    };
    Parser.prototype.SUBRULE7 = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 7, options);
    };
    Parser.prototype.SUBRULE8 = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 8, options);
    };
    Parser.prototype.SUBRULE9 = function (ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 9, options);
    };
    Parser.prototype.OPTION = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 0);
    };
    Parser.prototype.OPTION1 = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 1);
    };
    Parser.prototype.OPTION2 = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 2);
    };
    Parser.prototype.OPTION3 = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 3);
    };
    Parser.prototype.OPTION4 = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 4);
    };
    Parser.prototype.OPTION5 = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 5);
    };
    Parser.prototype.OPTION6 = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 6);
    };
    Parser.prototype.OPTION7 = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 7);
    };
    Parser.prototype.OPTION8 = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 8);
    };
    Parser.prototype.OPTION9 = function (actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 9);
    };
    Parser.prototype.OR = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 0);
    };
    Parser.prototype.OR1 = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 1);
    };
    Parser.prototype.OR2 = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 2);
    };
    Parser.prototype.OR3 = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 3);
    };
    Parser.prototype.OR4 = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 4);
    };
    Parser.prototype.OR5 = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 5);
    };
    Parser.prototype.OR6 = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 6);
    };
    Parser.prototype.OR7 = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 7);
    };
    Parser.prototype.OR8 = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 8);
    };
    Parser.prototype.OR9 = function (altsOrOpts) {
        return this.orInternal(altsOrOpts, 9);
    };
    Parser.prototype.MANY = function (actionORMethodDef) {
        return this.manyInternal(0, actionORMethodDef, []);
    };
    Parser.prototype.MANY1 = function (actionORMethodDef) {
        return this.manyInternal(1, actionORMethodDef, []);
    };
    Parser.prototype.MANY2 = function (actionORMethodDef) {
        return this.manyInternal(2, actionORMethodDef, []);
    };
    Parser.prototype.MANY3 = function (actionORMethodDef) {
        return this.manyInternal(3, actionORMethodDef, []);
    };
    Parser.prototype.MANY4 = function (actionORMethodDef) {
        return this.manyInternal(4, actionORMethodDef, []);
    };
    Parser.prototype.MANY5 = function (actionORMethodDef) {
        return this.manyInternal(5, actionORMethodDef, []);
    };
    Parser.prototype.MANY6 = function (actionORMethodDef) {
        return this.manyInternal(6, actionORMethodDef, []);
    };
    Parser.prototype.MANY7 = function (actionORMethodDef) {
        return this.manyInternal(7, actionORMethodDef, []);
    };
    Parser.prototype.MANY8 = function (actionORMethodDef) {
        return this.manyInternal(8, actionORMethodDef, []);
    };
    Parser.prototype.MANY9 = function (actionORMethodDef) {
        return this.manyInternal(9, actionORMethodDef, []);
    };
    Parser.prototype.MANY_SEP = function (options) {
        return this.manySepFirstInternal(0, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.MANY_SEP1 = function (options) {
        return this.manySepFirstInternal(1, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.MANY_SEP2 = function (options) {
        return this.manySepFirstInternal(2, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.MANY_SEP3 = function (options) {
        return this.manySepFirstInternal(3, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.MANY_SEP4 = function (options) {
        return this.manySepFirstInternal(4, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.MANY_SEP5 = function (options) {
        return this.manySepFirstInternal(5, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.MANY_SEP6 = function (options) {
        return this.manySepFirstInternal(6, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.MANY_SEP7 = function (options) {
        return this.manySepFirstInternal(7, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.MANY_SEP8 = function (options) {
        return this.manySepFirstInternal(8, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.MANY_SEP9 = function (options) {
        return this.manySepFirstInternal(9, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE = function (actionORMethodDef) {
        return this.atLeastOneInternal(0, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE1 = function (actionORMethodDef) {
        return this.atLeastOneInternal(1, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE2 = function (actionORMethodDef) {
        return this.atLeastOneInternal(2, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE3 = function (actionORMethodDef) {
        return this.atLeastOneInternal(3, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE4 = function (actionORMethodDef) {
        return this.atLeastOneInternal(4, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE5 = function (actionORMethodDef) {
        return this.atLeastOneInternal(5, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE6 = function (actionORMethodDef) {
        return this.atLeastOneInternal(6, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE7 = function (actionORMethodDef) {
        return this.atLeastOneInternal(7, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE8 = function (actionORMethodDef) {
        return this.atLeastOneInternal(8, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE9 = function (actionORMethodDef) {
        return this.atLeastOneInternal(9, actionORMethodDef, []);
    };
    Parser.prototype.AT_LEAST_ONE_SEP = function (options) {
        return this.atLeastOneSepFirstInternal(0, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE_SEP1 = function (options) {
        return this.atLeastOneSepFirstInternal(1, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE_SEP2 = function (options) {
        return this.atLeastOneSepFirstInternal(2, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE_SEP3 = function (options) {
        return this.atLeastOneSepFirstInternal(3, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE_SEP4 = function (options) {
        return this.atLeastOneSepFirstInternal(4, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE_SEP5 = function (options) {
        return this.atLeastOneSepFirstInternal(5, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE_SEP6 = function (options) {
        return this.atLeastOneSepFirstInternal(6, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE_SEP7 = function (options) {
        return this.atLeastOneSepFirstInternal(7, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE_SEP8 = function (options) {
        return this.atLeastOneSepFirstInternal(8, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.AT_LEAST_ONE_SEP9 = function (options) {
        return this.atLeastOneSepFirstInternal(9, options, {
            values: [],
            separators: []
        });
    };
    Parser.prototype.RULE = function (name, implementation, 
    // TODO: how to describe the optional return type of CSTNode? T|CstNode is not good because it is not backward
    // compatible, T|any is very general...
    config) {
        if (config === void 0) { 
        // TODO: how to describe the optional return type of CSTNode? T|CstNode is not good because it is not backward
        // compatible, T|any is very general...
        config = DEFAULT_RULE_CONFIG; }
        if (utils_1.contains(this.definedRulesNames, name)) {
            var errMsg = errors_public_1.defaultGrammarValidatorErrorProvider.buildDuplicateRuleNameError({
                topLevelRule: name,
                grammarName: this.className
            });
            var error = {
                message: errMsg,
                type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
                ruleName: name
            };
            this.definitionErrors.push(error);
        }
        this.definedRulesNames.push(name);
        // only build the gast representation once.
        if (!this.gastProductionsCache.containsKey(name) &&
            !this.serializedGrammar) {
            var gastProduction = gast_builder_1.buildTopProduction(implementation.toString(), name, this.tokensMap);
            this.gastProductionsCache.put(name, gastProduction);
        }
        var ruleImplementation = this.defineRule(name, implementation, config);
        this[name] = ruleImplementation;
        return ruleImplementation;
    };
    Parser.prototype.OVERRIDE_RULE = function (name, impl, config) {
        if (config === void 0) { config = DEFAULT_RULE_CONFIG; }
        var ruleErrors = [];
        ruleErrors = ruleErrors.concat(checks_1.validateRuleIsOverridden(name, this.definedRulesNames, this.className));
        this.definitionErrors.push.apply(this.definitionErrors, ruleErrors); // mutability for the win
        // Avoid constructing the GAST if we have serialized it
        if (!this.serializedGrammar) {
            var gastProduction = gast_builder_1.buildTopProduction(impl.toString(), name, this.tokensMap);
            this.gastProductionsCache.put(name, gastProduction);
        }
        var ruleImplementation = this.defineRule(name, impl, config);
        this[name] = ruleImplementation;
        return ruleImplementation;
    };
    Parser.prototype.getTokenToInsert = function (tokType) {
        var tokToInsert = tokens_public_1.createTokenInstance(tokType, "", NaN, NaN, NaN, NaN, NaN, NaN);
        tokToInsert.isInsertedInRecovery = true;
        return tokToInsert;
    };
    Parser.prototype.canTokenTypeBeInsertedInRecovery = function (tokType) {
        return true;
    };
    Parser.prototype.ruleInvocationStateUpdate = function (shortName, fullName, idxInCallingRule) {
        this.RULE_OCCURRENCE_STACK.push(idxInCallingRule);
        this.RULE_STACK.push(shortName);
        // NOOP when cst is disabled
        this.cstInvocationStateUpdate(fullName, shortName);
    };
    Parser.prototype.ruleFinallyStateUpdate = function () {
        this.RULE_STACK.pop();
        this.RULE_OCCURRENCE_STACK.pop();
        // NOOP when cst is disabled
        this.cstFinallyStateUpdate();
        if (this.RULE_STACK.length === 0 && !this.isAtEndOfInput()) {
            var firstRedundantTok = this.LA(1);
            var errMsg = this.errorMessageProvider.buildNotAllInputParsedMessage({
                firstRedundant: firstRedundantTok,
                ruleName: this.getCurrRuleFullName()
            });
            this.SAVE_ERROR(new exceptions_public_1.NotAllInputParsedException(errMsg, firstRedundantTok));
        }
    };
    Parser.prototype.nestedRuleInvocationStateUpdate = function (nestedRuleName, shortNameKey) {
        this.RULE_OCCURRENCE_STACK.push(1);
        this.RULE_STACK.push(shortNameKey);
        this.cstNestedInvocationStateUpdate(nestedRuleName, shortNameKey);
    };
    Parser.prototype.nestedRuleFinallyStateUpdate = function () {
        this.RULE_STACK.pop();
        this.RULE_OCCURRENCE_STACK.pop();
        // NOOP when cst is disabled
        this.cstNestedFinallyStateUpdate();
    };
    Parser.prototype.getCurrentGrammarPath = function (tokType, tokIdxInRule) {
        var pathRuleStack = this.getHumanReadableRuleStack();
        var pathOccurrenceStack = utils_1.cloneArr(this.RULE_OCCURRENCE_STACK);
        var grammarPath = {
            ruleStack: pathRuleStack,
            occurrenceStack: pathOccurrenceStack,
            lastTok: tokType,
            lastTokOccurrence: tokIdxInRule
        };
        return grammarPath;
    };
    // TODO: should this be a member method or a utility? it does not have any state or usage of 'this'...
    // TODO: should this be more explicitly part of the public API?
    Parser.prototype.getNextPossibleTokenTypes = function (grammarPath) {
        var topRuleName = utils_1.first(grammarPath.ruleStack);
        var gastProductions = this.getGAstProductions();
        var topProduction = gastProductions.get(topRuleName);
        var nextPossibleTokenTypes = new interpreter_1.NextAfterTokenWalker(topProduction, grammarPath).startWalking();
        return nextPossibleTokenTypes;
    };
    Parser.prototype.subruleInternal = function (ruleToCall, idx, options) {
        var ruleResult;
        try {
            var args = options !== undefined ? options.ARGS : undefined;
            ruleResult = ruleToCall.call(this, idx, args);
            this.cstPostNonTerminal(ruleResult, options !== undefined && options.LABEL !== undefined
                ? options.LABEL
                : ruleToCall.ruleName);
            return ruleResult;
        }
        catch (e) {
            if (exceptions_public_1.isRecognitionException(e) && e.partialCstResult !== undefined) {
                this.cstPostNonTerminal(e.partialCstResult, options !== undefined && options.LABEL !== undefined
                    ? options.LABEL
                    : ruleToCall.ruleName);
                delete e.partialCstResult;
            }
            throw e;
        }
    };
    /**
     * @param tokType - The Type of Token we wish to consume (Reference to its constructor function).
     * @param idx - Occurrence index of consumed token in the invoking parser rule text
     *         for example:
     *         IDENT (DOT IDENT)*
     *         the first ident will have idx 1 and the second one idx 2
     *         * note that for the second ident the idx is always 2 even if its invoked 30 times in the same rule
     *           the idx is about the position in grammar (source code) and has nothing to do with a specific invocation
     *           details.
     * @param options -
     *
     * @returns {Token} - The consumed Token.
     */
    Parser.prototype.consumeInternal = function (tokType, idx, options) {
        var consumedToken;
        try {
            var nextToken = this.LA(1);
            if (this.tokenMatcher(nextToken, tokType) === true) {
                this.consumeToken();
                consumedToken = nextToken;
            }
            else {
                var msg = void 0;
                var previousToken = this.LA(0);
                if (options !== undefined && options.ERR_MSG) {
                    msg = options.ERR_MSG;
                }
                else {
                    msg = this.errorMessageProvider.buildMismatchTokenMessage({
                        expected: tokType,
                        actual: nextToken,
                        previous: previousToken,
                        ruleName: this.getCurrRuleFullName()
                    });
                }
                throw this.SAVE_ERROR(new exceptions_public_1.MismatchedTokenException(msg, nextToken, previousToken));
            }
        }
        catch (eFromConsumption) {
            // no recovery allowed during backtracking, otherwise backtracking may recover invalid syntax and accept it
            // but the original syntax could have been parsed successfully without any backtracking + recovery
            if (this.recoveryEnabled &&
                // TODO: more robust checking of the exception type. Perhaps Typescript extending expressions?
                eFromConsumption.name === "MismatchedTokenException" &&
                !this.isBackTracking()) {
                var follows = this.getFollowsForInRuleRecovery(tokType, idx);
                try {
                    consumedToken = this.tryInRuleRecovery(tokType, follows);
                }
                catch (eFromInRuleRecovery) {
                    if (eFromInRuleRecovery.name === IN_RULE_RECOVERY_EXCEPTION) {
                        // failed in RuleRecovery.
                        // throw the original error in order to trigger reSync error recovery
                        throw eFromConsumption;
                    }
                    else {
                        throw eFromInRuleRecovery;
                    }
                }
            }
            else {
                throw eFromConsumption;
            }
        }
        this.cstPostTerminal(options !== undefined && options.LABEL !== undefined
            ? options.LABEL
            : tokType.tokenName, consumedToken);
        return consumedToken;
    };
    // other functionality
    Parser.prototype.saveRecogState = function () {
        // errors is a getter which will clone the errors array
        var savedErrors = this.errors;
        var savedRuleStack = utils_1.cloneArr(this.RULE_STACK);
        return {
            errors: savedErrors,
            lexerState: this.exportLexerState(),
            RULE_STACK: savedRuleStack,
            CST_STACK: this.CST_STACK,
            LAST_EXPLICIT_RULE_STACK: this.LAST_EXPLICIT_RULE_STACK
        };
    };
    Parser.prototype.reloadRecogState = function (newState) {
        this.errors = newState.errors;
        this.importLexerState(newState.lexerState);
        this.RULE_STACK = newState.RULE_STACK;
    };
    Parser.prototype.defineRule = function (ruleName, impl, config) {
        if (this.selfAnalysisDone) {
            throw Error("Grammar rule <" + ruleName + "> may not be defined after the 'performSelfAnalysis' method has been called'\n" +
                "Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.");
        }
        var resyncEnabled = utils_1.has(config, "resyncEnabled")
            ? config.resyncEnabled
            : DEFAULT_RULE_CONFIG.resyncEnabled;
        var recoveryValueFunc = utils_1.has(config, "recoveryValueFunc")
            ? config.recoveryValueFunc
            : DEFAULT_RULE_CONFIG.recoveryValueFunc;
        // performance optimization: Use small integers as keys for the longer human readable "full" rule names.
        // this greatly improves Map access time (as much as 8% for some performance benchmarks).
        /* tslint:disable */
        var shortName = this.ruleShortNameIdx <<
            (keys_1.BITS_FOR_METHOD_IDX + keys_1.BITS_FOR_OCCURRENCE_IDX);
        /* tslint:enable */
        this.ruleShortNameIdx++;
        this.shortRuleNameToFull.put(shortName, ruleName);
        this.fullRuleNameToShort.put(ruleName, shortName);
        function invokeRuleWithTry(args) {
            try {
                // TODO: dynamically get rid of this?
                if (this.outputCst === true) {
                    impl.apply(this, args);
                    return this.CST_STACK[this.CST_STACK.length - 1];
                }
                else {
                    return impl.apply(this, args);
                }
            }
            catch (e) {
                var isFirstInvokedRule = this.RULE_STACK.length === 1;
                // note the reSync is always enabled for the first rule invocation, because we must always be able to
                // reSync with EOF and just output some INVALID ParseTree
                // during backtracking reSync recovery is disabled, otherwise we can't be certain the backtracking
                // path is really the most valid one
                var reSyncEnabled = resyncEnabled &&
                    !this.isBackTracking() &&
                    this.recoveryEnabled;
                if (exceptions_public_1.isRecognitionException(e)) {
                    if (reSyncEnabled) {
                        var reSyncTokType = this.findReSyncTokenType();
                        if (this.isInCurrentRuleReSyncSet(reSyncTokType)) {
                            e.resyncedTokens = this.reSyncTo(reSyncTokType);
                            if (this.outputCst) {
                                var partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
                                partialCstResult.recoveredNode = true;
                                return partialCstResult;
                            }
                            else {
                                return recoveryValueFunc();
                            }
                        }
                        else {
                            if (this.outputCst) {
                                var partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
                                partialCstResult.recoveredNode = true;
                                e.partialCstResult = partialCstResult;
                            }
                            // to be handled Further up the call stack
                            throw e;
                        }
                    }
                    else if (isFirstInvokedRule) {
                        // otherwise a Redundant input error will be created as well and we cannot guarantee that this is indeed the case
                        this.moveToTerminatedState();
                        // the parser should never throw one of its own errors outside its flow.
                        // even if error recovery is disabled
                        return recoveryValueFunc();
                    }
                    else {
                        // to be handled Further up the call stack
                        throw e;
                    }
                }
                else {
                    // some other Error type which we don't know how to handle (for example a built in JavaScript Error)
                    throw e;
                }
            }
            finally {
                this.ruleFinallyStateUpdate();
            }
        }
        var wrappedGrammarRule;
        wrappedGrammarRule = function (idxInCallingRule, args) {
            if (idxInCallingRule === void 0) { idxInCallingRule = 0; }
            this.ruleInvocationStateUpdate(shortName, ruleName, idxInCallingRule);
            return invokeRuleWithTry.call(this, args);
        };
        var ruleNamePropName = "ruleName";
        wrappedGrammarRule[ruleNamePropName] = ruleName;
        return wrappedGrammarRule;
    };
    Parser.prototype.tryInRepetitionRecovery = function (grammarRule, grammarRuleArgs, lookAheadFunc, expectedTokType) {
        var _this = this;
        // TODO: can the resyncTokenType be cached?
        var reSyncTokType = this.findReSyncTokenType();
        var savedLexerState = this.exportLexerState();
        var resyncedTokens = [];
        var passedResyncPoint = false;
        var nextTokenWithoutResync = this.LA(1);
        var currToken = this.LA(1);
        var generateErrorMessage = function () {
            var previousToken = _this.LA(0);
            // we are preemptively re-syncing before an error has been detected, therefor we must reproduce
            // the error that would have been thrown
            var msg = _this.errorMessageProvider.buildMismatchTokenMessage({
                expected: expectedTokType,
                actual: nextTokenWithoutResync,
                previous: previousToken,
                ruleName: _this.getCurrRuleFullName()
            });
            var error = new exceptions_public_1.MismatchedTokenException(msg, nextTokenWithoutResync, _this.LA(0));
            // the first token here will be the original cause of the error, this is not part of the resyncedTokens property.
            error.resyncedTokens = utils_1.dropRight(resyncedTokens);
            _this.SAVE_ERROR(error);
        };
        while (!passedResyncPoint) {
            // re-synced to a point where we can safely exit the repetition/
            if (this.tokenMatcher(currToken, expectedTokType)) {
                generateErrorMessage();
                return; // must return here to avoid reverting the inputIdx
            }
            else if (lookAheadFunc.call(this)) {
                // we skipped enough tokens so we can resync right back into another iteration of the repetition grammar rule
                generateErrorMessage();
                // recursive invocation in other to support multiple re-syncs in the same top level repetition grammar rule
                grammarRule.apply(this, grammarRuleArgs);
                return; // must return here to avoid reverting the inputIdx
            }
            else if (this.tokenMatcher(currToken, reSyncTokType)) {
                passedResyncPoint = true;
            }
            else {
                currToken = this.SKIP_TOKEN();
                this.addToResyncTokens(currToken, resyncedTokens);
            }
        }
        // we were unable to find a CLOSER point to resync inside the Repetition, reset the state.
        // The parsing exception we were trying to prevent will happen in the NEXT parsing step. it may be handled by
        // "between rules" resync recovery later in the flow.
        this.importLexerState(savedLexerState);
    };
    Parser.prototype.shouldInRepetitionRecoveryBeTried = function (expectTokAfterLastMatch, nextTokIdx) {
        // arguments to try and perform resync into the next iteration of the many are missing
        if (expectTokAfterLastMatch === undefined || nextTokIdx === undefined) {
            return false;
        }
        // no need to recover, next token is what we expect...
        if (this.tokenMatcher(this.LA(1), expectTokAfterLastMatch)) {
            return false;
        }
        // error recovery is disabled during backtracking as it can make the parser ignore a valid grammar path
        // and prefer some backtracking path that includes recovered errors.
        if (this.isBackTracking()) {
            return false;
        }
        // if we can perform inRule recovery (single token insertion or deletion) we always prefer that recovery algorithm
        // because if it works, it makes the least amount of changes to the input stream (greedy algorithm)
        //noinspection RedundantIfStatementJS
        if (this.canPerformInRuleRecovery(expectTokAfterLastMatch, this.getFollowsForInRuleRecovery(expectTokAfterLastMatch, nextTokIdx))) {
            return false;
        }
        return true;
    };
    // Error Recovery functionality
    Parser.prototype.getFollowsForInRuleRecovery = function (tokType, tokIdxInRule) {
        var grammarPath = this.getCurrentGrammarPath(tokType, tokIdxInRule);
        var follows = this.getNextPossibleTokenTypes(grammarPath);
        return follows;
    };
    Parser.prototype.tryInRuleRecovery = function (expectedTokType, follows) {
        if (this.canRecoverWithSingleTokenInsertion(expectedTokType, follows)) {
            var tokToInsert = this.getTokenToInsert(expectedTokType);
            return tokToInsert;
        }
        if (this.canRecoverWithSingleTokenDeletion(expectedTokType)) {
            var nextTok = this.SKIP_TOKEN();
            this.consumeToken();
            return nextTok;
        }
        throw new InRuleRecoveryException("sad sad panda");
    };
    Parser.prototype.canPerformInRuleRecovery = function (expectedToken, follows) {
        return (this.canRecoverWithSingleTokenInsertion(expectedToken, follows) ||
            this.canRecoverWithSingleTokenDeletion(expectedToken));
    };
    Parser.prototype.canRecoverWithSingleTokenInsertion = function (expectedTokType, follows) {
        var _this = this;
        if (!this.canTokenTypeBeInsertedInRecovery(expectedTokType)) {
            return false;
        }
        // must know the possible following tokens to perform single token insertion
        if (utils_1.isEmpty(follows)) {
            return false;
        }
        var mismatchedTok = this.LA(1);
        var isMisMatchedTokInFollows = utils_1.find(follows, function (possibleFollowsTokType) {
            return _this.tokenMatcher(mismatchedTok, possibleFollowsTokType);
        }) !== undefined;
        return isMisMatchedTokInFollows;
    };
    Parser.prototype.canRecoverWithSingleTokenDeletion = function (expectedTokType) {
        var isNextTokenWhatIsExpected = this.tokenMatcher(this.LA(2), expectedTokType);
        return isNextTokenWhatIsExpected;
    };
    Parser.prototype.isInCurrentRuleReSyncSet = function (tokenTypeIdx) {
        var followKey = this.getCurrFollowKey();
        var currentRuleReSyncSet = this.getFollowSetFromFollowKey(followKey);
        return utils_1.contains(currentRuleReSyncSet, tokenTypeIdx);
    };
    Parser.prototype.findReSyncTokenType = function () {
        var allPossibleReSyncTokTypes = this.flattenFollowSet();
        // this loop will always terminate as EOF is always in the follow stack and also always (virtually) in the input
        var nextToken = this.LA(1);
        var k = 2;
        while (true) {
            var nextTokenType = nextToken.tokenType;
            if (utils_1.contains(allPossibleReSyncTokTypes, nextTokenType)) {
                return nextTokenType;
            }
            nextToken = this.LA(k);
            k++;
        }
    };
    Parser.prototype.getCurrFollowKey = function () {
        // the length is at least one as we always add the ruleName to the stack before invoking the rule.
        if (this.RULE_STACK.length === 1) {
            return EOF_FOLLOW_KEY;
        }
        var currRuleShortName = this.getLastExplicitRuleShortName();
        var currRuleIdx = this.getLastExplicitRuleOccurrenceIndex();
        var prevRuleShortName = this.getPreviousExplicitRuleShortName();
        return {
            ruleName: this.shortRuleNameToFullName(currRuleShortName),
            idxInCallingRule: currRuleIdx,
            inRule: this.shortRuleNameToFullName(prevRuleShortName)
        };
    };
    Parser.prototype.buildFullFollowKeyStack = function () {
        var _this = this;
        var explicitRuleStack = this.RULE_STACK;
        var explicitOccurrenceStack = this.RULE_OCCURRENCE_STACK;
        if (!utils_1.isEmpty(this.LAST_EXPLICIT_RULE_STACK)) {
            explicitRuleStack = utils_1.map(this.LAST_EXPLICIT_RULE_STACK, function (idx) { return _this.RULE_STACK[idx]; });
            explicitOccurrenceStack = utils_1.map(this.LAST_EXPLICIT_RULE_STACK, function (idx) { return _this.RULE_OCCURRENCE_STACK[idx]; });
        }
        // TODO: only iterate over explicit rules here
        return utils_1.map(explicitRuleStack, function (ruleName, idx) {
            if (idx === 0) {
                return EOF_FOLLOW_KEY;
            }
            return {
                ruleName: _this.shortRuleNameToFullName(ruleName),
                idxInCallingRule: explicitOccurrenceStack[idx],
                inRule: _this.shortRuleNameToFullName(explicitRuleStack[idx - 1])
            };
        });
    };
    Parser.prototype.flattenFollowSet = function () {
        var _this = this;
        var followStack = utils_1.map(this.buildFullFollowKeyStack(), function (currKey) {
            return _this.getFollowSetFromFollowKey(currKey);
        });
        return utils_1.flatten(followStack);
    };
    Parser.prototype.getFollowSetFromFollowKey = function (followKey) {
        if (followKey === EOF_FOLLOW_KEY) {
            return [tokens_public_1.EOF];
        }
        var followName = followKey.ruleName +
            followKey.idxInCallingRule +
            constants_1.IN +
            followKey.inRule;
        return this.resyncFollows.get(followName);
    };
    // It does not make any sense to include a virtual EOF token in the list of resynced tokens
    // as EOF does not really exist and thus does not contain any useful information (line/column numbers)
    Parser.prototype.addToResyncTokens = function (token, resyncTokens) {
        if (!this.tokenMatcher(token, tokens_public_1.EOF)) {
            resyncTokens.push(token);
        }
        return resyncTokens;
    };
    Parser.prototype.reSyncTo = function (tokType) {
        var resyncedTokens = [];
        var nextTok = this.LA(1);
        while (this.tokenMatcher(nextTok, tokType) === false) {
            nextTok = this.SKIP_TOKEN();
            this.addToResyncTokens(nextTok, resyncedTokens);
        }
        // the last token is not part of the error.
        return utils_1.dropRight(resyncedTokens);
    };
    Parser.prototype.attemptInRepetitionRecovery = function (prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker) {
        var key = this.getKeyForAutomaticLookahead(dslMethodIdx, prodOccurrence);
        var firstAfterRepInfo = this.firstAfterRepMap.get(key);
        if (firstAfterRepInfo === undefined) {
            var currRuleName = this.getCurrRuleFullName();
            var ruleGrammar = this.getGAstProductions().get(currRuleName);
            var walker = new nextToksWalker(ruleGrammar, prodOccurrence);
            firstAfterRepInfo = walker.startWalking();
            this.firstAfterRepMap.put(key, firstAfterRepInfo);
        }
        var expectTokAfterLastMatch = firstAfterRepInfo.token;
        var nextTokIdx = firstAfterRepInfo.occurrence;
        var isEndOfRule = firstAfterRepInfo.isEndOfRule;
        // special edge case of a TOP most repetition after which the input should END.
        // this will force an attempt for inRule recovery in that scenario.
        if (this.RULE_STACK.length === 1 &&
            isEndOfRule &&
            expectTokAfterLastMatch === undefined) {
            expectTokAfterLastMatch = tokens_public_1.EOF;
            nextTokIdx = 1;
        }
        if (this.shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx)) {
            // TODO: performance optimization: instead of passing the original args here, we modify
            // the args param (or create a new one) and make sure the lookahead func is explicitly provided
            // to avoid searching the cache for it once more.
            this.tryInRepetitionRecovery(prodFunc, args, lookaheadFunc, expectTokAfterLastMatch);
        }
    };
    Parser.prototype.cstNestedInvocationStateUpdate = function (nestedName, shortName) {
        this.CST_STACK.push({
            name: nestedName,
            fullName: this.shortRuleNameToFull.get(this.getLastExplicitRuleShortName()) + nestedName,
            children: {}
        });
    };
    Parser.prototype.cstInvocationStateUpdate = function (fullRuleName, shortName) {
        this.LAST_EXPLICIT_RULE_STACK.push(this.RULE_STACK.length - 1);
        this.CST_STACK.push({
            name: fullRuleName,
            children: {}
        });
    };
    Parser.prototype.cstFinallyStateUpdate = function () {
        this.LAST_EXPLICIT_RULE_STACK.pop();
        this.CST_STACK.pop();
    };
    Parser.prototype.cstNestedFinallyStateUpdate = function () {
        this.CST_STACK.pop();
    };
    // Implementation of parsing DSL
    Parser.prototype.optionInternal = function (actionORMethodDef, occurrence) {
        var key = this.getKeyForAutomaticLookahead(keys_1.OPTION_IDX, occurrence);
        var nestedName = this.nestedRuleBeforeClause(actionORMethodDef, key);
        try {
            return this.optionInternalLogic(actionORMethodDef, occurrence, key);
        }
        finally {
            if (nestedName !== undefined) {
                this.nestedRuleFinallyClause(key, nestedName);
            }
        }
    };
    Parser.prototype.optionInternalNoCst = function (actionORMethodDef, occurrence) {
        var key = this.getKeyForAutomaticLookahead(keys_1.OPTION_IDX, occurrence);
        return this.optionInternalLogic(actionORMethodDef, occurrence, key);
    };
    Parser.prototype.optionInternalLogic = function (actionORMethodDef, occurrence, key) {
        var _this = this;
        var lookAheadFunc = this.getLookaheadFuncForOption(key, occurrence);
        var action;
        var predicate;
        if (actionORMethodDef.DEF !== undefined) {
            action = actionORMethodDef.DEF;
            predicate = actionORMethodDef.GATE;
            // predicate present
            if (predicate !== undefined) {
                var orgLookaheadFunction_1 = lookAheadFunc;
                lookAheadFunc = function () {
                    return (predicate.call(_this) && orgLookaheadFunction_1.call(_this));
                };
            }
        }
        else {
            action = actionORMethodDef;
        }
        if (lookAheadFunc.call(this) === true) {
            return action.call(this);
        }
        return undefined;
    };
    Parser.prototype.atLeastOneInternal = function (prodOccurrence, actionORMethodDef, result) {
        var laKey = this.getKeyForAutomaticLookahead(keys_1.AT_LEAST_ONE_IDX, prodOccurrence);
        var nestedName = this.nestedRuleBeforeClause(actionORMethodDef, laKey);
        try {
            return this.atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, result, laKey);
        }
        finally {
            if (nestedName !== undefined) {
                this.nestedRuleFinallyClause(laKey, nestedName);
            }
        }
    };
    Parser.prototype.atLeastOneInternalNoCst = function (prodOccurrence, actionORMethodDef, result) {
        var key = this.getKeyForAutomaticLookahead(keys_1.AT_LEAST_ONE_IDX, prodOccurrence);
        return this.atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, result, key);
    };
    Parser.prototype.atLeastOneInternalLogic = function (prodOccurrence, actionORMethodDef, result, key) {
        var _this = this;
        var lookAheadFunc = this.getLookaheadFuncForAtLeastOne(key, prodOccurrence);
        var action;
        var predicate;
        if (actionORMethodDef.DEF !== undefined) {
            action = actionORMethodDef.DEF;
            predicate = actionORMethodDef.GATE;
            // predicate present
            if (predicate !== undefined) {
                var orgLookaheadFunction_2 = lookAheadFunc;
                lookAheadFunc = function () {
                    return (predicate.call(_this) && orgLookaheadFunction_2.call(_this));
                };
            }
        }
        else {
            action = actionORMethodDef;
        }
        if (lookAheadFunc.call(this) === true) {
            result.push(action.call(this));
            while (lookAheadFunc.call(this) === true) {
                result.push(action.call(this));
            }
        }
        else {
            throw this.raiseEarlyExitException(prodOccurrence, lookahead_1.PROD_TYPE.REPETITION_MANDATORY, actionORMethodDef.ERR_MSG);
        }
        // note that while it may seem that this can cause an error because by using a recursive call to
        // AT_LEAST_ONE we change the grammar to AT_LEAST_TWO, AT_LEAST_THREE ... , the possible recursive call
        // from the tryInRepetitionRecovery(...) will only happen IFF there really are TWO/THREE/.... items.
        // Performance optimization: "attemptInRepetitionRecovery" will be defined as NOOP unless recovery is enabled
        this.attemptInRepetitionRecovery(this.atLeastOneInternal, [prodOccurrence, actionORMethodDef, result], lookAheadFunc, keys_1.AT_LEAST_ONE_IDX, prodOccurrence, interpreter_1.NextTerminalAfterAtLeastOneWalker);
        return result;
    };
    Parser.prototype.atLeastOneSepFirstInternal = function (prodOccurrence, options, result) {
        var laKey = this.getKeyForAutomaticLookahead(keys_1.AT_LEAST_ONE_SEP_IDX, prodOccurrence);
        var nestedName = this.nestedRuleBeforeClause(options, laKey);
        try {
            return this.atLeastOneSepFirstInternalLogic(prodOccurrence, options, result, laKey);
        }
        finally {
            if (nestedName !== undefined) {
                this.nestedRuleFinallyClause(laKey, nestedName);
            }
        }
    };
    Parser.prototype.atLeastOneSepFirstInternalNoCst = function (prodOccurrence, options, result) {
        var laKey = this.getKeyForAutomaticLookahead(keys_1.AT_LEAST_ONE_SEP_IDX, prodOccurrence);
        return this.atLeastOneSepFirstInternalLogic(prodOccurrence, options, result, laKey);
    };
    Parser.prototype.atLeastOneSepFirstInternalLogic = function (prodOccurrence, options, result, key) {
        var _this = this;
        var action = options.DEF;
        var separator = options.SEP;
        var firstIterationLookaheadFunc = this.getLookaheadFuncForAtLeastOneSep(key, prodOccurrence);
        var values = result.values;
        var separators = result.separators;
        // 1st iteration
        if (firstIterationLookaheadFunc.call(this) === true) {
            values.push(action.call(this));
            var separatorLookAheadFunc = function () {
                return _this.tokenMatcher(_this.LA(1), separator);
            };
            // 2nd..nth iterations
            while (this.tokenMatcher(this.LA(1), separator) === true) {
                // note that this CONSUME will never enter recovery because
                // the separatorLookAheadFunc checks that the separator really does exist.
                separators.push(this.CONSUME(separator));
                values.push(action.call(this));
            }
            // Performance optimization: "attemptInRepetitionRecovery" will be defined as NOOP unless recovery is enabled
            this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
                prodOccurrence,
                separator,
                separatorLookAheadFunc,
                action,
                interpreter_1.NextTerminalAfterAtLeastOneSepWalker,
                result
            ], separatorLookAheadFunc, keys_1.AT_LEAST_ONE_SEP_IDX, prodOccurrence, interpreter_1.NextTerminalAfterAtLeastOneSepWalker);
        }
        else {
            throw this.raiseEarlyExitException(prodOccurrence, lookahead_1.PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, options.ERR_MSG);
        }
        return result;
    };
    Parser.prototype.manyInternal = function (prodOccurrence, actionORMethodDef, result) {
        var laKey = this.getKeyForAutomaticLookahead(keys_1.MANY_IDX, prodOccurrence);
        var nestedName = this.nestedRuleBeforeClause(actionORMethodDef, laKey);
        try {
            return this.manyInternalLogic(prodOccurrence, actionORMethodDef, result, laKey);
        }
        finally {
            if (nestedName !== undefined) {
                this.nestedRuleFinallyClause(laKey, nestedName);
            }
        }
    };
    Parser.prototype.manyInternalNoCst = function (prodOccurrence, actionORMethodDef, result) {
        var laKey = this.getKeyForAutomaticLookahead(keys_1.MANY_IDX, prodOccurrence);
        return this.manyInternalLogic(prodOccurrence, actionORMethodDef, result, laKey);
    };
    Parser.prototype.manyInternalLogic = function (prodOccurrence, actionORMethodDef, result, key) {
        var _this = this;
        var lookaheadFunction = this.getLookaheadFuncForMany(key, prodOccurrence);
        var action;
        var predicate;
        if (actionORMethodDef.DEF !== undefined) {
            action = actionORMethodDef.DEF;
            predicate = actionORMethodDef.GATE;
            // predicate present
            if (predicate !== undefined) {
                var orgLookaheadFunction_3 = lookaheadFunction;
                lookaheadFunction = function () {
                    return (predicate.call(_this) && orgLookaheadFunction_3.call(_this));
                };
            }
        }
        else {
            action = actionORMethodDef;
        }
        while (lookaheadFunction.call(this)) {
            result.push(action.call(this));
        }
        // Performance optimization: "attemptInRepetitionRecovery" will be defined as NOOP unless recovery is enabled
        this.attemptInRepetitionRecovery(this.manyInternal, [prodOccurrence, actionORMethodDef, result], lookaheadFunction, keys_1.MANY_IDX, prodOccurrence, interpreter_1.NextTerminalAfterManyWalker);
        return result;
    };
    Parser.prototype.manySepFirstInternal = function (prodOccurrence, options, result) {
        var laKey = this.getKeyForAutomaticLookahead(keys_1.MANY_SEP_IDX, prodOccurrence);
        var nestedName = this.nestedRuleBeforeClause(options, laKey);
        try {
            return this.manySepFirstInternalLogic(prodOccurrence, options, result, laKey);
        }
        finally {
            if (nestedName !== undefined) {
                this.nestedRuleFinallyClause(laKey, nestedName);
            }
        }
    };
    Parser.prototype.manySepFirstInternalNoCst = function (prodOccurrence, options, result) {
        var laKey = this.getKeyForAutomaticLookahead(keys_1.MANY_SEP_IDX, prodOccurrence);
        return this.manySepFirstInternalLogic(prodOccurrence, options, result, laKey);
    };
    Parser.prototype.manySepFirstInternalLogic = function (prodOccurrence, options, result, key) {
        var _this = this;
        var action = options.DEF;
        var separator = options.SEP;
        var firstIterationLaFunc = this.getLookaheadFuncForManySep(key, prodOccurrence);
        var values = result.values;
        var separators = result.separators;
        // 1st iteration
        if (firstIterationLaFunc.call(this) === true) {
            values.push(action.call(this));
            var separatorLookAheadFunc = function () {
                return _this.tokenMatcher(_this.LA(1), separator);
            };
            // 2nd..nth iterations
            while (this.tokenMatcher(this.LA(1), separator) === true) {
                // note that this CONSUME will never enter recovery because
                // the separatorLookAheadFunc checks that the separator really does exist.
                separators.push(this.CONSUME(separator));
                values.push(action.call(this));
            }
            // Performance optimization: "attemptInRepetitionRecovery" will be defined as NOOP unless recovery is enabled
            this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
                prodOccurrence,
                separator,
                separatorLookAheadFunc,
                action,
                interpreter_1.NextTerminalAfterManySepWalker,
                result
            ], separatorLookAheadFunc, keys_1.MANY_SEP_IDX, prodOccurrence, interpreter_1.NextTerminalAfterManySepWalker);
        }
        return result;
    };
    Parser.prototype.repetitionSepSecondInternal = function (prodOccurrence, separator, separatorLookAheadFunc, action, nextTerminalAfterWalker, result) {
        while (separatorLookAheadFunc()) {
            // note that this CONSUME will never enter recovery because
            // the separatorLookAheadFunc checks that the separator really does exist.
            result.separators.push(this.CONSUME(separator));
            result.values.push(action.call(this));
        }
        // we can only arrive to this function after an error
        // has occurred (hence the name 'second') so the following
        // IF will always be entered, its possible to remove it...
        // however it is kept to avoid confusion and be consistent.
        // Performance optimization: "attemptInRepetitionRecovery" will be defined as NOOP unless recovery is enabled
        /* istanbul ignore else */
        this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
            prodOccurrence,
            separator,
            separatorLookAheadFunc,
            action,
            nextTerminalAfterWalker,
            result
        ], separatorLookAheadFunc, keys_1.AT_LEAST_ONE_SEP_IDX, prodOccurrence, nextTerminalAfterWalker);
    };
    Parser.prototype.orInternalNoCst = function (altsOrOpts, occurrence) {
        var alts = utils_1.isArray(altsOrOpts)
            ? altsOrOpts
            : altsOrOpts.DEF;
        var laFunc = this.getLookaheadFuncForOr(occurrence, alts);
        var altIdxToTake = laFunc.call(this, alts);
        if (altIdxToTake !== undefined) {
            var chosenAlternative = alts[altIdxToTake];
            return chosenAlternative.ALT.call(this);
        }
        this.raiseNoAltException(occurrence, altsOrOpts.ERR_MSG);
    };
    Parser.prototype.orInternal = function (altsOrOpts, occurrence) {
        var laKey = this.getKeyForAutomaticLookahead(keys_1.OR_IDX, occurrence);
        var nestedName = this.nestedRuleBeforeClause(altsOrOpts, laKey);
        try {
            var alts = utils_1.isArray(altsOrOpts)
                ? altsOrOpts
                : altsOrOpts.DEF;
            var laFunc = this.getLookaheadFuncForOr(occurrence, alts);
            var altIdxToTake = laFunc.call(this, alts);
            if (altIdxToTake !== undefined) {
                var chosenAlternative = alts[altIdxToTake];
                var nestedAltBeforeClauseResult = this.nestedAltBeforeClause(chosenAlternative, occurrence, keys_1.OR_IDX, altIdxToTake);
                try {
                    return chosenAlternative.ALT.call(this);
                }
                finally {
                    if (nestedAltBeforeClauseResult !== undefined) {
                        this.nestedRuleFinallyClause(nestedAltBeforeClauseResult.shortName, nestedAltBeforeClauseResult.nestedName);
                    }
                }
            }
            this.raiseNoAltException(occurrence, altsOrOpts.ERR_MSG);
        }
        finally {
            if (nestedName !== undefined) {
                this.nestedRuleFinallyClause(laKey, nestedName);
            }
        }
    };
    // this actually returns a number, but it is always used as a string (object prop key)
    Parser.prototype.getKeyForAutomaticLookahead = function (dslMethodIdx, occurrence) {
        var currRuleShortName = this.getLastExplicitRuleShortName();
        return keys_1.getKeyForAutomaticLookahead(currRuleShortName, dslMethodIdx, occurrence);
    };
    Parser.prototype.getLookaheadFuncForOr = function (occurrence, alts) {
        var key = this.getKeyForAutomaticLookahead(keys_1.OR_IDX, occurrence);
        var laFunc = this.lookAheadFuncsCache[key];
        if (laFunc === undefined) {
            var ruleName = this.getCurrRuleFullName();
            var ruleGrammar = this.getGAstProductions().get(ruleName);
            // note that hasPredicates is only computed once.
            var hasPredicates = utils_1.some(alts, function (currAlt) {
                return utils_1.isFunction(currAlt.GATE);
            });
            laFunc = lookahead_1.buildLookaheadFuncForOr(occurrence, ruleGrammar, this.maxLookahead, hasPredicates, this.dynamicTokensEnabled, this.lookAheadBuilderForAlternatives);
            this.lookAheadFuncsCache[key] = laFunc;
            return laFunc;
        }
        else {
            return laFunc;
        }
    };
    // Automatic lookahead calculation
    Parser.prototype.getLookaheadFuncForOption = function (key, occurrence) {
        return this.getLookaheadFuncFor(key, occurrence, this.maxLookahead, lookahead_1.PROD_TYPE.OPTION);
    };
    Parser.prototype.getLookaheadFuncForMany = function (key, occurrence) {
        return this.getLookaheadFuncFor(key, occurrence, this.maxLookahead, lookahead_1.PROD_TYPE.REPETITION);
    };
    Parser.prototype.getLookaheadFuncForManySep = function (key, occurrence) {
        return this.getLookaheadFuncFor(key, occurrence, this.maxLookahead, lookahead_1.PROD_TYPE.REPETITION_WITH_SEPARATOR);
    };
    Parser.prototype.getLookaheadFuncForAtLeastOne = function (key, occurrence) {
        return this.getLookaheadFuncFor(key, occurrence, this.maxLookahead, lookahead_1.PROD_TYPE.REPETITION_MANDATORY);
    };
    Parser.prototype.getLookaheadFuncForAtLeastOneSep = function (key, occurrence) {
        return this.getLookaheadFuncFor(key, occurrence, this.maxLookahead, lookahead_1.PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR);
    };
    // TODO: consider caching the error message computed information
    Parser.prototype.raiseNoAltException = function (occurrence, errMsgTypes) {
        var ruleName = this.getCurrRuleFullName();
        var ruleGrammar = this.getGAstProductions().get(ruleName);
        // TODO: getLookaheadPathsForOr can be slow for large enough maxLookahead and certain grammars, consider caching ?
        var lookAheadPathsPerAlternative = lookahead_1.getLookaheadPathsForOr(occurrence, ruleGrammar, this.maxLookahead);
        var actualTokens = [];
        for (var i = 1; i < this.maxLookahead; i++) {
            actualTokens.push(this.LA(i));
        }
        var previousToken = this.LA(0);
        var errMsg = this.errorMessageProvider.buildNoViableAltMessage({
            expectedPathsPerAlt: lookAheadPathsPerAlternative,
            actual: actualTokens,
            previous: previousToken,
            customUserDescription: errMsgTypes,
            ruleName: this.getCurrRuleFullName()
        });
        throw this.SAVE_ERROR(new exceptions_public_1.NoViableAltException(errMsg, this.LA(1), previousToken));
    };
    Parser.prototype.getLookaheadFuncFor = function (key, occurrence, maxLookahead, prodType) {
        var laFunc = this.lookAheadFuncsCache[key];
        if (laFunc === undefined) {
            var ruleName = this.getCurrRuleFullName();
            var ruleGrammar = this.getGAstProductions().get(ruleName);
            laFunc = lookahead_1.buildLookaheadFuncForOptionalProd(occurrence, ruleGrammar, maxLookahead, this.dynamicTokensEnabled, prodType, this.lookAheadBuilderForOptional);
            this.lookAheadFuncsCache[key] = laFunc;
            return laFunc;
        }
        else {
            return laFunc;
        }
    };
    // TODO: consider caching the error message computed information
    Parser.prototype.raiseEarlyExitException = function (occurrence, prodType, userDefinedErrMsg) {
        var ruleName = this.getCurrRuleFullName();
        var ruleGrammar = this.getGAstProductions().get(ruleName);
        var lookAheadPathsPerAlternative = lookahead_1.getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, this.maxLookahead);
        var insideProdPaths = lookAheadPathsPerAlternative[0];
        var actualTokens = [];
        for (var i = 1; i < this.maxLookahead; i++) {
            actualTokens.push(this.LA(i));
        }
        var msg = this.errorMessageProvider.buildEarlyExitMessage({
            expectedIterationPaths: insideProdPaths,
            actual: actualTokens,
            previous: this.LA(0),
            customUserDescription: userDefinedErrMsg,
            ruleName: ruleName
        });
        throw this.SAVE_ERROR(new exceptions_public_1.EarlyExitException(msg, this.LA(1), this.LA(0)));
    };
    Parser.prototype.getLastExplicitRuleShortName = function () {
        var lastExplictIndex = this.LAST_EXPLICIT_RULE_STACK[this.LAST_EXPLICIT_RULE_STACK.length - 1];
        return this.RULE_STACK[lastExplictIndex];
    };
    Parser.prototype.getLastExplicitRuleShortNameNoCst = function () {
        var ruleStack = this.RULE_STACK;
        return ruleStack[ruleStack.length - 1];
    };
    Parser.prototype.getPreviousExplicitRuleShortName = function () {
        var lastExplicitIndex = this.LAST_EXPLICIT_RULE_STACK[this.LAST_EXPLICIT_RULE_STACK.length - 2];
        return this.RULE_STACK[lastExplicitIndex];
    };
    Parser.prototype.getPreviousExplicitRuleShortNameNoCst = function () {
        var ruleStack = this.RULE_STACK;
        return ruleStack[ruleStack.length - 2];
    };
    Parser.prototype.getLastExplicitRuleOccurrenceIndex = function () {
        var lastExplicitIndex = this.LAST_EXPLICIT_RULE_STACK[this.LAST_EXPLICIT_RULE_STACK.length - 1];
        return this.RULE_OCCURRENCE_STACK[lastExplicitIndex];
    };
    Parser.prototype.getLastExplicitRuleOccurrenceIndexNoCst = function () {
        var occurrenceStack = this.RULE_OCCURRENCE_STACK;
        return occurrenceStack[occurrenceStack.length - 1];
    };
    Parser.prototype.nestedRuleBeforeClause = function (methodOpts, laKey) {
        var nestedName;
        if (methodOpts.NAME !== undefined) {
            nestedName = methodOpts.NAME;
            this.nestedRuleInvocationStateUpdate(nestedName, laKey);
            return nestedName;
        }
        else {
            return undefined;
        }
    };
    Parser.prototype.nestedAltBeforeClause = function (methodOpts, occurrence, methodKeyIdx, altIdx) {
        var ruleIdx = this.getLastExplicitRuleShortName();
        var shortName = keys_1.getKeyForAltIndex(ruleIdx, methodKeyIdx, occurrence, altIdx);
        var nestedName;
        if (methodOpts.NAME !== undefined) {
            nestedName = methodOpts.NAME;
            this.nestedRuleInvocationStateUpdate(nestedName, shortName);
            return {
                shortName: shortName,
                nestedName: nestedName
            };
        }
        else {
            return undefined;
        }
    };
    Parser.prototype.nestedRuleFinallyClause = function (laKey, nestedName) {
        var cstStack = this.CST_STACK;
        var nestedRuleCst = cstStack[cstStack.length - 1];
        this.nestedRuleFinallyStateUpdate();
        // this return a different result than the previous invocation because "nestedRuleFinallyStateUpdate" pops the cst stack
        var parentCstNode = cstStack[cstStack.length - 1];
        cst_1.addNoneTerminalToCst(parentCstNode, nestedName, nestedRuleCst);
    };
    Parser.prototype.cstPostTerminal = function (key, consumedToken) {
        // TODO: would save the "current rootCST be faster than locating it for each terminal?
        var rootCst = this.CST_STACK[this.CST_STACK.length - 1];
        cst_1.addTerminalToCst(rootCst, consumedToken, key);
    };
    Parser.prototype.cstPostNonTerminal = function (ruleCstResult, ruleName) {
        cst_1.addNoneTerminalToCst(this.CST_STACK[this.CST_STACK.length - 1], ruleName, ruleCstResult);
    };
    Object.defineProperty(Parser.prototype, "input", {
        get: function () {
            return this.tokVector;
        },
        // lexer related methods
        set: function (newInput) {
            this.reset();
            this.tokVector = newInput;
            this.tokVectorLength = newInput.length;
        },
        enumerable: true,
        configurable: true
    });
    // skips a token and returns the next token
    Parser.prototype.SKIP_TOKEN = function () {
        if (this.currIdx <= this.tokVector.length - 2) {
            this.consumeToken();
            return this.LA(1);
        }
        else {
            return exports.END_OF_FILE;
        }
    };
    // Lexer (accessing Token vector) related methods which can be overridden to implement lazy lexers
    // or lexers dependent on parser context.
    Parser.prototype.LA = function (howMuch) {
        // does: is this optimization (saving tokVectorLength benefits?)
        if (this.currIdx + howMuch < 0 ||
            this.tokVectorLength <= this.currIdx + howMuch) {
            return exports.END_OF_FILE;
        }
        else {
            return this.tokVector[this.currIdx + howMuch];
        }
    };
    Parser.prototype.consumeToken = function () {
        this.currIdx++;
    };
    Parser.prototype.exportLexerState = function () {
        return this.currIdx;
    };
    Parser.prototype.importLexerState = function (newState) {
        this.currIdx = newState;
    };
    Parser.prototype.resetLexerState = function () {
        this.currIdx = -1;
    };
    Parser.prototype.moveToTerminatedState = function () {
        this.currIdx = this.tokVector.length - 1;
    };
    Parser.prototype.lookAheadBuilderForOptional = function (alt, tokenMatcher, dynamicTokensEnabled) {
        return lookahead_1.buildSingleAlternativeLookaheadFunction(alt, tokenMatcher, dynamicTokensEnabled);
    };
    Parser.prototype.lookAheadBuilderForAlternatives = function (alts, hasPredicates, tokenMatcher, dynamicTokensEnabled) {
        return lookahead_1.buildAlternativesLookAheadFunc(alts, hasPredicates, tokenMatcher, dynamicTokensEnabled);
    };
    Parser.NO_RESYNC = false;
    // Set this flag to true if you don't want the Parser to throw error when problems in it's definition are detected.
    // (normally during the parser's constructor).
    // This is a design time flag, it will not affect the runtime error handling of the parser, just design time errors,
    // for example: duplicate rule names, referencing an unresolved subrule, ect...
    // This flag should not be enabled during normal usage, it is used in special situations, for example when
    // needing to display the parser definition errors in some GUI(online playground).
    Parser.DEFER_DEFINITION_ERRORS_HANDLING = false;
    return Parser;
}());
exports.Parser = Parser;
function InRuleRecoveryException(message) {
    this.name = IN_RULE_RECOVERY_EXCEPTION;
    this.message = message;
}
InRuleRecoveryException.prototype = Error.prototype;
//# sourceMappingURL=parser_public.js.map