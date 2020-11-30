// import { IItemObj, IEstimates, IEstimatesMissing } from './ingredients/item';
import { IEstimates, IEstimatesMissing } from './ingredients/item';
//import * as fs from 'fs';
import { Index } from '.';
//import { Serializer as s } from './serializer';
//import { ITimer } from './timer';
//import { HTML } from './html';
// import { Async } from './async';
// import { IAllIngredientUnits, Units } from '../constants/units';
import { IAllIngredientUnits } from '../constants/units';
import { IStep } from './step';
import { exception } from 'console';
// import { IEquipmentObj, IAllEquipment, Equipment } from '../constants/equipment';
// import { IAllEquipment } from './equipment';

// function generateBackToRecipes() {
//     return `<a href="https://www.clickthisnick.com/recipes">Back To Recipes</a>`;
// }

export interface IVariation {
    [details: string]: any[]; // Unititalized recipe
}

// function finalStepReplace(text: string) {
//     let tmpText: string = text.replace(/1\/2/g, '½');

//     // Reduce confusion on too many letters for these plural units
//     tmpText = tmpText.replace('tsps', 'tsp');
//     tmpText = tmpText.replace('Tbsps', 'Tbsp');

//     return tmpText;
// }

// class Step {
//     time: number; // In seconds
//     raw: string[]; // The raw input from our recipes
//     text: string[];
//     ingredients: any = {}
//     equipment: any = {}

//     constructor(step: string[]) {
//         this.raw = step;
//     }

//     public processRaw(raw: any) {
//         if (Array.isArray(raw)) {
//             raw.forEach(iraw => {
//                 this.processRaw(iraw)
//             })
//         }

//         console.log(typeof raw);
//         console.log(raw)

//         // This is an ingredient if has nutrition
//         if (raw.hasOwnProperty('nutrition')) {
//             // Dont need to add any ingredients that have no qunatities
//             if (raw.quantity === 0 && raw.unit === null ) {
//                 return;
//             }

//             // Init for this ingredient
//             if (this.ingredients.hasOwnProperty(raw.name) == false) {
//                 this.ingredients[raw.name] = [];
//             }

//             // Add to the array of all quantities and units provided for the ingredient
//             this.ingredients[raw.name].push({
//                 "quantity": raw.quantity,
//                 "unit": raw.unit.name
//             })
//         }
//     }

//     public process() {
//         // The goal is to get the the individual pieces of the step
//         this.processRaw(this.raw)

//         // if (typeof this.raw == 'object') {
//         //     console.log(this.raw.constructor.name)
//         // }
//     }

//     public processString() {

//     }

//     // public generateHtml() {
//     //     let stepDirections = '';

//     //     // Flatten any [[], []] arrays)
//     //     if (Array.isArray(this.raw[0])) {
//     //         this.raw.forEach((istep) => {
//     //             stepDirections += this.generateHtml(istep)
//     //         })
//     //         return stepDirections
//     //     }

//         // Add any timer to time here
//         // // We do this before async timers because they happen in the background
//         // if (step[0].type === 'timer') {
//         //     // Incrementing the rough estimate of how long the recipe will take.
//         //     this.timeEstimateMilliseconds += step[0].milliseconds;
//         // }

//         // // Add async text to next step
//         // if (step[0] === Async.step) {
//         //     let asyncText = '';
//         //     let count = ''

//         //     while (step[0] === Async.step) {    
//         //         step.shift()
//         //         count += '-'
//         //     }

//         //     asyncText = `${count}> ${asyncText}`

//         //     // Add back if you want to show an indicator for async, rather than just have people click this recipe
//         //     // step = this.addAsyncText(step, asyncText)

//         //     return this.generateRow(step)
//         // }

//         // if (step[0].type === 'timer') {
//         //     return this.generateTimerStep(step[0]);
//         // } else {
//         //     const stepText = this.generateStepText(step);

