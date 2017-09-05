import { IItemObj } from '../constants/items';

export class Recipe {
    private headerStart = '<h1>';
    private headerEnd = '</h1>';
    private itemStart = '<label><input type="checkbox">'
    private itemEnd = '</label><br>';
    private mobileViewport = '<meta name="viewport" content="width=device-width, initial-scale=1">';
    private steps: any[] = [];
    public ingredients: IItemObj[];
    public recipeHtml: string = '';

    constructor() {
      this.recipeHtml += this.mobileViewport;
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
        return `${this.itemStart}${text}${this.itemEnd}`;
    }

    private cloneObj(obj: {} | undefined | null) {
      return JSON.parse(JSON.stringify(obj));
   }

    public addIngredients(ingredients: IItemObj[]) {
      this.ingredients = ingredients;
    }

    public getIng(ingredientObj: IItemObj) {
      const ingredient = this.ingredients.find((ingredient) => {
         return ingredientObj.name === ingredient.name;
      });

      let ingredientClone = this.cloneObj(ingredient);

      if (ingredient === undefined) {
         throw new Error(`Ingredient not found: ${ingredientObj.name}`)
      } else if (ingredientObj.quantity === null || ingredient.quantity === null) {
         ingredient.quantity = 0
      } else if (ingredient.quantity === 0) {
         throw new Error(`No more left of ${ingredient.name}`)
      } else if (ingredient.quantity !== null && ingredientObj.quantity > ingredient.quantity) {
         throw new Error(`Not enough ${ingredient.name}, \nCurrent: ${ingredient.quantity}\nNeeded: ${ingredientObj.quantity}`)
      } else {
         // Subtracting the ingredients used from the ingredient amount
         ingredient.quantity -= ingredientObj.quantity;

         // Make the clone have the same quantity as what we used up to fullfil this step
         ingredientClone.quantity =  ingredientObj.quantity;
      }

      return ingredientClone;
    }

    public prep() {
        if (this.ingredients.length === 0) {
            throw new Error('This recipe has no ingredients');
        }

        this.ingredients.forEach((ingredient) => {
            const prepIng = this.cloneObj(ingredient);

            // If item can't be broken down into units upon taking out
            // Set quantity to 1 so script prints correct output
            prepIng.quantity = !prepIng.isTakoutUnitable ? 1 : prepIng.quantity;

            const prepIngQuantity = prepIng.quantity !== null && prepIng.quantity !== 1 ? `${prepIng.quantity} ` : '';
            const needsWashed = prepIng.wash === true ? ' and wash' : '';
            const prepIngName = prepIng.quantity !== null && prepIng.quantity > 1 ? `${prepIng.name}s` : prepIng.name;

            this.recipeHtml += this.generateStep(`${prepIngQuantity}${prepIngName}${needsWashed}`);
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
               stepText += ' ';
            } else if (typeof item === 'object') {
               if (item.unit !== null && typeof item.unit === 'object') {
                  stepText += item.quantity;
                  stepText += ' ';
                  stepText += item.unit.name;
                  stepText += ' ';
               } else if (item.quantity !== null) {
                  stepText += item.quantity;
                  stepText += ' ';
               }
               stepText += item.name;
               stepText += ' ';
            }
         })

         stepText.trim();

         const stepDirections = this.generateStep(stepText);
         console.log(stepDirections);
      })
   }

   // This is horibble and I should fix
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
