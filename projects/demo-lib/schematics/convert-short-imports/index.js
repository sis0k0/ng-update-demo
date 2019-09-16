"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("eslint");
const eslint_plugin_nativescript_1 = require("eslint-plugin-nativescript");
const parser_1 = require("@typescript-eslint/parser");
const utils_1 = require("../utils");
const ALLOWED_EXTENSIONS = [
    'ts',
    'js',
];
function default_1(options) {
    return (tree, context) => {
        const { logger } = context;
        const filesToFix = getFilesToFix(tree, options.srcPath, options.filesToIgnore);
        if (filesToFix.size === 0) {
            logger.debug('Convert Short Imports: No files to fix.');
            return tree;
        }
        return fixImports(tree, filesToFix, logger);
    };
}
exports.default = default_1;
function getFilesToFix(tree, srcPath, filesToIgnore = []) {
    const isIgnoredFile = (file) => filesToIgnore.some((fileToIgnore) => fileToIgnore === file);
    const hasAllowedExtension = (path) => ALLOWED_EXTENSIONS.some((extension) => path.endsWith(extension));
    const srcDirectory = tree.getDir(srcPath);
    const files = new Set();
    srcDirectory.visit((path) => {
        const normalizedPath = path.substr(1); // Remove the starting '/'.
        if (hasAllowedExtension(normalizedPath) && !isIgnoredFile(normalizedPath)) {
            files.add(path);
        }
    });
    return files;
}
function fixImports(tree, filePaths, logger) {
    filePaths.forEach((path) => {
        const content = utils_1.getFileContents(tree, path);
        const fixedContent = applyEsLintRuleFixes(content, path, logger);
        if (content !== fixedContent) {
            tree.overwrite(path, fixedContent);
        }
    });
    return tree;
}
function applyEsLintRuleFixes(fileContent, fileName, logger) {
    const SHORT_IMPORTS_RULE_NAME = 'no-short-imports';
    const PARSER_NAME = '@typescript-eslint/parser';
    const linter = new eslint_1.Linter();
    linter.defineRule(SHORT_IMPORTS_RULE_NAME, eslint_plugin_nativescript_1.rules[SHORT_IMPORTS_RULE_NAME]);
    linter.defineParser(PARSER_NAME, {
        parse: parser_1.parse,
    });
    const messages = linter.verifyAndFix(fileContent, {
        parser: PARSER_NAME,
        parserOptions: {
            sourceType: 'module',
            ecmaVersion: 2015,
        },
        rules: {
            [SHORT_IMPORTS_RULE_NAME]: 'error',
        },
    });
    if (!messages.fixed) {
        logger.debug(`Convert Short Imports: No fixes applied to ${fileName}.`);
    }
    const fixedContent = messages.output;
    return fixedContent;
}
//# sourceMappingURL=index.js.map