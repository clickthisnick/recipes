import * as fs from 'fs';
import { Readme } from '../class/readme';

// This is the path from root (package.json runs this)
const testFolder = 'src/recipes';
const cwd = process.cwd();

// This creates the html files in the dist folder
function generateRecipe(file: string) {
  const MealRecipe = require(`${cwd}/${testFolder}/${file}`).MealRecipe;
  const recipe = new MealRecipe();

  recipe.generateRecipe();
  recipe.writeRecipe();
}

function run() {
  // This loops through all the recipes
  const files = fs.readdirSync(testFolder);

  for (const file of files) {
    generateRecipe(file);
  }

  // This creates the readme
  Readme.makeReadme();
}

run();
