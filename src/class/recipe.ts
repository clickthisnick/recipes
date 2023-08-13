import { IEstimates, IEstimatesMissing } from './ingredients/ingredient';
import { Ingredients, Units } from '../constants/units';
import { IStep } from './step';
import { Text as text } from './text';
import { Serializer as s } from './serializer';

export interface IVariation {
    [details: string]: any[]; // Unititalized recipe
}

export interface IFoundEquipment {
    [details: string]: boolean; // Unititalized recipe
}

export class RecipeContainer {
    public recipeHtml = '';
    public recipeType: string;
    public variations: any[];

    private generateRecipeVariation(recipeGroup: string, recipeClass: any, includeInVariation=false) {
        const initRecipe: Recipe = new recipeClass();
        const recipeName = recipeClass.name;

        // Ensure the recipe is valid
        initRecipe.validate(recipeGroup, recipeName)

        // Adds the recipe to the javascript variable
        this.recipeHtml += initRecipe.printRecipe(recipeGroup, recipeName)

        const hideFromCookingView = initRecipe.hideFromCookingView ? 'hideFromCookingView' : ''

        if (includeInVariation) {
            this.recipeHtml += `<button class="${recipeGroup}-group ${hideFromCookingView}" style="display: none" `
        } else {
            this.recipeHtml += `<button class="${hideFromCookingView}" `
        }

        this.recipeHtml += `onclick="selectRecipe('${recipeGroup}-${recipeName}')">${recipeName}</button>`
    }

    public generateRecipeHtml(filename: string) {
        let hideUnderRecipeGroup = false;

        // The file name which is unique but without the extension
        // TODO make it space delimited on word (capitzliation)
        const recipeGroup = filename.replace(".ts", "")

        if (this.variations.length > 1) {
            this.recipeHtml += `<div id='${recipeGroup}-main'><button onclick="showElementsByClassName('${recipeGroup}-group'); hideElement('${recipeGroup}-main');">${recipeGroup} ⇩</button></div>`

            hideUnderRecipeGroup = true
        }

        this.variations.forEach(variation => {
            this.generateRecipeVariation(recipeGroup, variation, hideUnderRecipeGroup)
        })

        // this.recipeHtml += '<br>'
        this.recipeHtml += '<div id="root">'
        this.recipeHtml += '</div id="root">'
    }
}

export class Recipe {
    public steps: IStep[] = [];
    public hideFromCookingView: Boolean = false; 
    public ingredients: Ingredients = {};
    // public equipment: IAllEquipment = {};
    public vegan = true;
    public timeEstimateMilliseconds = 0;
    // TODO expand to other metrics
    public estimates: IEstimates = {
        calories: 0,
        sodium: 0,
        sugar: 0,
        fiber: 0,
        protein: 0,
        total_cost: 0
    };
    // private generatedStepIdx = 0;

    public estimatesMissing: IEstimatesMissing = {
        calories: [],
        sodium: [],
        sugar: [],
        fiber: [],
        protein: [],
        total_cost: [],
    };

    //private metricsToShow: string[] = Object.keys(this.estimatesMissing);
    //private metrics: string[] = Object.keys(this.estimatesMissing);

    public recipeHtml = '';

    // Whether to auto show the recipe
    // Useful if the recipe only has one option
    public autoShow = false;

    public validate(recipeGroup: string, recipeName: string) {
        const timers: string[] = []
        this.steps.forEach(stepz => {
            if (stepz.showTimer) {
                timers.push(stepz.text);
            } else if (stepz.disappearWhen === 'timerIsUp') {
                timers.shift()
            }
        })

        if (timers.length > 0) {
            // This is during validate - console.log is good here
            console.log(`${recipeGroup} = ${recipeName}`)
            console.log(timers)
            throw new Error('Timers left open');
        }
    }


