import { IEstimates, IEstimatesMissing } from './ingredients/ingredient';
import { Ingredients, Units } from '../constants/units';
import { IStep } from './step';
import { Text as text } from './text';
import { Serializer as s } from './serializer';

export interface IVariation {
    [details: string]: Array<new () => Recipe>;
}

export interface IFoundEquipment {
    [details: string]: boolean;
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
        includeInVariation = false
    ): void {
        const initRecipe = new recipeClass();
        const recipeName = recipeClass.name;
        const recipeId = `${recipeGroup}-${recipeName}`;

        initRecipe.validate(recipeGroup, recipeName);

        this.recipeHtml += initRecipe.printRecipe(recipeGroup, recipeName);

        const classes = [
            'recipe-select-button',
            includeInVariation ? `${recipeGroup}-group` : '',
            initRecipe.hideFromCookingView ? 'hideFromCookingView' : '',
        ]
            .filter(Boolean)
            .join(' ');

        const style = includeInVariation ? ' style="display: none"' : '';

        this.recipeHtml += `
<button
    class="${escapeHtmlAttribute(classes)}"
    data-recipe-group-name="${escapeHtmlAttribute(recipeId)}"
    ${style}
>
    ${escapeHtmlAttribute(recipeName)}
</button>`;
    }

    public generateRecipeHtml(filename: string): void {
        let hideUnderRecipeGroup = false;
        const recipeGroup = filename.replace(/\.(ts|js)$/, '');

        if (this.variations.length > 1) {
            this.recipeHtml += `
<div id="${escapeHtmlAttribute(recipeGroup)}-main">
    <button
        class="recipe-group-toggle-button"
        data-recipe-group="${escapeHtmlAttribute(recipeGroup)}"
    >
        ${escapeHtmlAttribute(recipeGroup)} ⇩
    </button>
</div>`;
            hideUnderRecipeGroup = true;
        }

        this.variations.forEach((variation) => {
            this.generateRecipeVariation(recipeGroup, variation, hideUnderRecipeGroup);
        });

        this.recipeHtml += '<div id="root"></div>';
    }
}

export class Recipe {
    public steps: IStep[] = [];
    public hideFromCookingView = false;
    public ingredients: Ingredients = {};
    public vegan = true;
    public timeEstimateMilliseconds = 0;

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

    public recipeHtml = '';
    public autoShow = false;

    public validate(recipeGroup: string, recipeName: string): void {
        const timers: string[] = [];

        this.steps.forEach((step) => {
            if (step.showTimer) {
                timers.push(step.text);
            } else if (step.disappearWhen === 'timerIsUp') {
                timers.shift();
            }
        });

        if (timers.length > 0) {
            console.log(`${recipeGroup} = ${recipeName}`);
            console.log(timers);
            throw new Error('Timers left open');
        }
    }

    public multiplyIngredients(multiple: number): void {
        this.steps.forEach((step) => {
            step.children?.forEach((child) => {
                child.ingredients.forEach((ingredient) => {
                    if (ingredient.unit !== Units.none && ingredient.quantity > 0) {
                        ingredient.quantity *= multiple;
                    }
                });
            });

            step.ingredients.forEach((ingredient) => {
                if (ingredient.unit !== Units.none && ingredient.quantity > 0) {
                    ingredient.quantity *= multiple;
                }
            });
        });
    }

    private addIngredient(step: IStep): void {
        step.ingredients.forEach((ingredient) => {
            if (ingredient.unit === Units.none || ingredient.quantity <= 0) {
                return;
            }

            const existingIngredient = this.ingredients[ingredient.name];

            if (!existingIngredient) {
                this.ingredients[ingredient.name] = ingredient;
                return;
            }

            if (existingIngredient.unit.name === ingredient.unit.name) {
                existingIngredient.quantity += ingredient.quantity;
                return;
            }

            this.ingredients[`${ingredient.name} - ${ingredient.unit.name}`] =
                ingredient;
        });

        step.children?.forEach((child) => {
            this.addIngredient(child);
        });
    }

    private getStepEquipment(step: IStep): string[] {
        const equipment: string[] = [];

        step.equipment.forEach((equipmentItem) => {
            equipment.push(equipmentItem);
        });

        step.children?.forEach((childStep) => {
            childStep.equipment.forEach((equipmentItem) => {
                equipment.push(equipmentItem);
            });
        });

        return equipment;
    }

    private buildStepsWithCleanupSteps(): IStep[] {
        const steps = [...this.steps];
        const foundEquipment: IFoundEquipment = {};

        for (let i = steps.length - 1; i >= 0; --i) {
            const step = steps[i];
            const equipment = this.getStepEquipment(step);

            equipment.forEach((equipmentItem) => {
                if (foundEquipment[equipmentItem]) {
                    return;
                }

                const stepPosition = i + 2 > steps.length - 1 ? i + 1 : i + 2;

                steps.splice(
                    stepPosition,
                    0,
                    text.set(['Clean and put away', equipmentItem])
                );

                foundEquipment[equipmentItem] = true;
            });
        }

        return steps;
    }

    public printRecipe(recipeGroup: string, recipeName: string): string {
        this.ingredients = {};

        this.steps.forEach((step) => {
            this.addIngredient(step);
        });

        s.parseLazyLoad(this.steps);

        const recipeForOutput = {
            ...this,
            steps: this.buildStepsWithCleanupSteps(),
        };

        Object.keys(this.ingredients).forEach((ingredientKey) => {
            const ingredient = this.ingredients[ingredientKey];
            Units.setPricingTable(ingredient);
        });

        const recipeId = `${recipeGroup}-${recipeName}`;
        const recipeJson = escapeInlineScriptJson(recipeForOutput);

        return `
<script
    type="application/json"
    class="recipe-data"
    data-recipe-id="${escapeHtmlAttribute(recipeId)}"
>
${recipeJson}
</script>`;
    }
}