//         //     stepText.trim();
//         //     stepDirections = this.generateStep(stepText);

//         //     return stepDirections;
//         // }
//     //}
// }

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

    public addToGroup() {
        if (Index.groups[this.recipeGroup] === undefined) {
            Index.groups[this.recipeGroup] = [];
        }
        const recipeName = this.getRecipeName();

        Index.groups[this.recipeGroup].push(`<h2><a href="https://www.clickthisnick.com/recipes/dist/${recipeName.toLowerCase().split(' ').join('')}.html">${recipeName}</a>\n\n`);

    }

    private getRecipeName() {
        let recipeName: any = this.recipeName;
        let values: any = Object.values(this.variations[0])
        if (recipeName === "" && this.variations.length === 1 && values[0].length == 1) {
            recipeName = Object.values(this.variations[0])[0]
            // [Function SpiralHam]
            recipeName = recipeName[0].name
        } else {
            if (this.recipeName === "") {
                throw new Error(`recipeName must be provided for ${Object.values(this.variations[0])} if recipe has more than 1 variation`)
            }
        }

        return recipeName
    }

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

    //   this.recipeHtml += this.generateHeader('Clean counter space:');
    //   this.recipeHtml += this.generateStep('Empty dishwasher');
    //   this.recipeHtml += this.generateStep('Load dishwasher');
    //   this.recipeHtml += this.generateStep('Put away anything not related to recipe away');
    //   this.recipeHtml += this.generateHeader('Get out the following ingredients:');
    //   this.recipeHtml += `
    //   <audio id="beep">
    //     <source src="https://raw.githubusercontent.com/clickthisnick/recipes/master/sounds/tone.mp3" type="audio/mpeg">
    //     Sorry. Your browser doesn't support the HTML5 audio element.
    //   </audio>
    //   `;

    // private generateHeader(text: string) {
    //     return `${HTML.headerStart}${text}${HTML.headerEnd}`;
    // }

    // private generateStep(text: string, ingredient=false) {
    //     const tmpText = finalStepReplace(text);
    //     let style = ''
 
    //     // Show the first step
    //     if (this.generatedStepIdx != 0 && ingredient === false) {
    //         style += 'display: none'
    //     }
    //     this.generatedStepIdx += 1
 
    //     let html = `<div id="panel-${this.generatedStepIdx - 1}" class="panel" style="${style}" onclick="setStepVisibility(${this.generatedStepIdx}, ${this.generatedStepIdx-1})">${tmpText}</div>`;

    //     // If you want to toggle do this
    //     // return `<div class="panel" onclick="this.classList.toggle('completed')">${tmpText}</div>`;

    //     return html
    // }

    // private generateTimerStep(timer: any) {
    //     // tslint:disable-next-line max-line-length
    //     // If you want to toggle do this
    //     // let html = `<div class="panel" id="panel${timer.id}" onclick="this.classList.toggle('timer'); loadTimer(${timer.milliseconds}, '${timer.id}')"><span id="${timer.id}"></span>${timer.text}</div>`;

    //     let style = ''
 
    //     // Show the first step
    //     if (this.generatedStepIdx != 0) {
    //         style += 'display: none'
    //     }

    //     this.generatedStepIdx += 1

    //     let html = ''
    //     if (timer.async) {
    //         // Show the next element
    //         html = `<div id="panel-${this.generatedStepIdx - 1}" class="panel" style="${style}" id="panel${timer.id}" onclick="loadTimer(${timer.milliseconds}, '${timer.id}', ${this.generatedStepIdx-1}, ${this.generatedStepIdx}, true)"><span id="${timer.id}"></span>${timer.text}</div>`;
    //     } else {
    //         // Otherwise dont and wait for the timer
    //         html = `<div id="panel-${this.generatedStepIdx - 1}" class="panel" style="${style}" id="panel${timer.id}" onclick="loadTimer(${timer.milliseconds}, '${timer.id}', ${this.generatedStepIdx-1}, ${this.generatedStepIdx}, false)"><span id="${timer.id}"></span>${timer.text}</div>`;
    //     }

    //     return html
    // }

            // How do we get more fine grain
            // Example object == IItemObj
            // if (typeof item === 'string') {
            //     stepText += item;
            // } else if (item.type === 'timer') {
            //     stepText += item.text;
            // } else if (typeof item === 'object') {
            //     if (item.hasOwnProperty('quantity')) {
            //         stepText += s.turnIngObjIntoStr(item, true);
            //     } else {
            //         // Equipment
            //         stepText += item.name
            //     }
            // }
            // stepText += ' ';
    // public addEquipmentFromRow(step) {
    //     step.forEach(element => {

    //         // Flatten any [[], []] arrays)
    //         if (Array.isArray(element)) {
    //             return this.addEquipmentFromRow(element)
    //         }

    //         // IEquipment
    //         if (typeof(element) == 'object') {
    //             // Init for this equipment
    //             if (this.equipment.hasOwnProperty(element.constructor.name) == false) {
    //                 this.equipment[element.constructor.name] = 0;
    //             }

    //             this.equipment[element.constructor.name] += 1
    //         }

    //     });
    // }

    // private generateVisibilityToggles() {
    //     this.recipeHtml += `<a href="#" 
    //     onclick="document.getElementById('ingredients').style.display='inline'">Show Ingrendients</a>`
    //     this.recipeHtml += '\t'
    //     this.recipeHtml += `<a href="#" 
    //     onclick="showAllSteps()">Show All Steps</a>`
    // }

    // private generateIngredientListHtml() {
    //     let ingredientsOnlyOneUnit = Units.greatCommonDenominator(this.ingredients)
    //     this.recipeHtml += "<div id='ingredients' style='display: none' >"
    //     this.recipeHtml += this.generateHeader('Get out the following ingredients:');

    //     Object.keys(ingredientsOnlyOneUnit).forEach(ingredient => {
    //         let ingredientAmount = ingredientsOnlyOneUnit[ingredient][0]
    //         this.recipeHtml += this.generateStep(`${ingredient} ${ingredientAmount.quantity} ${ingredientAmount.unit}`, true)
    //     });
    //     this.recipeHtml += "</div>"
    // }

    // TODO Should be a new section after recipe that says clean excess ingredients
    // Like .5 red onion we should put away the other half


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

    //     let stepsHtml = '';
        
    //     // If autoShow, then display the recipe
    //     if (this.autoShow) {
    //         this.recipeHtml += `<div id="${this.constructor.name}">`;
    //     } else {
    //         this.recipeHtml += `<div id="${this.constructor.name}" style="display: none">`;
    //     }

    //     this.steps.forEach((step) => {
    //         this.addIngredientFromRow(step);
    //         this.addEquipmentFromRow(step);

    //         stepsHtml += this.generateRow(step);
    //     });

    //     this.generateIngredientListHtml()
    //     this.generateVisibilityToggles()

    //     // // This is calculated when the steps are parsed
    //     const estimatedTime = Math.round(this.timeEstimateMilliseconds / 60000);

    //     this.recipeHtml += this.generateHeader(`Estimated Time: ${estimatedTime} Minutes`);
    //     this.recipeHtml += this.generateHeader('Recipe:')

    //     // Equipment Cleanup TODO Make more robust
    //     let instantPot = Equipment.instantPot()
    //     if (this.equipment.hasOwnProperty(instantPot.constructor.name)) {
    //         stepsHtml += this.generateRow(['Take inner instant pot bowl out and put on stove.']);
    //         stepsHtml += this.generateRow(['Wipe inner instant pot rim']);
    //     }

    //     stepsHtml += this.generateRow(['FINISHED.']);
    //     this.recipeHtml += stepsHtml

    //     // Close the recipe container div
    //     this.recipeHtml += "</div>"

    //     return
    }
}
