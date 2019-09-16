"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const testing_1 = require("@angular-devkit/schematics/testing");
const test_1 = require("@schematics/angular/utility/test");
const test_utils_1 = require("../test-utils");
const srcPath = 'src';
const defaultOptions = {
    project: 'my-app',
    srcPath,
};
const projSetup = {
    projectName: defaultOptions.project,
    sourceDirectory: srcPath,
};
const aboutModulePath = `${srcPath}/about/about.module.ts`;
const shortImportContent = `
  import { SearchBar } from 'ui/search-bar';
`;
const fixedImportContent = `
  import { SearchBar } from 'tns-core-modules/ui/search-bar';
`;
describe('Convert short imports to full imports with "tns-core-modules" prefix', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('nativescript-schematics', path_1.join(__dirname, '../collection.json'));
    it('should convert the short imports in a newly generated file', () => __awaiter(this, void 0, void 0, function* () {
        let appTree = test_utils_1.createTestProject(projSetup);
        appTree.create(aboutModulePath, shortImportContent);
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', defaultOptions, appTree).toPromise();
        const actual = test_1.getFileContent(appTree, aboutModulePath);
        expect(actual).toEqual(fixedImportContent);
    }));
    it('should convert the short imports in a modified file', () => __awaiter(this, void 0, void 0, function* () {
        const existingContent = `placeholder`;
        const modifiedContent = `
      import { SearchBar } from 'ui/search-bar';
    `;
        const expected = `
      import { SearchBar } from 'tns-core-modules/ui/search-bar';
    `;
        let appTree = test_utils_1.createTestProject(projSetup, [{
                path: aboutModulePath,
                content: existingContent,
            }]);
        appTree.overwrite(aboutModulePath, modifiedContent);
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', defaultOptions, appTree).toPromise();
        const actual = test_1.getFileContent(appTree, aboutModulePath);
        expect(actual).toEqual(expected);
    }));
    it('should convert the short imports in a created and then renamed file', () => __awaiter(this, void 0, void 0, function* () {
        let appTree = test_utils_1.createTestProject(projSetup);
        const renamedFilePath = aboutModulePath.replace('.ts', '.tns.ts');
        appTree.create(aboutModulePath, shortImportContent);
        appTree.rename(aboutModulePath, renamedFilePath);
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', defaultOptions, appTree).toPromise();
        const actual = test_1.getFileContent(appTree, renamedFilePath);
        expect(actual).toEqual(fixedImportContent);
    }));
    it('should modify files that weren\'t modified', () => __awaiter(this, void 0, void 0, function* () {
        let appTree = test_utils_1.createTestProject(projSetup, [{
                path: aboutModulePath,
                content: shortImportContent,
            }]);
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', defaultOptions, appTree).toPromise();
        const actual = test_1.getFileContent(appTree, aboutModulePath);
        expect(actual).toEqual(fixedImportContent);
    }));
    it('should modify files with .js extension', () => __awaiter(this, void 0, void 0, function* () {
        let appTree = test_utils_1.createTestProject(projSetup);
        const generatedFilePath = `${srcPath}/about/about.component.js`;
        const shortRequireContent = 'const SearchBar = require("ui/search-bar").SearchBar';
        const fixedContent = 'const SearchBar = require("tns-core-modules/ui/search-bar").SearchBar';
        appTree.create(generatedFilePath, shortRequireContent);
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', defaultOptions, appTree).toPromise();
        const actual = test_1.getFileContent(appTree, generatedFilePath);
        expect(actual).toEqual(fixedContent);
    }));
    it('should not modify files with extension other than .ts and .js', () => __awaiter(this, void 0, void 0, function* () {
        let appTree = test_utils_1.createTestProject(projSetup);
        const generatedFilePath = `${srcPath}/about/about.component.tsx`;
        appTree.create(generatedFilePath, shortImportContent);
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', defaultOptions, appTree).toPromise();
        const actual = test_1.getFileContent(appTree, generatedFilePath);
        expect(actual).toEqual(shortImportContent);
    }));
    it('should not modify files specified as ignored in the invocation options', () => __awaiter(this, void 0, void 0, function* () {
        let appTree = test_utils_1.createTestProject(projSetup);
        appTree.create(aboutModulePath, shortImportContent);
        const options = Object.assign({}, defaultOptions, { filesToIgnore: [aboutModulePath] });
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', options, appTree).toPromise();
        const actual = test_1.getFileContent(appTree, aboutModulePath);
        expect(actual).toEqual(shortImportContent);
    }));
    it('should not modify files that are deleted by previous rules', () => __awaiter(this, void 0, void 0, function* () {
        let appTree = test_utils_1.createTestProject(projSetup, [{
                path: aboutModulePath,
                content: shortImportContent,
            }]);
        appTree.delete(aboutModulePath);
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', defaultOptions, appTree).toPromise();
        expect(appTree.get(aboutModulePath)).toBeNull();
    }));
    it('should not modify files that were created and then deleted by previous rules', () => __awaiter(this, void 0, void 0, function* () {
        let appTree = test_utils_1.createTestProject(projSetup);
        appTree.create(aboutModulePath, shortImportContent);
        appTree.delete(aboutModulePath);
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', defaultOptions, appTree).toPromise();
        expect(appTree.get(aboutModulePath)).toBeNull();
    }));
    it('should not modify files that were modified and then deleted by previous rules', () => __awaiter(this, void 0, void 0, function* () {
        let appTree = test_utils_1.createTestProject(projSetup, [{
                path: aboutModulePath,
                content: shortImportContent,
            }]);
        appTree.overwrite(aboutModulePath, shortImportContent + '\nconsole.log(\'modified\');\n');
        appTree.delete(aboutModulePath);
        appTree = yield schematicRunner.runSchematicAsync('convert-short-imports', defaultOptions, appTree).toPromise();
        expect(appTree.get(aboutModulePath)).toBeNull();
    }));
});
//# sourceMappingURL=index_spec.js.map