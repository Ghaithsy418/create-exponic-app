#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim().toLowerCase());
    })
  );
}

let projectName = process.argv[2];

async function main() {
  if (!projectName) {
    projectName = await askQuestion(
      "What would you like to name your project?"
    );
  }

  if (!projectName) {
    console.error("❌ Project name not provided. Exiting.");
    return;
  }

  let languageChoice = await askQuestion(
    "Which language would you like to use? (JavaScript / TypeScript) "
  );

  let templatePath;

  if (languageChoice === "javascript" || languageChoice === "js")
    templatePath = path.join(__dirname, "template-js");
  else if (languageChoice === "typescript" || languageChoice === "ts")
    templatePath = path.join(__dirname, "template-ts");
  else {
    console.error(
      "❌ Invalid language choice. Please choose JavaScript or TypeScript."
    );
    return;
  }

  const currentPath = process.cwd();
  const projectPath = path.join(currentPath, projectName);

  try {
    console.log(`📁 Creating new project in: ${projectPath}`);
    await fs.mkdir(projectPath);

    console.log("📄 Copying template files...");
    await fs.copy(templatePath, projectPath);

    console.log("✅ Template copied successfully!");

    console.log("📦 Installing dependencies...");
    process.chdir(projectPath);
    execSync("npm install");

    console.log("\n🚀 Success! Your new project is ready.");
    console.log(`\nTo get started, run the following commands:`);
    console.log(`   cd ${projectName}`);
    console.log(`   npm run dev`);
  } catch (error) {
    if (error.code === "EEXIST") {
      console.error(
        `❌ The folder '${projectName}' already exists. Please choose another name.`
      );
    } else {
      console.error(error);
    }
  }
}

main();
