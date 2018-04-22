import * as fs from 'fs';
import { Readme } from '../class/readme';

// This is the path from root (package.json runs this)
const testFolder = 'src/recipes';
const cwd = process.cwd();

// This creates the html files in the dist folder
async function generateRecipe(file) {
  const MealRecipe = require(`${cwd}/${testFolder}/${file}`).MealRecipe;
  const recipe = new MealRecipe();

  await recipe.generateRecipe();
}

async function run() {
  // This loops through all the recipes
  await new Promise((resolve) => {
    fs.readdir(testFolder, (_, files) => {
      files.forEach(async (file) => {
        await generateRecipe(file);
      });
      resolve();
    });
  });

  // This creates the readme
  Readme.makeReadme();
}

run();
