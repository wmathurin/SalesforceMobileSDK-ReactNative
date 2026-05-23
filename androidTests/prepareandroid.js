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
