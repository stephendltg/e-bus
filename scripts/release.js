#!/usr/bin/env node

/**
 * Name: Release
 * Description: package release
 * Author: stephen D.
 * Version: 1.0.0
 */

const prompts = require('prompts')
let chalk = require('chalk');
let { runFromPackage, writeToPackageDotJson, getFromPackageDotJson, run } = require('./utils')

async function init() {

  let target = 'e-bus'

  const response = await prompts(
    [
      {
        type: 'select',
        name: 'package',
        message: 'Select a package',
        choices: [
          { title: 'e-bus', description: getFromPackageDotJson('e-bus', 'description'), value: 'e-bus' },
          { title: 'docs', description: getFromPackageDotJson('docs', 'description'), value: 'docs' }
        ],
        initial: 1,
        onState: (state) => target = state.value
      },
      {
      type: 'text',
      name: 'version',
      message: () => `${target} version: [actual: ${getFromPackageDotJson( target, 'version')}]`,
      initial: getFromPackageDotJson( target, 'version'),
      validate: value => ! /[0-9]+\.[0-9]+\.[0-9]+/.test(value) ? `Whoops, the supplies version is invalid` : true
      },
      {
        type: 'confirm',
        name: 'npm',
        message: 'Are you sure you want to publish this release ?',
        initial: false
      }
    ]);

  const { package, version, npm } = response

  if (package === 'docs') {
    let docsVersion = getFromPackageDotJson('docs', 'version')
    let ebusVersion = getFromPackageDotJson('e-bus', 'version')
    let revision = docsVersion.match(/revision\.([0-9]+)/)[1]
    let newVersion = ebusVersion + '-revision.' + (Number(revision) + 1)
    writeToPackageDotJson(package, 'version', newVersion);
  } else {
    writeToPackageDotJson(package, 'version', version);
  }
  console.log(chalk.green('✔'), chalk.green(`Bumping ${package} package.json: ${version}`));

  console.log(chalk.blue('ℹ'), chalk.blue('Building assets...'));
  run('npm run build')
  console.log(chalk.blue('✔'), chalk.green('Build'));

  if(npm) {
    console.log(chalk.yellow('⚠'), chalk.yellow(`Publishing ${getFromPackageDotJson(package, 'name')} on NPM...`));
    runFromPackage(package, 'npm publish')
  }
  
  console.log(chalk.blue('✔'), chalk.green('Finish'));
}


init().catch((e) => {
  console.error(chalk.red('✖'), e)
})