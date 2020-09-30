import { IItemObj, IEstimates, IEstimatesMissing  } from './ingredients/item';
import * as fs from 'fs';
import { Readme } from './readme';
import { Serializer as s } from './serializer';
import { ITimer } from './timer';
import { HTML } from './html';
import { Async } from './async';
import { Units as u } from '../constants/units';

export interface IVariation {
    [details: string]: any[]; // Unititalized recipe
}

function finalStepReplace(text: string) {
    let tmpText: string = text.replace(/1\/2/g, '½');

    // Reduce confusion on too many letters for these plural units
    tmpText = tmpText.replace('tsps', 'tsp');
    tmpText = tmpText.replace('Tbsps', 'Tbsp');

    return tmpText;
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

    private generateBackToRecipes() {
        return `<a href="https://github.com/clickthisnick/recipes/blob/master/README.MD">Back To Recipes</a>`;
    }

    public addToGroup() {
        if (Readme.groups[this.recipeGroup] === undefined) {
            Readme.groups[this.recipeGroup] = [];
        }
        const recipeName = this.getRecipeName();

        Readme.groups[this.recipeGroup].push(`## [${recipeName}](https://www.clickthisnick.com/recipes/dist/${recipeName.toLowerCase().split(' ').join('')}.html)\n\n`);

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
               throw new Error(`Recipe Name must be provided for ${Object.values(this.variations[0])} if recipe has more than 1 variation`)
            }
        }

        return recipeName
    }

    public generateRecipes() {
        // Add options
        this.addToGroup();
        const variations:IVariation[] = this.variations

        let tmpOptionHtml = '';
        let tmpHtml = '';
        let defaultShowRecipe = false;

        if (variations.length === 1) {
            const recipes: any[] = Object.values(variations[0])[0];

            if (recipes.length === 1) {
                defaultShowRecipe = true;
            }
        }

        // When we loop through variations we store any already used names
        // Then subtract then more future names...
        // So...
        // WholeGrain
        // WholeGrainMushroom -> Mushroom
        // WholeGrainSausageMushroom -> Sausage
        const recipeNamesUsed: any[] = []

        variations.forEach((variation) => {
            const recipeIds: string[] = [];

            // Add the key text
            // Like "veggies"
            tmpOptionHtml += `<br><b>${Object.keys(variation)}</b><br>`;

            const recipes: any[] = Object.values(variation)[0];

            recipes.forEach((recipe) => {
                const initRecipe: Recipe = new recipe();
                let recipeName = recipe.name;

                initRecipe.autoShow = defaultShowRecipe;
                initRecipe.generateRecipe();

                // recipe.name is the class name
                recipeNamesUsed.forEach((used) => {
                    recipeName = recipeName.replace(used, '')
                });

                recipeNamesUsed.push(recipeName);
                recipeIds.push(recipeName);
                tmpHtml += initRecipe.recipeHtml;
            });

            tmpOptionHtml += HTML.generateOptions(recipeIds, defaultShowRecipe);
        });

        this.recipeHtml += '<div id="options">';
        this.recipeHtml += tmpOptionHtml;
        this.recipeHtml += '</div><br>';
        this.recipeHtml += tmpHtml;
    }

    constructor() {
        this.recipeHtml += HTML.mobileViewport;
        this.recipeHtml += HTML.chartSet;
        this.recipeHtml += HTML.css;
        this.recipeHtml += HTML.javascript;
        this.recipeHtml += this.generateBackToRecipes();
    }

    public writeRecipe() {
        const recipeName = this.getRecipeName();

        // Just setting to lowercase incase git isn't case sensitive (Like on osx/windows)
        fs.writeFileSync(`${process.cwd()}/dist/${recipeName.toLowerCase()}.html`, this.recipeHtml);
    }
}

export class Recipe {
    private steps: any[] = [];
    public ingredients: IItemObj[];
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

    public estimatesMissing: IEstimatesMissing = {
        calories: [],
        sodium: [],
        sugar: [],
        fiber: [],
        protein: [],
        total_cost: [],
    };

    private metricsToShow: string[] = Object.keys(this.estimatesMissing);
    private metrics: string[] = Object.keys(this.estimatesMissing);

    public recipeHtml: string = '';

    // This gets overloaded
    public generateRecipe() {
        console.log('I should never show up');

        return;
    }

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

    private generateHeader(text: string) {
        return `${HTML.headerStart}${text}${HTML.headerEnd}`;
    }

    private generateStep(text: string) {
        const tmpText =  finalStepReplace(text);

        return `<div class="panel" onclick="this.classList.toggle('completed')">${tmpText}</div>`;
    }

    private generateTimerStep(timer: any) {
        // tslint:disable-next-line max-line-length
        return `<div class="panel" id="panel${timer.id}" onclick="this.classList.toggle('timer'); timer(${timer.milliseconds}); loadTimer(${timer.milliseconds}, '${timer.id}')"><span id="${timer.id}"></span>${timer.text}</div>`;
    }

