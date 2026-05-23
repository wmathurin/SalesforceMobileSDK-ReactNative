#!/usr/bin/env node

var packageJson = require('./package.json');
var execFileSync = require('child_process').execFileSync;
var execSync = require('child_process').execSync;
var path = require('path');
var fs = require('fs');

// Step 1: Install npm dependencies
console.log('Installing npm dependencies');
execSync('yarn install', {stdio:[0,1,2]});

// Step 2: Clone Android SDK
console.log('Installing sdk dependencies');
var sdkDependency = 'SalesforceMobileSDK-Android';
var repoUrlWithBranch = packageJson.sdkDependencies[sdkDependency];
var parts = repoUrlWithBranch.split('#');
var repoUrl = parts[0];
var branch = parts.length > 1 ? parts[1] : 'dev';
var targetDir = path.join('mobile_sdk', sdkDependency);

if (fs.existsSync(targetDir)) {
    console.log(targetDir + ' already exists - if you want to refresh it, please remove it and re-run prepareandroid.js');
} else {
    execFileSync('git', ['clone', '--branch', branch, '--single-branch', '--depth', '1', repoUrl, targetDir], {stdio:[0,1,2]});

    // Remove unnecessary directories
    var rimraf = require('rimraf');
    rimraf.sync(path.join(targetDir, 'hybrid'));
    rimraf.sync(path.join(targetDir, 'native'));
    rimraf.sync(path.join(targetDir, 'libs', 'SalesforceHybrid'));
    rimraf.sync(path.join(targetDir, 'libs', 'SalesforceReact'));
    rimraf.sync(path.join(targetDir, 'libs', 'test'));

    // Patch settings.gradle.kts to exclude sample apps and removed libs
    var settingsFile = path.join(targetDir, 'settings.gradle.kts');
    if (fs.existsSync(settingsFile)) {
        var settings = fs.readFileSync(settingsFile, 'utf8');
        settings = settings.replace(/^include\("(hybrid|native|libs:SalesforceReact|libs:SalesforceHybrid).*$/gm, '// $&');
        fs.writeFileSync(settingsFile, settings, 'utf8');
        console.log('Patched settings.gradle.kts');
    }

    // Patch root build.gradle.kts to remove publish/dokka plugins
    var rootBuildFile = path.join(targetDir, 'build.gradle.kts');
    if (fs.existsSync(rootBuildFile)) {
        var content = fs.readFileSync(rootBuildFile, 'utf8');
        // Remove nexus publish plugin
        content = content.replace(/^apply\(plugin = "io\.github\.gradle-nexus\.publish-plugin"\).*$/gm, '');
        content = content.replace(/^apply\(from = .*publish-root.*\).*$/gm, '');
        // Remove dokka
        content = content.replace(/^apply\(plugin = "org\.jetbrains\.dokka"\).*$/gm, '');
        content = content.replace(/^extensions\.configure[\s\S]*?^}/gm, '');
        content = content.replace(/^dependencies \{[\s\S]*?^}/gm, '');
        content = content.replace(/^tasks\.register<Jar>[\s\S]*?^}/gm, '');
        fs.writeFileSync(rootBuildFile, content, 'utf8');
        console.log('Patched root build.gradle.kts (removed publish/dokka)');
    }

    // Remove publish-module plugin from buildSrc and lib build files
    var buildSrcFile = path.join(targetDir, 'buildSrc', 'src', 'main', 'kotlin', 'publish-module.gradle.kts');
    if (fs.existsSync(buildSrcFile)) {
        // Replace with empty plugin to avoid resolution errors
        fs.writeFileSync(buildSrcFile, '// Stripped for test builds\n', 'utf8');
        console.log('Stripped publish-module plugin');
    }

    // Remove dokka plugin from individual lib build.gradle.kts files
    var libsDir = path.join(targetDir, 'libs');
    var libNames = ['SalesforceAnalytics', 'SalesforceSDK', 'SmartStore', 'MobileSync'];
    libNames.forEach(function(lib) {
        var libBuildFile = path.join(libsDir, lib, 'build.gradle.kts');
        if (fs.existsSync(libBuildFile)) {
            var libContent = fs.readFileSync(libBuildFile, 'utf8');
            libContent = libContent.replace(/\s*id\("org\.jetbrains\.dokka"\)/g, '');
            fs.writeFileSync(libBuildFile, libContent, 'utf8');
        }
    });
    console.log('Removed dokka from lib build files');

    // Patch AGP version to 8.12.0 for compatibility with test project
    var buildSrcBuildFile = path.join(targetDir, 'buildSrc', 'build.gradle.kts');
    if (fs.existsSync(buildSrcBuildFile)) {
        var bsContent = fs.readFileSync(buildSrcBuildFile, 'utf8');
        bsContent = bsContent.replace(/"com\.android\.tools\.build:gradle:[^"]+"/g, '"com.android.tools.build:gradle:8.12.0"');
        fs.writeFileSync(buildSrcBuildFile, bsContent, 'utf8');
        console.log('Patched buildSrc AGP to 8.12.0');
    }
    var rootBuildFileAgp = path.join(targetDir, 'build.gradle.kts');
    if (fs.existsSync(rootBuildFileAgp)) {
        var rootContent = fs.readFileSync(rootBuildFileAgp, 'utf8');
        rootContent = rootContent.replace(/"com\.android\.tools\.build:gradle:[^"]+"/g, '"com.android.tools.build:gradle:8.12.0"');
        fs.writeFileSync(rootBuildFileAgp, rootContent, 'utf8');
        console.log('Patched root build.gradle.kts AGP to 8.12.0');
    }
}

// Step 3: Generate test bundle
console.log('Generating React Native test bundle');
var assetsDir = path.join('android', 'app', 'src', 'main', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, {recursive: true});
}

execFileSync('node', [
    'node_modules/react-native/cli.js', 'bundle',
    '--platform', 'android',
    '--dev', 'true',
    '--entry-file', 'node_modules/react-native-force/test/alltests.js',
    '--bundle-output', path.join(assetsDir, 'index.android.bundle'),
    '--assets-dest', assetsDir
], {stdio:[0,1,2]});

// Step 4: Create test credentials placeholder
var credentialsFile = path.join('android', 'app', 'src', 'main', 'assets', 'test_credentials.json');
if (!fs.existsSync(credentialsFile)) {
    fs.writeFileSync(credentialsFile, '{}', 'utf8');
    console.log('Created placeholder test_credentials.json');
}

console.log('Android test preparation complete.');
