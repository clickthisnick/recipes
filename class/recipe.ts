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

         .panel {
         border-right-style: solid;
         border-bottom-style: solid;
         border-left-style: solid;
          padding: 25px;
          border-width: 1px;
         }
         </style>`
      this.recipeHtml += this.generateHeader('Clean counter space:');
      this.recipeHtml += this.generateStep('Empty dishwasher');
      this.recipeHtml += this.generateStep('Load dishwasher');
      this.recipeHtml += this.generateStep('Put away anything not related to recipe away');
      this.recipeHtml += this.generateHeader('Get out the following ingredients:');
   }

    private generateHeader(text: string) {
        return `${this.headerStart}${text}${this.headerEnd}`;
    }

    private generateStep(text: string) {
        return `<div class="panel" onclick="this.classList.toggle('completed')">${text}</div>`;
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

         const stepDirections = this.generateStep(stepText);
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
