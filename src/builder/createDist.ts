import * as fs from 'fs';
import { HTML } from '../class/html';
// import { IAllIngredientUnits } from '../constants/units';

//import { Index } from '../class/index';
//import { IStep } from '../class/step';

// This is the path from root (package.json runs this)
const testFolder = 'src/recipeDebug';
// const testFolder = 'src/recipeDebug';
// const testFolder = 'src/recipesNewFormat';
const cwd = process.cwd();

let pageHtml = ''
pageHtml += HTML.mobileViewport;
pageHtml += HTML.chartSet;
pageHtml += HTML.css;
pageHtml += HTML.javascript();
// Shopping mode allows you to select recipes and get all the ingredients needed for all recipes
// Cooking mode allows you to select recipes and optimizes the cooking
pageHtml += `<button id="shoppingButton" onclick="selectMode('shopping')">Shopping Mode</button><button id="cookingButton" onclick="selectMode('cooking')">Cooking Mode</button><br>`
pageHtml += '<div id="shopping" style="display: none;">Shopping List<button onclick="saveShoppingUrl()">Save Shopping Url</button><br><span id="shoppingUrl"></span></div><br>'
pageHtml += '<div id="cooking" style="display: none;">Cooking List</div><br>'



pageHtml += '<div id="select" style="display: none;">Select Recipes<br>'
// add all recipes to javascript variable
pageHtml += `<button onclick="doneSelectingRecipes()">Done Selecting</button><br>`

// This creates the html files in the dist folder
function generateRecipe(file: string) {
  const MealRecipe = require(`${cwd}/${testFolder}/${file}`).MealRecipe;
  const recipe = new MealRecipe();

  if (recipe.variations.length > 1) {
    if (recipe.recipeName === "") {
      throw new Error(`No recipe name for many variations ${recipe.variations}`)
    }
  }

  // Apply any transformations needed for recipes
  // For example we are going to convert all recipes to calculate prices for the ingredients
  // priceConversionTable
  // TODO nick
  // This is just casting the ingredients
  // console.log(recipe);
  // const recipeIngredients: IAllIngredientUnits[] = recipe.ingredients
  // recipeIngredients.forEach(ingredients => {
  //   console.log(ingredients.quantity_unit)
  // })

  recipe.generateRecipeHtml();
//   this.variations.forEach(variation => {
//     this.generateRecipeVariation(variation, hideUnderRecipeGroup)
// })

  // const initRecipe: Recipe = new recipeClass();
  // const recipeName = recipeClass.name;

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

    // Parse any queryStrings
    pageHtml += `
    <script>
    if (queryString.hasOwnProperty('mode')) {
        let mode = queryString['mode']
        delete queryString['mode'];

        if (queryString.hasOwnProperty('recipes')) {
          let recipes = queryString['recipes']
          delete queryString['recipes'];
          document.getElementById('shopping').innerHTML += recipes
        }

        selectMode(mode)

        if (mode == 'shopping') {
          Object.keys(queryString).forEach(key => {
            // [unit, quantity]
            let item = JSON.parse(queryString[key]);

            ingredients[key] = {}

            // Put the units and values in the correct spot
            // The assumption here is if you are clicking the link you are going somewhere to buy
            // Whereas when you originally generate the link you get the online purchase options
            ingredients[key]['units'] = {}
            ingredients[key]['units'][item[0]] = item[1]

          })
        }
        doneSelectingRecipes()
    }
    </script>`

  // Just setting to lowercase incase git isn't case sensitive (Like on osx/windows)
  fs.writeFileSync(`${process.cwd()}/dist/${recipeName.toLowerCase()}.html`, pageHtml);

  // This creates the index
  // Index.generate();
}

run();