    private cloneObj(obj: {} | undefined | null) {
      return JSON.parse(JSON.stringify(obj));
    }

    public convertIngToNutrition(unit, nutrition) {
        const symbol_map = {
            "smallerThanOuter": "multiply",
            "biggerThanOuter": "divide",
        }

        const conversionMap = {
            [u.cup.name]: {
                [u.tsp.name]: {
                    count: 48,
                    symbol: symbol_map['smallerThanOuter']
                },
                [u.tbsp.name]: {
                    count: 16,
                    symbol: symbol_map['smallerThanOuter']
                },
                [u.ounce.name]: {
                    count: 8.446808,
                    symbol: symbol_map['smallerThanOuter']
                }
            },
            [u.ounce.name]: {
                [u.cup.name]: {
                    count: 8.446808,
                    symbol: symbol_map['smallerThanOuter']
                }   
            },
            [u.tbsp.name]: {
                [u.cup.name]: {
                    count: 16,
                    symbol: symbol_map['biggerThanOuter']
                },
                [u.tsp.name]: {
                    count: 3,
                    smybol: symbol_map['smallerThanOuter']
                }
            },
            [u.tsp.name]: {
                [u.cup.name]: {
                    count: 48,
                    symbol: symbol_map['biggerThanOuter']
                },
                [u.tbsp.name]: {
                    count: 3,
                    symbol: symbol_map['biggerThanOuter']
                }
            }
        }
        let convertedNutrition = {}

        if (nutrition === null) {
            return null
        }

        if (nutrition.hasOwnProperty(unit)) {
            return nutrition[unit]
        }

        // Check if we can convert this unit at all
        if (!conversionMap.hasOwnProperty(unit)) {
            return null
        }

        Object.keys(nutrition).forEach((key) => {

            // If there is a map between our unit and anything in the nutrition info, use it.
            if (conversionMap[unit].hasOwnProperty(key)) {

                Object.keys(nutrition[key]).forEach((metric) => {
                    if (metric !== 'total_cost') {
                        const symbol = conversionMap[unit][key]['symbol']

                        // TODO check that this is right
                        if (symbol === 'divide') {
                            convertedNutrition[metric] = nutrition[key][metric] / conversionMap[unit][key]['count']
                        } else {
                            convertedNutrition[metric] = nutrition[key][metric] * conversionMap[unit][key]['count']
                        }
                    }
                })
            }
        })

        if (convertedNutrition === {}) {
            return null
        }

        return convertedNutrition
    }

    public addIngredients(ingredients: IItemObj[]) {
        // Opening div with id
        // If autoShow, then display the recipe
        if (this.autoShow) {
            this.recipeHtml += `<div id="${this.constructor.name}">`;
        } else {
            this.recipeHtml += `<div id="${this.constructor.name}" style="display: none">`;
        }

        this.ingredients = ingredients;

        ingredients.forEach((ing) => {
            // Add calories to our calculation
            if (ing.quantity > 0 && ing.unit !== null && this.convertIngToNutrition(ing.unit.name, ing.nutrition)) {
                const unitName = ing.unit.name;
                const nutritionData = this.convertIngToNutrition(unitName, ing.nutrition)
                console.log(ing)
                console.log(nutritionData)

                this.metrics.forEach((metric) => {
                    if (nutritionData.hasOwnProperty(metric) && nutritionData[metric] !== null) {
                        // Only multiply by the quantity you are using
                        // TODO in future everything should just have a serving_size
                        if (nutritionData.hasOwnProperty('serving_size')) {
                            // total_cost is not be the serving size but the whole item
                            if (metric === 'total_cost') {
                                // cup: {
                                //     servings: 6,
                                //     serving_size: 0.5,
                                //     calories: 70,
                                //     sodium: 410,
                                //     sugar: 4,
                                //     protein: 3,
                                //     fiber: 2,
                                //     total_cost: 2.29
                                //   }

                                // servings: 0.7103274988611081,
                                // serving_size: 0.05919395823842568,
                                // calories: 8.287154153379596,
                                // sodium: 48.53904575550906,
                                // sugar: 0.47355166590740544,
                                // protein: 0.35516374943055407,
                                // fiber: 0.23677583295370272,
                                // total_cost: 0.27110832873198965
                                if (nutritionData.hasOwnProperty('servings') && this.estimates.hasOwnProperty('total_cost')) {
                                    const cost = (nutritionData[metric] / nutritionData['servings']  * (ing.quantity * nutritionData['serving_size']));
                                    if (this.estimates['total_cost']) {
                                        this.estimates['total_cost'] += cost
                                    } else {
                                        this.estimates['total_cost'] = cost
                                    }
                                }
                            } else {
                                this.estimates[metric] += (nutritionData[metric] * (ing.quantity / nutritionData['serving_size']));
                            }
                        } else {
                            if (metric === 'total_cost') {
                                this.estimates[metric] += nutritionData[metric];
                            } else {
                                this.estimates[metric] += (nutritionData[metric] * ing.quantity);
                            }
                        }
                        
                    } else {
                        this.estimatesMissing[metric].push(ing.name);
                    }
                });
            } else {
                this.metrics.forEach((metric) => {
                    this.estimatesMissing[metric].push(ing.name);
                });
            }
        });

        this.prep();
    }

