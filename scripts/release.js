let { runFromPackage, writeToPackageDotJson } = require('./utils')
let chalk = require('chalk');
let log = message => console.log(chalk.green(message))
let version = process.argv[2]

if (! version) {
    return console.log('Whoops, you must pass in a version number to this command as the argument')
}

if (! /[0-9]+\.[0-9]+\.[0-9]+/.test(version)) {
    return console.log('Whoops, the supplies version is invalid: '+version)
}

writeNewAlpineVersion()
writeNewDocsVersion()
buildAssets()

let readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

setTimeout(() => {
    readline.question('Are you sure you want to publish this release: '+version+'?', answer => {
        if (['y', 'Y', 'yes', 'Yes', 'YES'].includes(answer)) publish()

        readline.close();
    });
}, 1000)

function writeNewAlpineVersion() {
    writeToPackageDotJson('e-bus', 'version', version)
    console.log('Bumping e-bus package.json: '+version);
}

function writeNewDocsVersion() {
    let versionWithRevisionSuffix = `${version}-revision.1`

    writeToPackageDotJson('docs', 'version', versionWithRevisionSuffix)
    console.log('Bumping @stephen/ebus-docs package.json: '+version);
}

function buildAssets() {
    console.log('Building assets...')
    require('./build')
}

function publish() {
    console.log('Publishing @stephendltg/e-bus on NPM...');
    runFromPackage('e-bus', 'npm publish')

    console.log('Publishing @stephendltg/docs on NPM...');
    runFromPackage('docs', 'npm publish --access public')

    log('\n\nFinished!')
}
