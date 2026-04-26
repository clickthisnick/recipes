import { IEstimates, IEstimatesMissing } from './ingredients/ingredient';
import { Ingredients, Units } from '../constants/units';
import { IStep } from './step';
import { Text as text } from './text';
import { Serializer as s } from './serializer';

export interface IVariation {
    [details: string]: Array<new () => Recipe>; // Uninitialized recipe
}

export interface IFoundEquipment {
    [details: string]: boolean; // Uninitialized recipe
}

type RecipeConstructor = new () => Recipe;

function escapeHtmlAttribute(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeInlineScriptJson(value: unknown): string {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}

export class RecipeContainer {
    public recipeHtml = '';
    public recipeType = '';
    public variations: RecipeConstructor[] = [];

    private generateRecipeVariation(
        recipeGroup: string,
        recipeClass: RecipeConstructor,
        includeInVariation = false,
    ): void {
        const initRecipe = new recipeClass();
        const recipeName = recipeClass.name;
        const recipeId = `${recipeGroup}-${recipeName}`;

        // Ensure the recipe is valid.
        initRecipe.validate(recipeGroup, recipeName);

        // Adds the recipe to the JavaScript variable.
        this.recipeHtml += initRecipe.printRecipe(recipeGroup, recipeName);

        const classes = [
            includeInVariation ? `${recipeGroup}-group` : '',
            initRecipe.hideFromCookingView ? 'hideFromCookingView' : '',
        ].filter(Boolean).join(' ');

        const style = includeInVariation ? ' style="display: none"' : '';

        this.recipeHtml += `<button class="${escapeHtmlAttribute(classes)}"${style} onclick="selectRecipe('${escapeHtmlAttribute(recipeId)}')">${escapeHtmlAttribute(recipeName)}</button>`;
    }

    public generateRecipeHtml(filename: string): void {
        let hideUnderRecipeGroup = false;

        // The file name, which is unique but without the extension.
        // TODO: make it space-delimited based on capitalization.
        const recipeGroup = filename.replace(/\.ts$/, '');

        if (this.variations.length > 1) {
            this.recipeHtml += `<div id="${escapeHtmlAttribute(recipeGroup)}-main"><button onclick="showElementsByClassName('${escapeHtmlAttribute(recipeGroup)}-group'); hideElement('${escapeHtmlAttribute(recipeGroup)}-main');">${escapeHtmlAttribute(recipeGroup)} ⇩</button></div>`;
            hideUnderRecipeGroup = true;
        }

        this.variations.forEach(variation => {
            this.generateRecipeVariation(recipeGroup, variation, hideUnderRecipeGroup);
        });

        this.recipeHtml += '<div id="root"></div>';
    }
}

export class Recipe {
    public steps: IStep[] = [];
    public hideFromCookingView = false;
    public ingredients: Ingredients = {};
    // public equipment: IAllEquipment = {};
    public vegan = true;
    public timeEstimateMilliseconds = 0;

    // TODO: expand to other metrics.
    public estimates: IEstimates = {
        calories: 0,
        sodium: 0,
        sugar: 0,
        fiber: 0,
        protein: 0,
        total_cost: 0,
    };

    public estimatesMissing: IEstimatesMissing = {
        calories: [],
        sodium: [],
        sugar: [],
        fiber: [],
        protein: [],
        total_cost: [],
    };

    // private metricsToShow: string[] = Object.keys(this.estimatesMissing);
    // private metrics: string[] = Object.keys(this.estimatesMissing);

    public recipeHtml = '';

    // Whether to auto-show the recipe.
    // Useful if the recipe only has one option.
    public autoShow = false;

    public validate(recipeGroup: string, recipeName: string): void {
        const timers: string[] = [];

        this.steps.forEach(step => {
            if (step.showTimer) {
                timers.push(step.text);
            } else if (step.disappearWhen === 'timerIsUp') {
                timers.shift();
            }
        });

        if (timers.length > 0) {
            // This is during validate, so console.log is useful here.
            console.log(`${recipeGroup} = ${recipeName}`);
            console.log(timers);
            throw new Error('Timers left open');
        }
    }

    public multiplyIngredients(multiple: number): void {
        // This multiplies all ingredient quantities from each step and child step.
        this.steps.forEach(step => {
            step.children?.forEach(child => {
                child.ingredients.forEach(ingredient => {
                    if (ingredient.unit !== Units.none && ingredient.quantity > 0) {
                        ingredient.quantity *= multiple;
                    }
                });
            });

            // Unit could be null. Do not add ingredients whose unit is null;
            // item('hamburger') is an example of that.
            step.ingredients.forEach(ingredient => {
                if (ingredient.unit !== Units.none && ingredient.quantity > 0) {
                    ingredient.quantity *= multiple;
                }
            });
        });
    }

    private addIngredient(step: IStep): void {
        // This adds all the ingredients from each step into ingredients in the main recipe.
        // It also does any transformations, like converting the ingredient to different units.
        step.ingredients.forEach(ingredient => {
            // Unit could be null. Do not add ingredients whose unit is null;
            // item('hamburger') is an example of that.
            if (ingredient.unit === Units.none || ingredient.quantity <= 0) {
                return;
            }

            const existingIngredient = this.ingredients[ingredient.name];

            if (!existingIngredient) {
                this.ingredients[ingredient.name] = ingredient;
                return;
            }

            // If the existing ingredient and the new ingredient have the same unit,
            // then just add the ingredient quantity.
            if (existingIngredient.unit.name === ingredient.unit.name) {
                existingIngredient.quantity += ingredient.quantity;
                return;
            }

            // TODO: You can uncomment this, but then make an option to skip it for recipes
            // like cat food where you do not want to change the units.
            // const units = Units.combineIngredientUnits(existingIngredient, ingredient);

            // if (units) {
            //     // Update the ingredient unit and quantity.
            //     existingIngredient.unit = units.unit;
            //     existingIngredient.quantity = units.quantity;
            // } else {
            //     // If no units could be combined, just add the ingredient to the list under a different name.
            //     this.ingredients[`${ingredient.name} - ${ingredient.unit.name}`] = ingredient;
            // }
            this.ingredients[`${ingredient.name} - ${ingredient.unit.name}`] = ingredient;
        });

        step.children?.forEach(child => {
            this.addIngredient(child);
        });
    }

    private getStepEquipment(step: IStep): string[] {
        const equipment: string[] = [];

        // Calculates all the equipment for the step and its child steps.
        step.equipment.forEach(equipmentItem => {
            equipment.push(equipmentItem);
        });

        step.children?.forEach(childStep => {
            childStep.equipment.forEach(equipmentItem => {
                equipment.push(equipmentItem);
            });
        });

        return equipment;
    }

    private buildStepsWithCleanupSteps(): IStep[] {
        const steps = [...this.steps];
        const foundEquipment: IFoundEquipment = {};

        // Loop backwards and add a step to put away equipment after it is no longer used.
        for (let i = steps.length - 1; i >= 0; --i) {
            const step = steps[i];
            const equipment = this.getStepEquipment(step);

            equipment.forEach(equipmentItem => {
                if (foundEquipment[equipmentItem]) {
                    // If we have already found the equipment once, it must have been from a later step.
                    // We can skip it since we assume it has already been dealt with.
                    return;
                }

                // The +2 adds it one step beyond when it was last used.
                const stepPosition = i + 2 > steps.length - 1 ? i + 1 : i + 2;
                steps.splice(stepPosition, 0, text.set(['Clean and put away', equipmentItem]));

                foundEquipment[equipmentItem] = true;
            });
        }

        return steps;
    }

    public printRecipe(recipeGroup: string, recipeName: string): string {
        // Reset ingredients so repeated calls do not double-count them.
        this.ingredients = {};

        // Add the ingredients from each step of the recipe into the main recipe as combined ingredients.
        this.steps.forEach(step => {
            this.addIngredient(step);
        });

        // Lazy-load the text.
        s.parseLazyLoad(this.steps);

        // Do not mutate this.steps with generated cleanup steps; otherwise repeated printRecipe()
        // calls keep inserting duplicate cleanup steps.
        const recipeForOutput = {
            ...this,
            steps: this.buildStepsWithCleanupSteps(),
        };

        // Loop through the ingredients of the recipe and generate a pricing table for each purchasable link.
        Object.keys(this.ingredients).forEach(ingredientKey => {
            const ingredient = this.ingredients[ingredientKey];
            Units.setPricingTable(ingredient);
        });

        const recipeId = `${recipeGroup}-${recipeName}`;
        const recipeJson = escapeInlineScriptJson(recipeForOutput);

        return `<script>setRecipe('${escapeHtmlAttribute(recipeId)}', ${recipeJson})</script>`;
    }
}
