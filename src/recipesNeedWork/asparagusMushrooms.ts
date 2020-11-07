import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.vegetables;
        this.addIngredients([
            i.asparagus(),
            i.babyBellaMushroom(),
            i.garlicClove(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Cut ends of the', this.get(i.asparagus())],
            ['Mince the', this.get(i.garlicClove())],
            ['Wash the', this.get(i.babyBellaMushroom())],
            ['Put everything in pan and season with salt free seasoning'],
            ['Cook 5 minutes of heat 5 with lid'],
            ['Season with salt'],
            ['Cook 2 minutes on heath 8 without lid'],
        ]);
        this.printRecipe();
    }
}
