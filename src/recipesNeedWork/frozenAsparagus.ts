import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.vegetables;
        this.addIngredients([
            i.asparagus(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Preheat ninja to medium (450)'],
            ['Spread avacodo oil on frozen', this.get(i.asparagus())],
            ['Season with salt and pepper'],
            ['Cook for 7 minutes'],
        ]);
        this.printRecipe();
    }
}