    public get(itemObj: IItemObj): any {
        const ingredient = this.ingredients.find((x) => x.name === itemObj.name);

        if (ingredient === undefined) {
            throw new Error(`Ingredient not found: ${itemObj.name}`);
        }

        const ing: IItemObj = this.cloneObj(ingredient);

        // .00001 is a number that no one would ever use in a recipe
        // Its what we default item values to
        // If you just want to use an items text, you can use "0" of it in a recipe
        // If no quantity is specified in the recipe, assume it means use all of it
        if (itemObj.quantity === .00001) {
            itemObj.quantity = ingredient.quantity;
        }

        if (itemObj.quantity > ing.quantity) {
            throw new Error(`Not enough ${ing.name}, \nCurrent: ${ing.quantity}\nNeeded: ${itemObj.quantity}`);
        } else {
            // Subtracting the ingredients used from the ingredient amount
            ingredient.quantity -= itemObj.quantity;

            // Make the clone have the same quantity as what we used up to fullfil this step
            ing.quantity = itemObj.quantity;
        }

        return ing;
    }

    public prep() {
        if (this.ingredients.length === 0) {
            throw new Error('This recipe has no ingredients');
        }

        // Add all the unit measurers
        this.recipeHtml += this.generateHeader('Ingredients');

        this.ingredients.forEach((ingredient) => {
            // Skip ingredient takeout for now
            const ingName = s.turnIngObjIntoStr(ingredient);
            const needsWashed = ingredient.wash === true ? ' and wash' : '';
            const iUnit: any = ingredient.unit

            this.recipeHtml += this.generateStep(`${ingName} ${ingredient['quantity']} ${iUnit['name']} ${needsWashed}`);
            if (ingredient.isMeatProduct === true) {
                this.vegan = false;
            }
        });

        

        this.metricsToShow.forEach((metric) => {
            let metricText = `${Math.round(this.estimates[metric])} ${metric}`;

            if (this.estimatesMissing[metric].length >= 1) {
                metricText += ` (${this.estimatesMissing[metric].join('/')} Data Missing)`;
            }
            this.recipeHtml += this.generateHeader(metricText);
        });

        if (this.vegan === true) {
            this.recipeHtml += this.generateHeader('Vegan Recipe');
        } else {
            this.recipeHtml += this.generateHeader('Recipe');
        }
    }

    public generateStepText(steps) {
        let stepText = '';

        steps.forEach((item) => {
            if (typeof item === 'string') {
                stepText += item;
            } else if (item.type === 'timer') {
                stepText += item.text;
            } else if (typeof item === 'object') {
                // this.get make the recipe aware we are using the item
                // also does some validation like item is in our ingredients and we have enough
                stepText += s.turnIngObjIntoStr(this.get(item), true);
            }
            stepText += ' ';
        });

        return stepText;
    }

    public generateRow(step) {
        let stepDirections;

        // Add any timer to time here
        // We do this before async timers because they happen in the background
        if (step[0].type === 'timer') {
            // Incrementing the rough estimate of how long the recipe will take.
            this.timeEstimateMilliseconds += step[0].milliseconds;
        }

        // Add async text to next step
        if (step[0] === Async.step) {

            // Remove async
            step.shift();

            // Add to text
            if (typeof(step[0]) === 'string') {
                step[0] = Async.step + step[0];
            } else {
                step[0].text = Async.step + step[0].text;
            }
        }

        if (step[0].type === 'timer') {
            return this.generateTimerStep(step[0]);
        } else {
            const stepText = this.generateStepText(step);

            stepText.trim();
            stepDirections = this.generateStep(stepText);

            return stepDirections;
        }
    }

    // TODO Should be a new section after recipe that says clean excess ingredients
    // Like .5 red onion we should put away the other half
   public printRecipe(): void {
        let stepsHtml = '';

        this.steps.forEach((step) => {
            stepsHtml += this.generateRow(step);
        });

        // This is calculated when the steps are parsed
        const estimatedTime = Math.round(this.timeEstimateMilliseconds / 60000);

        this.recipeHtml += this.generateHeader(`Estimated Time: ${estimatedTime} Minutes`);
        this.recipeHtml += stepsHtml;

        // Close beginning div
        this.recipeHtml += '</div>';
   }

   public addSteps(steps: (string | ITimer | IItemObj)[][]) {
      this.steps = steps;
      this.printRecipe();

      // Lastly make sure there are no ingredients left
      this.ingredients.forEach((ingredient) => {
          if (ingredient.quantity > 0) {
              throw new Error(`${ingredient.name} still had ${ingredient.quantity} left`)
          }
      });
    }
}
