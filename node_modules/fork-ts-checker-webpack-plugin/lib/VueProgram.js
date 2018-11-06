"use strict";
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var vueParser = require("vue-parser");
var VueProgram = /** @class */ (function () {
    function VueProgram() {
    }
    VueProgram.loadProgramConfig = function (configFile) {
        var extraExtensions = ['vue'];
        var parseConfigHost = {
            fileExists: ts.sys.fileExists,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
            readDirectory: function (rootDir, extensions, excludes, includes, depth) {
                return ts.sys.readDirectory(rootDir, extensions.concat(extraExtensions), excludes, includes, depth);
            }
        };
        var parsed = ts.parseJsonConfigFileContent(
        // Regardless of the setting in the tsconfig.json we want isolatedModules to be false
        Object.assign(ts.readConfigFile(configFile, ts.sys.readFile).config, { isolatedModules: false }), parseConfigHost, path.dirname(configFile));
        parsed.options.allowNonTsExtensions = true;
        return parsed;
    };
    /**
     * Search for default wildcard or wildcard from options, we only search for that in tsconfig CompilerOptions.paths.
     * The path is resolved with thie given substitution and includes the CompilerOptions.baseUrl (if given).
     * If no paths given in tsconfig, then the default substitution is '[tsconfig directory]/src'.
     * (This is a fast, simplified inspiration of what's described here: https://github.com/Microsoft/TypeScript/issues/5039)
     */
    VueProgram.resolveNonTsModuleName = function (moduleName, containingFile, basedir, options) {
        var baseUrl = options.baseUrl ? options.baseUrl : basedir;
        var discardedSymbols = ['.', '..', '/'];
        var wildcards = [];
        if (options.paths) {
            Object.keys(options.paths).forEach(function (key) {
                var pathSymbol = key[0];
                if (discardedSymbols.indexOf(pathSymbol) < 0 && wildcards.indexOf(pathSymbol) < 0) {
                    wildcards.push(pathSymbol);
                }
            });
        }
        else {
            wildcards.push('@');
        }
        var isRelative = !path.isAbsolute(moduleName);
        var correctWildcard;
        wildcards.forEach(function (wildcard) {
            if (moduleName.substr(0, 2) === wildcard + "/") {
                correctWildcard = wildcard;
            }
        });
        if (correctWildcard) {
            var pattern = options.paths ? options.paths[correctWildcard + "/*"] : undefined;
            var substitution = pattern ? options.paths[correctWildcard + "/*"][0].replace('*', '') : 'src';
            moduleName = path.resolve(baseUrl, substitution, moduleName.substr(2));
        }
        else if (isRelative) {
            moduleName = path.resolve(path.dirname(containingFile), moduleName);
        }
        return moduleName;
    };
    VueProgram.isVue = function (filePath) {
        return path.extname(filePath) === '.vue';
    };
    VueProgram.createProgram = function (programConfig, basedir, files, watcher, oldProgram) {
        var host = ts.createCompilerHost(programConfig.options);
        var realGetSourceFile = host.getSourceFile;
        var getScriptKind = function (lang) {
            if (lang === "ts") {
                return ts.ScriptKind.TS;
            }
            else if (lang === "tsx") {
                return ts.ScriptKind.TSX;
            }
            else if (lang === "jsx") {
                return ts.ScriptKind.JSX;
            }
            else {
                // when lang is "js" or no lang specified
                return ts.ScriptKind.JS;
            }
        };
        // We need a host that can parse Vue SFCs (single file components).
        host.getSourceFile = function (filePath, languageVersion, onError) {
            // first check if watcher is watching file - if not - check it's mtime
            if (!watcher.isWatchingFile(filePath)) {
                try {
                    var stats = fs.statSync(filePath);
                    files.setMtime(filePath, stats.mtime.valueOf());
                }
                catch (e) {
                    // probably file does not exists
                    files.remove(filePath);
                }
            }
            // get source file only if there is no source in files register
            if (!files.has(filePath) || !files.getData(filePath).source) {
                files.mutateData(filePath, function (data) {
                    data.source = realGetSourceFile(filePath, languageVersion, onError);
                });
            }
            var source = files.getData(filePath).source;
            // get typescript contents from Vue file
            if (source && VueProgram.isVue(filePath)) {
                var parsed = void 0;
                var kind = void 0;
                for (var _i = 0, _a = ['ts', 'tsx', 'js', 'jsx']; _i < _a.length; _i++) {
                    var lang = _a[_i];
                    parsed = vueParser.parse(source.text, 'script', { lang: [lang], emptyExport: false });
                    if (parsed) {
                        kind = getScriptKind(lang);
                        break;
                    }
                }
                if (!parsed) {
                    // when script tag has no lang, or no script tag given
                    parsed = vueParser.parse(source.text, 'script');
                    kind = ts.ScriptKind.JS;
                }
                source = ts.createSourceFile(filePath, parsed, languageVersion, true, kind);
            }
            return source;
        };
        // We need a host with special module resolution for Vue files.
        host.resolveModuleNames = function (moduleNames, containingFile) {
            var resolvedModules = [];
            for (var _i = 0, moduleNames_1 = moduleNames; _i < moduleNames_1.length; _i++) {
                var moduleName = moduleNames_1[_i];
                // Try to use standard resolution.
                var resolvedModule = ts.resolveModuleName(moduleName, containingFile, programConfig.options, {
                    fileExists: function (fileName) {
                        if (fileName.endsWith('.vue.ts')) {
                            return host.fileExists(fileName.slice(0, -3)) || host.fileExists(fileName);
                        }
                        else {
                            return host.fileExists(fileName);
                        }
                    },
                    readFile: function (fileName) {
                        // This implementation is not necessary. Just for consistent behavior.
                        if (fileName.endsWith('.vue.ts') && !host.fileExists(fileName)) {
                            return host.readFile(fileName.slice(0, -3));
                        }
                        else {
                            return host.readFile(fileName);
                        }
                    }
                }).resolvedModule;
                if (resolvedModule) {
                    if (resolvedModule.resolvedFileName.endsWith('.vue.ts') && !host.fileExists(resolvedModule.resolvedFileName)) {
                        resolvedModule.resolvedFileName = resolvedModule.resolvedFileName.slice(0, -3);
                    }
                    resolvedModules.push(resolvedModule);
                }
                else {
                    // For non-ts extensions.
                    var absolutePath = VueProgram.resolveNonTsModuleName(moduleName, containingFile, basedir, programConfig.options);
                    if (VueProgram.isVue(moduleName)) {
                        resolvedModules.push({
                            resolvedFileName: absolutePath,
                            extension: '.ts'
                        });
                    }
                    else {
                        resolvedModules.push({
                            // If the file does exist, return an empty string (because we assume user has provided a ".d.ts" file for it).
                            resolvedFileName: host.fileExists(absolutePath) ? '' : absolutePath,
                            extension: '.ts'
                        });
                    }
                }
            }
            return resolvedModules;
        };
        return ts.createProgram(programConfig.fileNames, programConfig.options, host, oldProgram // re-use old program
        );
    };
    return VueProgram;
}());
module.exports = VueProgram;
