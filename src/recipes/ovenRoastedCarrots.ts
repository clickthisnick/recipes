import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'RoastedCarrots';
        this.recipeGroup = c.vegetables;
        this.addIngredients([
            i.carrots(),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Peel and cut', this.get(i.carrots())],
            [Timer.set(25, 'm', 'Cook carrots in oven @ 400')],
            ['Broil carrots for 3 minutes on bottom shelf'],
        ]);
        await this.printRecipe();
    }
}