    public multiplyIngredients(multiple: number) {
        // This adds all the ingredients from each step into ingredients in the main recipe
        // And also does any transformations like converting the ingredient to many different units

        this.steps.forEach(step => {
            if (step.hasOwnProperty("children")) {
                step.children.forEach(child => {
                   child.ingredients.forEach(ingredient => {
                        if (ingredient.unit !== Units.none && ingredient.quantity > 0) {
                            ingredient.quantity = ingredient.quantity * multiple
                        }
                    })
                })
            }
            // Unit could be null, dont add ingredient whose unit is null - item('hamburger') is an example of that
            step.ingredients.forEach(ingredient => {
                if (ingredient.unit !== Units.none && ingredient.quantity > 0) {
                    ingredient.quantity = ingredient.quantity * multiple
                }
            })
        })
    }

    private addIngredient(istep: IStep) {
        // This adds all the ingredients from each step into ingredients in the main recipe
        // And also does any transformations like converting the ingredient to many different units

        istep.ingredients.forEach(ingredient => {
            // Unit could be null, dont add ingredient whose unit is null - item('hamburger') is an example of that
            if (ingredient.unit !== Units.none && ingredient.quantity > 0) {

                // If the recipe already knows about the ingredient
                if (this.ingredients.hasOwnProperty(ingredient.name)) {

                    // If the existing ingredient and the new ingredient have the same unit
                    // Then just add the ingredient quantity
                    if (this.ingredients[ingredient.name].unit.name == ingredient.unit.name) {
                        this.ingredients[ingredient.name].quantity += ingredient.quantity
                    } else {
                        const units = Units.combineIngredientUnits(this.ingredients[ingredient.name], ingredient)

                        if (units) {
                            // update the ingredents unit and quantity
                            this.ingredients[ingredient.name].unit = units.unit;
                            this.ingredients[ingredient.name].quantity = units.quantity;
                        } else { // If no units could be combined, just add the ingredient to the list under a different name
                            this.ingredients[`${ingredient.name} - ${ingredient.unit}`] = ingredient
                        }
                    }
                } else {
                    this.ingredients[ingredient.name] = ingredient
                }
            }
        })

        if (istep.children.length > 0) {
            istep.children.forEach(child => {
                this.addIngredient(child);
            })
        }
    }

    private getStepEquipment(step: IStep) {
        const equipment: string[] = []

        // Calculates all the equipment for the step (and its children steps)
        if (step.equipment.length > 0) {
            step.equipment.forEach(equipmentItem => {
                equipment.push(equipmentItem)
            })
        }

        if (step.children) {
            step.children.forEach(childStep => {
                childStep.equipment.forEach(equipmentItem => {
                    equipment.push(equipmentItem)
                })
            })
        }

        return equipment
    }

    public printRecipe(recipeGroup: string, recipeName: string): string {
        let html = ''

        // Add the ingredients from each step of the recipe into the main recipe as combined ingredients
        this.steps.forEach(stepz => {
            this.addIngredient(stepz)
        })

        // Lazy load the text
        s.parseLazyLoad(this.steps)

        // Loop through steps backwards and add a step to put away equipment if its no longer used
        const foundEquipment: IFoundEquipment = {};

        // Since we are looping backwards we can add items to the array
        for (let i = this.steps.length - 1; i >= 0; --i) {
            const step = this.steps[i];
            const equipment = this.getStepEquipment(step)

            equipment.forEach(equipmentItem => {
                if (foundEquipment.hasOwnProperty(equipmentItem)) {
                    // If we have already found the equipment once, it must hae been from a later step
                    // We can skip it since we assume its already been dealt with
                    return
                }

                // The +2 adds it a step beyond when it was last used
                const stepPosition = (i + 2 > this.steps.length - 1) ? i+1 : i+2
                this.steps.splice(stepPosition, 0, text.set(['Clean and put away', equipmentItem]));

                foundEquipment[equipmentItem] = true
            })
        }

        // Loop through the ingredients of the recipe and generate a pricing table for each purchasable link
        Object.keys(this.ingredients).forEach(ingredientKey => {
            const ingredient = this.ingredients[ingredientKey]

            Units.setPricingTable(ingredient)
        })

        html += `<script>setRecipe('${recipeGroup}-${recipeName}', ${JSON.stringify(this)})</script>`

        return html
    }
}
