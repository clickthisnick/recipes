import { IEstimates, IEstimatesMissing } from './ingredients/item';
import { IAllIngredientUnits } from '../constants/units';
import { IStep } from './step';
import { exception } from 'console';

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

    public generateRecipes() {
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
    public ingredients: IAllIngredientUnits = {};
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

    public printRecipe(recipeName): string {
        let html = ''

        // Turn the human readable inputted steps into a formatted step which is easy to manipulate
        // this.steps.forEach((item) => {
        //     this.print(item)
        // });
        this.steps.forEach(stepz => {
            html += `<script>setSteps('${recipeName}', ${JSON.stringify(stepz)})</script>`
        })
        return html    
    }
}
