import { IEstimates, IEstimatesMissing } from './ingredients/ingredient';
import { Ingredients, Units } from '../constants/units';
import { IStep } from './step';
import { exception } from 'console';
import { Text as text } from './text';

export interface IVariation {
    [details: string]: any[]; // Unititalized recipe
}

export class RecipeContainer {
    public recipeHtml: string = '';
    public recipeName: string = '';
    public recipeGroup: string;
    public variations: any[];
    // public recipeOptions: any;
    // Arbitrary key.
    // Values are added in order of keys to the recipe body html ID
    // so just lentil spagehetti is id="lentil"
    // lentil sausage is is id="lentilsasuage"
    // lentil sausage mushroom is is id="lentilsasuagemushroom"
    // This works because all recipes are precompiled
    // this.recipeOptions = [
    //     {'pasta': ['lentil']},
    //     {'meat': ['sausage']},
    //     {'veggie': ['mushroom']},
    // ];

    private generateRecipeVariation(recipeClass, includeInVariation=false) {
        const initRecipe: Recipe = new recipeClass();
        const recipeName = recipeClass.name; 

        // Ensure the recipe is valid
        initRecipe.validate(recipeName)

        // Adds the recipe to the javascript variable
        this.recipeHtml += initRecipe.printRecipe(recipeName)

        if (includeInVariation) {
            this.recipeHtml += `<button class="${this.recipeName}-group" style="display: none" `            
        } else {
            this.recipeHtml += `<button `
        }

        this.recipeHtml += `onclick="selectRecipe('${recipeName}')">${recipeName}</button>`
    }

    public generateRecipeHtml() {
        let hideUnderRecipeGroup = false;

        const recipeGroupName = this.recipeName;

        if (this.variations.length > 1) {
            // TODO something should check this is unique;
            this.recipeHtml += `<div id='${recipeGroupName}-main'><button onclick="showElementsByClassName('${recipeGroupName}-group'); hideElement('${recipeGroupName}-main');">${recipeGroupName} ⇩</button></div>`

            hideUnderRecipeGroup = true
        }

        this.variations.forEach(variation => {
            this.generateRecipeVariation(variation, hideUnderRecipeGroup)
        })

        // this.recipeHtml += '<br>'
        this.recipeHtml += '<div id="root">'
        this.recipeHtml += '</div id="root">'
    }

    constructor() {
        // this.recipeHtml += generateBackToRecipes();
    }
}

export class Recipe {
    public steps: IStep[] = [];
    public ingredients: Ingredients = {};
    // public equipment: IAllEquipment = {};
    public vegan: boolean = true;
    public timeEstimateMilliseconds: number = 0;
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

    public recipeHtml: string = '';

    // Whether to auto show the recipe
    // Useful if the recipe only has one option
    public autoShow: boolean = false;

    private print(step: IStep) {
        this.recipeHtml += ''

        if (step.children) {
            step.children.forEach(istepchild => {
                this.print(istepchild)
            })
        }
    }

    public validate(recipeName) {
        let timers: any[] = []
        this.steps.forEach(stepz => {
            if (stepz.showTimer) {
                timers.push(stepz.text);
            } else if (stepz.disappearWhen === 'timerIsUp') {
                timers.shift()
            }
        })

        if (timers.length > 0) {
            console.log(recipeName)
            console.log(timers)
            throw new exception('Timers left open');
        }
    }


    private addIngredient(istep: IStep) {
        // This adds all the ingredients from each step into ingredients in the main recipe
        // And also does any trasformations like converting the ingredient to many different units

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

    public printRecipe(recipeName): string {
        let html = ''

        // Add the ingredients from each step of the recipe into the main recipe as combined ingredients
        this.steps.forEach(stepz => {
            this.addIngredient(stepz)
        })

        // Loop through steps backwards and add a step to put away equipment if its no longer used
        const foundEquipment = {};

        // Since we are looping backwards we can add items to the array
        for (let i = this.steps.length - 1; i >= 0; --i) {
            const step = this.steps[i];

            if (!step.equipment) {
                continue
            }

            step.equipment.forEach(equipmentItem => {
                if (equipmentItem === '') {
                    return
                }

                if (foundEquipment.hasOwnProperty(equipmentItem)) {
                    // If we have already found the equipment once, it must hae been from a later step
                    // We can skip it since we assume its already been dealt with
                    return
                }

                this.steps.splice(i+1, 0, text.set(['Clean and put away', equipmentItem]));

                foundEquipment[equipmentItem] = true
            })
        }

        // Loop through the ingredients of the recipe and generate a pricing table for each purchasable link
        Object.keys(this.ingredients).forEach(ingredientKey => {
            const ingredient = this.ingredients[ingredientKey]

            Units.setPricingTable(ingredient)
        })

        

        html += `<script>setRecipe('${recipeName}', ${JSON.stringify(this)})</script>`

        return html    
    }
}
