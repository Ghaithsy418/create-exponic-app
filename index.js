#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { npmTemplate } from './src/npmTemplate.js';
import slugify from '@sindresorhus/slugify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let projectName = process.argv[2];

async function main() {
  const questions = [];
  let installingDeps =
    'npm install dotenv express mongoose -D @eslint/js eslint globals morgan nodemon';

  if (!projectName)
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'What would you like to name your project?',
      validate: (input) => {
        if (!input) return 'Project name cannot be empty.';
        return true;
      },
    });

  questions.push({
    type: 'list',
    name: 'languageChoice',
    message: 'Which language would you like to use?',
    choices: ['JavaScript', 'TypeScript'],
  });

  const answers = await inquirer.prompt(questions);

  projectName = projectName || answers.projectName;

  let templatePath;

  if (answers.languageChoice === 'JavaScript')
    templatePath = path.join(__dirname, 'template-js');
  else if (answers.languageChoice === 'TypeScript') {
    templatePath = path.join(__dirname, 'template-ts');
    installingDeps =
      installingDeps +
      ' ts-node @types/express @types/morgan @types/node jiti typescript typescript-eslint';
  }

  const currentPath = process.cwd();
  const projectPath = path.join(currentPath, projectName);

  try {
    console.log(`📁 Creating new project in: ${projectPath}`);
    await fs.mkdir(projectPath);

    console.log('📄 Creating Files...');
    await fs.copy(templatePath, projectPath);

    fs.writeFileSync(
      `${projectPath}/package.json`,
      JSON.stringify(npmTemplate(slugify(projectName, { lower: true })))
    );

    console.log(chalk.green('✅ Files Created Successfully!'));

    console.log(chalk.red('📦 Installing dependencies...'));
    process.chdir(projectPath);
    execSync(installingDeps);

    console.log('\n🚀 Success! Your new project is ready.');
    console.log(`\nTo get started, run the following commands:`);
    console.log(chalk.magenta(`   cd ${projectName}`));
    console.log(chalk.magenta(`   npm run dev`));
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.error(
        `❌ The folder '${projectName}' already exists. Please choose another name.`
      );
    } else {
      console.error(error);
    }
  }
}

main();
