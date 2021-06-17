/**
 * Name: Utils
 * Description: Utils functions
 * Author: stephen D.
 * Version: 1.0.0
 */

let fs = require('fs');
let DotJson = require('dot-json');
let { execSync } = require('child_process');
let brotliSize = require('brotli-size');

/**
 * Bytes to size
 * @param {Size} bytes 
 * @returns 
 */
const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]}`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Exec command in specific dir
 * @param {package name} package 
 * @param {command bash} command 
 */
module.exports.runFromPackage = function (package, command) {
    execSync(command, { cwd: __dirname+'/../packages/'+package }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    })
}

/**
 * Exec command
 * @param {command bash} command 
 */
module.exports.run = function (command) {
    execSync(command, { cwd: __dirname+'/..' })
}

/**
 * Write field in package json
 * @param {package name} package 
 * @param {field json} key 
 * @param {field value} value 
 */
module.exports.writeToPackageDotJson = function (package, key, value) {
    let dotJson = new DotJson(`./packages/${package}/package.json`)
    dotJson.set(key, value).save()
}

/**
 * Read field in package json
 * @param {package name} package 
 * @param {field} key 
 * @returns 
 */
module.exports.getFromPackageDotJson = function (package, key) {
    let dotJson = new DotJson(`./packages/${package}/package.json`)
    return dotJson.get(key)
}

/**
 * Size file build
 * @param {package name} package 
 * @param {file} file 
 */
module.exports.outputSize = function (package, file) {
    let size = bytesToSize(brotliSize.sync(fs.readFileSync(file)))
    console.log("\x1b[32m", `${package}: ${size}`)
}
