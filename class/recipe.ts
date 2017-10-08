import { IItemObj } from '../constants/items';

export class Recipe {
    private headerStart = '<h1>';
    private headerEnd = '</h1>';
    private mobileViewport = '<meta name="viewport" content="width=device-width, initial-scale=1">';
    private chartSet = '<meta charset="utf-8">';
    private steps: any[] = [];
    public ingredients: IItemObj[];
    public recipeHtml: string = '';

    constructor() {
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
         </style>`
      this.recipeHtml += `
         <script>
         function beep() {
          var snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
          snd.play();
         }

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
                  var audio = new Audio('https://raw.githubusercontent.com/clickthisnick/recipes/master/sounds/tone.mp3');

                  audio.play();
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
      `
      this.recipeHtml += this.generateHeader('Clean counter space:');
      this.recipeHtml += this.generateStep('Empty dishwasher');
      this.recipeHtml += this.generateStep('Load dishwasher');
      this.recipeHtml += this.generateStep('Put away anything not related to recipe away');
      this.recipeHtml += this.generateHeader('Get out the following ingredients:');
      this.recipeHtml += `
      <audio controls>
        <source src="https://raw.githubusercontent.com/clickthisnick/recipes/master/sounds/tone.mp3" type="audio/mpeg">
        Sorry. Your browser doesn't support the HTML5 audio element.
      </audio>
      `;
   }

    private generateHeader(text: string) {
        return `${this.headerStart}${text}${this.headerEnd}`;
    }

    private generateStep(text: string) {
        return `<div class="panel" onclick="this.classList.toggle('completed')">${text}</div>`;
    }

    private generateTimerStep(timer: any) {
        return `<div class="panel" id="panel${timer.id}" onclick="this.classList.toggle('timer'); timer(${timer.seconds}); loadTimer(${timer.seconds}, '${timer.id}')"><span id="${timer.id}"></span>${timer.text}</div>`;
    }

    private cloneObj(obj: {} | undefined | null) {
      return JSON.parse(JSON.stringify(obj));
   }

    public addIngredients(ingredients: IItemObj[]) {
      this.ingredients = ingredients;
    }

    public get(itemObj: IItemObj, quantity?: number) {
      const ingredient = this.ingredients.find((ingredient) => itemObj.name === ingredient.name);

      if (ingredient === undefined) {
          throw new Error(`Ingredient not found: ${itemObj.name}`)
       }

      let ing = this.cloneObj(ingredient);

      // If you specify 0 it will only print the ing name not assert quntity
      if (quantity === 0) {
         ing.quantity = 0;

         return ing;
      }
      // If quantity is null then assume all quantity is meant to be used
      itemObj.quantity = quantity || ingredient.quantity;

      if (ing.quantity === 0) {
         throw new Error(`No more left of ${ing.name}`)
      } else if (itemObj.quantity > ing.quantity) {
         throw new Error(`Not enough ${ing.name}, \nCurrent: ${ing.quantity}\nNeeded: ${itemObj.quantity}`)
      } else {
         // Subtracting the ingredients used from the ingredient amount
         ingredient.quantity -= itemObj.quantity;

         // Make the clone have the same quantity as what we used up to fullfil this step
         ing.quantity =  itemObj.quantity;
      }

      return ing;
    }

   public turnIngObjIntoStr(ingObj: IItemObj, includeUnit = false) {
      const ingQuantity = ingObj.quantity > 1 ? `${ingObj.quantity} ` : '';
      const ingName = ingObj.quantity > 1 ? `${ingObj.name}s` : ingObj.name;
      let unit: String = '';

      if (includeUnit && ingObj.unit !== null) {
         unit = `${ingObj.unit.name} `;
      }

      return `${ingQuantity}${unit}${ingName}`;
   }

    public prep() {
        if (this.ingredients.length === 0) {
            throw new Error('This recipe has no ingredients');
        }

        this.ingredients.forEach((ingredient) => {
            const ingName = this.turnIngObjIntoStr(ingredient);
            const needsWashed = ingredient.wash === true ? ' and wash' : '';

            this.recipeHtml += this.generateStep(`${ingName}${needsWashed}`);
        })

        this.recipeHtml += this.generateHeader('Recipe');
        console.log(this.recipeHtml);
    }

    // TODO Should be a new section after recipe that says clean excess ingredients
    // Like .5 red onion we should put away the other half

   public printRecipe() {
      this.createCleanupSteps();
      this.steps.forEach((step) => {
         let stepDirections;

         if (step.length === 1 && typeof(step[0]['type']) !== 'undefined') {
            stepDirections = this.generateTimerStep(step[0]);
         } else {
            let stepText = '';

            step.forEach((item) => {
               if (typeof item === 'string') {
                  stepText += item;
               } else if (typeof item === 'object') {
                  stepText += this.turnIngObjIntoStr(item, true);
               }
               stepText += ' ';
            })

            stepText.trim();
            stepDirections = this.generateStep(stepText);
         }
         console.log(stepDirections);
      })
   }

   // This is horibble and I should fix'
   // This should loop through items until it finds the item,
   // Then loop the other way until it finds a timer item
   // Then decrease the amount of time the timer item takes by the put away time
   private createCleanupSteps() {
      for (let i = 0; i < this.ingredients.length; i++ ) {
         let cleanedIngredient = false;
         if (cleanedIngredient) {
            break;
         }
         for (let s = this.steps.length - 1; s >= 0; s-- ) {
            if (cleanedIngredient) {
               break;
            }
            for (let si = this.steps[s].length - 1; si >= 0; si-- ) {
               if (typeof this.steps[s][si] === 'object' && this.steps[s][si].name === this.ingredients[i].name) {
                  if (this.steps[s][si].cleanSteps !== '') {
                     this.steps.splice(s+1, 0, [this.steps[s][si].cleanSteps])
                  }
                  cleanedIngredient = true;
                  break;
               }
            };
         }

         if (cleanedIngredient === false) {
            throw new Error(`Never used ${this.ingredients[i].name}`)
         }
      }
   }

   public addSteps(steps: (string | void)[][]) {
      this.steps = steps;
    }
}
