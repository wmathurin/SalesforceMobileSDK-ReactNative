#!/usr/bin/env node

var execSync = require('child_process').execSync;
var path = require('path');
var fs = require('fs');

console.log('=== Installing npm dependencies');
execSync('rm -rf node_modules', {stdio:[0,1,2]});
execSync('rm -f yarn.lock', {stdio:[0,1,2]});
execSync('yarn install', {stdio:[0,1,2]});

console.log('=== Installing sdk dependencies');
execSync('node ./updatesdk.js', {stdio: [0,1,2]});

console.log('=== Creating test_credentials.json');
var assetsDir = path.join('android', 'app', 'src', 'main', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, {recursive: true});
}
var credentialsFile = path.join(assetsDir, 'test_credentials.json');
if (!fs.existsSync(credentialsFile)) {
    fs.writeFileSync(credentialsFile, '{}', 'utf8');
}

console.log('=== Creating index.android.bundle');
execSync('node ./updatebundle.js', {stdio: [0,1,2]});

console.log('=== Android test preparation complete.');
