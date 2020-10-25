import * as fs from 'fs';
import { Index } from '../class/index';

// This is the path from root (package.json runs this)
// const testFolder = 'src/recipeDebug';
const testFolder = 'src/recipesNewFormat';
const cwd = process.cwd();

// This creates the html files in the dist folder
function generateRecipe(file: string) {
  const MealRecipe = require(`${cwd}/${testFolder}/${file}`).MealRecipe;
  const recipe = new MealRecipe();

  recipe.generateRecipes();
  recipe.writeRecipe();
}

function run() {
  // This loops through all the recipes
  const files = fs.readdirSync(testFolder);

  for (const file of files) {
    generateRecipe(file);
  }

  // This creates the index
  Index.generate();
}

run();
