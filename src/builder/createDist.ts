import * as fs from 'fs';
import * as path from 'path';
import { HTML } from '../class/html';

const recipeFolder = path.join(process.cwd(), 'src/recipes');
const distFolder = path.join(process.cwd(), 'dist');
const outputFile = path.join(distFolder, 'main.html');

function getBaseHtml(): string {
    return [
        HTML.mobileViewport,
        HTML.audio,
        HTML.charset,
        HTML.css,
        HTML.javascript(),

        `
<button id="shoppingButton" onclick="selectMode('shopping')">Shopping Mode</button>
<button id="cookingButton" onclick="selectMode('cooking')">Cooking Mode</button>
<br>

<div id="shopping" style="display: none;">
  Shopping List
  <button id="shoppingListButton" style="display: none;" onclick="saveShoppingUrl()">Save Shopping Url</button>
  <br>
  <span id="shoppingUrl"></span>
</div>
<br>

<div id="cooking" style="display: none;">Cooking List</div>
<br>

<div id="selected" style="display: none;">
  Selected Recipes
  <div id="selectedRecipeGroupNames"></div>
  <br>
</div>

<div id="select" style="display: none;">
  Select Recipes<br>
  <button onclick="doneSelectingRecipes()">Done Selecting</button><br>
`,
    ].join('');
}

function getStartupScript(): string {
    return `
</div><br>

<script>
(function () {
  var recipesSelected = [];

  if (!queryString || !Object.prototype.hasOwnProperty.call(queryString, 'mode')) {
    return;
  }

  var mode = queryString.mode;
  delete queryString.mode;

  if (Object.prototype.hasOwnProperty.call(queryString, 'recipes')) {
    recipesSelected = String(queryString.recipes)
      .split(',')
      .map(function (recipe) {
        return recipe.trim();
      })
      .filter(Boolean);

    delete queryString.recipes;
  }

  selectMode(mode);

  if (mode === 'shopping') {
    var shoppingEl = document.getElementById('shopping');

    if (shoppingEl && typeof recipes !== 'undefined') {
      shoppingEl.innerHTML += recipes;
    }

    Object.keys(queryString).forEach(function (key) {
      var item;

      try {
        item = JSON.parse(queryString[key]);
      } catch (e) {
        console.warn('Skipping invalid shopping item:', key, queryString[key]);
        return;
      }

      // Backwards-compatible expected format:
      // ?apple=["g",100]
      if (!Array.isArray(item) || item.length < 2) {
        console.warn('Skipping malformed shopping item:', key, item);
        return;
      }

      var unit = item[0];
      var quantity = item[1];

      if (!ingredients[key]) {
        ingredients[key] = {};
      }

      if (!ingredients[key].units) {
        ingredients[key].units = {};
      }

      ingredients[key].units[unit] = quantity;
    });
  } else if (mode === 'cooking') {
    recipesSelected.forEach(function (recipeGroupName) {
      selectRecipe(recipeGroupName);
    });
  }

  doneSelectingRecipes();
})();
</script>`;
}

function isRecipeFile(filename: string): boolean {
    return filename.endsWith('.ts') || filename.endsWith('.js');
}

function generateRecipeHtml(filename: string): string {
    const recipePath = path.join(recipeFolder, filename);
    const recipeModule = require(recipePath);

    if (!recipeModule.MealRecipe) {
        console.warn('Skipping recipe without MealRecipe export:', filename);
        return '';
    }

    const recipe = new recipeModule.MealRecipe();

    recipe.generateRecipeHtml(filename);

    return recipe.recipeHtml || '';
}

function run(): void {
    let pageHtml = getBaseHtml();

    const filenames = fs
        .readdirSync(recipeFolder)
        .filter(isRecipeFile)
        .sort(function (a, b) {
            return a.localeCompare(b);
        });

    filenames.forEach(function (filename) {
        pageHtml += generateRecipeHtml(filename);
    });

    pageHtml += getStartupScript();

    fs.mkdirSync(distFolder, { recursive: true });
    fs.writeFileSync(outputFile, pageHtml);
}

run();
