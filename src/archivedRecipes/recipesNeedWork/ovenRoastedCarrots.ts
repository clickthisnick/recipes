import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.vegetables;
        this.addIngredients([
            i.carrots(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Peel and cut', this.get(i.carrots())],
            [Timer.ovenCook(25, 'm', 'carrots', 400)],
            ['Broil carrots for 3 minutes on bottom shelf'],
        ]);
        this.printRecipe();
    }
}
