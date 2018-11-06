var JhiMissingTranslationHandler = /** @class */ (function () {
    function JhiMissingTranslationHandler(configService) {
        this.configService = configService;
    }
    JhiMissingTranslationHandler.prototype.handle = function (params) {
        var key = params.key;
        return this.configService.getConfig().noi18nMessage + "[" + key + "]";
    };
    return JhiMissingTranslationHandler;
}());
export { JhiMissingTranslationHandler };
