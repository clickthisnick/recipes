import { IItemObj } from './ingredients/item';
import * as fs from 'fs';
import { Readme } from './readme';
import { Serializer as s } from './serializer';
import { ITimer } from './timer';

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

function finalStepReplace(text: string) {
    const tmpText: string = text.replace(/1\/2/g, '½');

    return tmpText;
}

export class Recipe {
    private headerStart = '<h1>';
    private headerEnd = '</h1>';
    private mobileViewport = '<meta name="viewport" content="width=device-width, initial-scale=1">';
    private chartSet = '<meta charset="utf-8">';
    private steps: any[] = [];
    public ingredients: IItemObj[];
    public recipeHtml: string = '';
    public recipeName: string;
    public recipeGroup: string;
    public vegan: boolean;
    public timeEstimateMilliseconds: number;
    public caloriesEstimate: number = 0;
    public calorieDataMissing: boolean = false;

    constructor() {
      this.vegan = true;
      this.timeEstimateMilliseconds = 0;
      this.recipeHtml += this.mobileViewport;
      this.recipeHtml += this.chartSet;
      this.recipeHtml += `<style>
      .completed {
             background-color:green;
             color: white;
         }

         .timer {
                background-color:yellow;
                color: black;
            }

         .panel {
         border-right-style: solid;
         border-bottom-style: solid;
         border-left-style: solid;
          padding: 25px;
          border-width: 1px;
         }
         </style>`;

         // TODO: Could add a sound but browsers won't allow it like this
         // function beep() {
         // tslint:disable-next-line max-line-length
         //  var snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
         //  snd.play();
         // }

         this.recipeHtml += `
         <script>
         function setIntervalX(callback, delay, repetitions) {
             var x = 0;
             var intervalID = window.setInterval(function () {

                callback();

                if (++x === repetitions) {
                    window.clearInterval(intervalID);
                }
             }, delay);
         }

         function timer(initialWait) {
         	setIntervalX(function () {
         		setIntervalX(function () {
                  var x = document.getElementById("beep");

                  x.play();
               }, 200, 10);
           }, initialWait, 1);
         }

         function startTimer(duration, timerNum) {
            var timerId = '#' + timerNum;
            var display = document.querySelector(timerId);
            var timer = duration, minutes, seconds;
            var intervalID = window.setInterval(function () {
                 minutes = parseInt(timer / 60, 10)
                 seconds = parseInt(timer % 60, 10);

                 minutes = minutes < 10 ? "0" + minutes : minutes;
                 seconds = seconds < 10 ? "0" + seconds : seconds;

                 display.textContent = minutes + ":" + seconds + " ";

                 if (--timer < 0) {
                     window.clearInterval(intervalID);
                     var panelId = "#panel" + timerNum;
                     var panel = document.querySelector(panelId);
                     panel.classList.toggle('timer');
                     panel.classList.toggle('completed');
                 }
             }, 1000);
         }

         function loadTimer(seconds, timerNum) {
            seconds = seconds / 1000;

            startTimer(seconds, timerNum);
         }

         </script>
      `;
      this.recipeHtml += this.generateBackToRecipes();
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
   }

   private generateBackToRecipes() {
       return `<a href="https://github.com/clickthisnick/recipes/blob/master/README.MD">Back To Recipes</a>`;
   }

    private generateHeader(text: string) {
        return `${this.headerStart}${text}${this.headerEnd}`;
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
        this.ingredients = ingredients;
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
         // Add calories to our calculation
         if (ing.unit !== null && ing.calorie.hasOwnProperty(ing.unit.name)) {
            this.caloriesEstimate += ing.calorie[ing.unit.name] * itemObj.quantity;
         } else {
             this.calorieDataMissing = true;
         }

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

        if (this.calorieDataMissing) {
            this.recipeHtml += this.generateHeader(`? (Data Missing) Calories`);
        } else {
            this.recipeHtml += this.generateHeader(`${this.caloriesEstimate} Calories`);
        }

        if (this.vegan === true) {
            this.recipeHtml += this.generateHeader('Vegan Recipe');
        } else {
            this.recipeHtml += this.generateHeader('Recipe');
        }
    }

    public generateRow(step) {
        let stepDirections;

        if (step.length === 1 && typeof(step[0].type) !== 'undefined') {
            // Incrementing the rough estimate of how long the recipe will take.
            this.timeEstimateMilliseconds += step[0].milliseconds;
            stepDirections = this.generateTimerStep(step[0]);

            return stepDirections;

        } else {
            let stepText = '';

            step.forEach((item) => {
                if (typeof item === 'string') {
                    stepText += item;
                } else if (typeof item === 'object') {
                    // this.get make the recipe aware we are using the item
                    // also does some validation like item is in our ingredients and we have enough
                    stepText += s.turnIngObjIntoStr(this.get(item), true);
                }
                stepText += ' ';
            });

            stepText.trim();
            stepDirections = this.generateStep(stepText);

            return stepDirections;
        }
    }

    // TODO Should be a new section after recipe that says clean excess ingredients
    // Like .5 red onion we should put away the other half
   public printRecipe(): void {
        this.steps.forEach((step) => {
            this.recipeHtml += this.generateRow(step);
        });

        if (Readme.groups[this.recipeGroup] === undefined) {
            Readme.groups[this.recipeGroup] = [];
        }

        // Spaces messes up the markdown

        // TODO find something better to do with seconds
        const recipeEstimatedMinutes = Math.round(this.timeEstimateMilliseconds / 60000);

        Readme.groups[this.recipeGroup].push(`## [${this.recipeName.split(' ').join('')} - ${recipeEstimatedMinutes} Min.](https://www.clickthisnick.com/recipes/dist/${this.recipeName.toLowerCase().split(' ').join('')}.html)\n\n`);
   }

   public writeRecipe() {
    // Just setting to lowercase incase git isn't case sensitive (Like on osx/windows)
    fs.writeFileSync(`${process.cwd()}/dist/${this.recipeName.toLowerCase().split(' ').join('')}.html`, this.recipeHtml);
   }

   public addSteps(steps: (string | ITimer | IItemObj)[][]) {
      this.steps = steps;
    }
}
