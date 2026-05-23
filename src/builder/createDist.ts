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
<button id="shoppingButton" data-mode="shopping">
    Shopping Mode
</button>

<button id="cookingButton" data-mode="cooking">
    Cooking Mode
</button>

<br>

<div id="shopping" style="display: none;">
    Shopping List

    <button id="shoppingListButton" style="display: none;">
        Save Shopping Url
    </button>

    <br>

    <span id="shoppingUrl"></span>
</div>

<br>

<div id="cooking" style="display: none;">
    Cooking List
</div>

<br>

<div id="selected" style="display: none;">
    Selected Recipes

    <div id="selectedRecipeGroupNames"></div>

    <br>
</div>

<div id="select" style="display: none;">
    Select Recipes

    <br>

    <button id="doneSelectingRecipesButton">
        Done Selecting
    </button>

    <br>
`,
    ].join('');
}

function getClosingHtml(): string {
    return `
</div>

<br>

<script>
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    setupModeButtons();

    getById('doneSelectingRecipesButton')
        ?.addEventListener('click', doneSelectingRecipes);

    getById('shoppingListButton')
        ?.addEventListener('click', saveShoppingUrl);
}

function setupModeButtons() {
    document
        .querySelectorAll('[data-mode]')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const mode = button.dataset.mode;

                if (mode) {
                    selectMode(mode);
                }
            });
        });
}
</script>
`;
}

function isRecipeFile(filename: string): boolean {
    return filename.endsWith('.ts') || filename.endsWith('.js');
}

function generateRecipeHtml(filename: string): string {
    const recipePath = path.join(recipeFolder, filename);

    const recipeModule = require(recipePath);

    if (!recipeModule.MealRecipe) {
        console.warn(
            'Skipping recipe without MealRecipe export:',
            filename
        );

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
        .sort((a, b) => a.localeCompare(b));

    filenames.forEach((filename) => {
        pageHtml += generateRecipeHtml(filename);
    });

    pageHtml += getClosingHtml();

    fs.mkdirSync(distFolder, { recursive: true });

    fs.writeFileSync(outputFile, pageHtml);

    console.log('✅ Generated:', outputFile);
}

run();