import { IItemObj } from './ingredients/item';
import * as fs from 'fs';
import { Readme } from './readme';
import { Serializer as s } from './serializer';
import { ITimer } from './timer';
import { HTML } from './html';
import { Async } from './async';

// if (`${quantity}`.endsWith('.75')) {
//     quantityString = `${quantity-.75}¾`;
//   }
//   if (`${quantity}`.endsWith('.5')) {
//     quantityString = `${quantity-.5}½`;
//   }
//   if (`${quantity}`.endsWith('.33')) {
//     quantityString = `${quantity-.33}⅓`;
//   }
//   if (`${quantity}`.endsWith('.25')) {
//     quantityString = `${quantity-.25}¼`;
//   }
//   if (`${quantity}`.endsWith('.125')) {
//     quantityString = `${quantity-.125}⅛`;
//   }

export interface IVariation {
    [details: string]: any[]; // Unititalized recipe
}

function finalStepReplace(text: string) {
    const tmpText: string = text.replace(/1\/2/g, '½');

    return tmpText;
}

export class RecipeContainer {
    public recipeHtml: string = '';
    public recipeGroup: string;
    public recipeName: string;
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
        Readme.groups[this.recipeGroup].push(`## [${this.recipeName.split(' ').join('')}](https://www.clickthisnick.com/recipes/dist/${this.recipeName.toLowerCase().split(' ').join('')}.html)\n\n`);

    }
    public generateRecipes(variations: IVariation[]) {
        // Add options
        this.addToGroup();

        let tmpOptionHtml = '';
        let tmpHtml = '';
        let defaultShowRecipe = false;

        if (variations.length === 1) {
            const recipes: any[] = Object.values(variations[0])[0];

            if (recipes.length === 1) {
                defaultShowRecipe = true;
            }
        }

        variations.forEach((variation) => {
            const recipeIds: string[] = [];

            // Add the key text
            // Like "veggies"
            tmpOptionHtml += `<br><b>${Object.keys(variation)}</b><br>`;

            const recipes: any[] = Object.values(variation)[0];

            recipes.forEach((recipe) => {
                const initRecipe: Recipe = new recipe();

                initRecipe.autoShow = defaultShowRecipe;
                initRecipe.generateRecipe();
                recipeIds.push(initRecipe.recipeId);
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

        // Just setting to lowercase incase git isn't case sensitive (Like on osx/windows)
        fs.writeFileSync(`${process.cwd()}/dist/${this.recipeName.toLowerCase().split(' ').join('')}.html`, this.recipeHtml);
    }
}

export class Recipe {
    private steps: any[] = [];
    public recipeId: string;
    public compoundRecipeId: string;
    public ingredients: IItemObj[];
    public vegan: boolean = true;
    public timeEstimateMilliseconds: number = 0;
    // TODO expand to other metrics
    public caloriesEstimate: number = 0;
    public caloriesDataMissing: string[] = [];
    public sodiumEstimate: number = 0;
    public sodiumDataMissing: string[] = [];
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

    public addIngredients(ingredients: IItemObj[]) {
        // Opening div with id
        // If autoShow, then display the recipe
        if (this.autoShow) {
            if (this.compoundRecipeId) {
                this.recipeHtml += `<div id="${this.compoundRecipeId}">`;
            } else {
                this.recipeHtml += `<div id="${this.recipeId}">`;
            }
        } else {
            if (this.compoundRecipeId) {
                this.recipeHtml += `<div id="${this.compoundRecipeId}" style="display: none">`;
            } else {
                this.recipeHtml += `<div id="${this.recipeId}" style="display: none">`;
            }
        }

        this.ingredients = ingredients;

        // TODO add salt aswell
        ingredients.forEach((ing) => {
            // Add calories to our calculation
            // TODO make metrics into an array
            if (ing.unit !== null) {
                if (
                    ing.nutrition.hasOwnProperty('calorie')
                    && ing.nutrition.calorie.hasOwnProperty(ing.unit.name)
                ) {
                    this.caloriesEstimate += ing.nutrition.calorie[ing.unit.name] * ing.quantity;
                } else {
                    this.caloriesDataMissing.push(ing.name);
                }
                if (
                    ing.nutrition.hasOwnProperty('sodium')
                    && ing.nutrition.sodium.hasOwnProperty(ing.unit.name)
                ) {
                    this.sodiumEstimate += ing.nutrition.sodium[ing.unit.name] * ing.quantity;
                } else {
                    this.sodiumDataMissing.push(ing.name);
                }
            } else {
                this.caloriesDataMissing.push(ing.name);
                this.sodiumDataMissing.push(ing.name);
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
        this.ingredients.forEach((ingredient) => {
            // Skip ingredient takeout for now
            //const ingName = s.turnIngObjIntoStr(ingredient);
            //const needsWashed = ingredient.wash === true ? ' and wash' : '';

            //this.recipeHtml += this.generateStep(`${ingName}${needsWashed}`);
            if (ingredient.isMeatProduct === true) {
                this.vegan = false;
            }
        });

        // TOD make array
        let calorieText = `${Math.round(this.caloriesEstimate)} Calories`;

        if (this.sodiumDataMissing.length >= 1) {
            calorieText += ` (${this.caloriesDataMissing.join('/')} Data Missing)`;
        }
        this.recipeHtml += this.generateHeader(calorieText);

        let sodiumText = `${Math.round(this.sodiumEstimate)} mg Sodium`;

        if (this.sodiumDataMissing.length >= 1) {
            sodiumText += ` (${this.sodiumDataMissing.join('/')} Data Missing)`;
        }
        this.recipeHtml += this.generateHeader(sodiumText);

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
