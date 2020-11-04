import * as fs from 'fs';
import { HTML } from '../class/html';
//import { Index } from '../class/index';
//import { IStep } from '../class/step';

// This is the path from root (package.json runs this)
const testFolder = 'src/recipeDebug';
// const testFolder = 'src/recipesNewFormat';
const cwd = process.cwd();

let pageHtml = ''
pageHtml += HTML.mobileViewport;
pageHtml += HTML.chartSet;
pageHtml += HTML.css;
pageHtml += HTML.javascript;
// Shopping mode allows you to select recipes and get all the ingredients needed for all recipes
// Cooking mode allows you to select recipes and optimizes the cooking
pageHtml += `<button id="shoppingButton" onclick="selectMode('shopping')">Shopping Mode</button><button id="cookingButton" onclick="selectMode('cooking')">Cooking Mode</button><br>`
pageHtml += '<div id="shopping" style="display: none;">Shopping List</div><br>'
pageHtml += '<div id="cooking" style="display: none;">Cooking List</div><br>'



pageHtml += '<div id="select" style="display: none;">Select Recipes<br>'
// add all recipes to javascript variable
pageHtml += `<button onclick="doneSelectingRecipes()">Done Selecting</button><br>`

// This creates the html files in the dist folder
function generateRecipe(file: string) {
  const MealRecipe = require(`${cwd}/${testFolder}/${file}`).MealRecipe;
  const recipe = new MealRecipe();

  recipe.generateRecipes();
  pageHtml += recipe.recipeHtml
}

function run() {
  // This loops through all the recipes
  const files = fs.readdirSync(testFolder);

  for (const file of files) {
    generateRecipe(file);
  }

  const recipeName = 'main';

  // Close the select div
  pageHtml += '</div><br>'

  // Just setting to lowercase incase git isn't case sensitive (Like on osx/windows)
  fs.writeFileSync(`${process.cwd()}/dist/${recipeName.toLowerCase()}.html`, pageHtml);

  // This creates the index
  // Index.generate();
}

run();
