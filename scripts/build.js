/**
 * Name: build
 * Description: package builder
 * Author: stephen D.
 * Version: 1.0.0
 */

let fs = require('fs');
let chalk = require('chalk');
let log = message => console.log(chalk.blue(message))
let { writeToPackageDotJson, getFromPackageDotJson, outputSize } = require('./utils');

([
    // Packages:
    'e-bus'
]).forEach(package => {
    if (! fs.existsSync(`./packages/${package}/dist`)) {
        fs.mkdirSync(`./packages/${package}/dist`, 0744);
    }

    // Go through each file in the package's "build" directory
    // and use the appropriate bundling strategy based on its name.
    log(package)
    fs.readdirSync(`./packages/${package}/builds`).forEach(file => {
        bundleFile(package, file)
    });
})

/**
 * Bundle files
 * @param {package name} package 
 * @param {file} file 
 */
function bundleFile(package, file) {
    // Based on the filename, give esbuild a specific configuration to build.
    ({
        // This output file is meant to be loaded in a browser's <script> tag.
        'cdn.js': () => {
            build({
                entryPoints: [`packages/${package}/builds/${file}`],
                outfile: `packages/${package}/dist/${file}`,
                bundle: true,
                platform: 'browser',
                define: { CDN: true },
            }).then(() => {
                outputSize('cdn.js', `packages/${package}/dist/${file}`)
            })

            // Build a minified version.
            build({
                entryPoints: [`packages/${package}/builds/${file}`],
                outfile: `packages/${package}/dist/${file.replace('.js', '.min.js')}`,
                bundle: true,
                minify: true,
                platform: 'browser',
                define: { CDN: true },
            }).then(() => {
                outputSize('cdn.min.js', `packages/${package}/dist/${file.replace('.js', '.min.js')}`)
            })

        },
        // This file outputs two files: an esm module and a cjs module.
        // The ESM one is meant for "import" statements (bundlers and new browsers)
        // and the cjs one is meant for "require" statements (node).
        'module.js': () => {
            build({
                entryPoints: [`packages/${package}/builds/${file}`],
                outfile: `packages/${package}/dist/${file.replace('.js', '.esm.js')}`,
                bundle: true,
                platform: 'neutral',
                mainFields: ['main', 'module'],
            })
            .then(() => {
                outputSize('module.esm.js', `packages/${package}/dist/module.esm.js`)
            })

            build({
                entryPoints: [`packages/${package}/builds/${file}`],
                outfile: `packages/${package}/dist/${file.replace('.js', '.cjs.js')}`,
                bundle: true,
                target: ['node10.4'],
                platform: 'node',
            }).then(() => {
                outputSize('module.cjs.js', `packages/${package}/dist/module.cjs.js`)
                writeToPackageDotJson(package, 'main', `dist/${file.replace('.js', '.cjs.js')}`)
                writeToPackageDotJson(package, 'module', `dist/${file.replace('.js', '.esm.js')}`)
            })
        },
    })[file]()
}

/**
 * Esbuilder
 * @param {options build} options 
 * @returns 
 */
function build(options) {
    options.define || (options.define = {})

    options.define['EBUS_VERSION'] = `'${getFromPackageDotJson('e-bus', 'version')}'`
    options.define['process.env.NODE_ENV'] = process.argv.includes('--watch') ? `'production'` : `'development'`

    return require('esbuild').build({
        watch: process.argv.includes('--watch'),
        ...options,
    }).catch(() => process.exit(1))
}
