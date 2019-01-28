import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'KaleChips';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.kale(),
            i.cookingSpray(),
            i.oldBay(.5, u.tsp),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Preheat oven to 300 degrees'],
            ['Wash', this.get(i.kale())],
            ['Break kale in 2 inch pieces and put on oven safe pan'],
            ['Mist kale with cooking spray'],
            ['Season with pepper'],
            ['Season with', this.get(i.oldBay())],
            [Timer.set(25, 'm', 'Bake in oven')],
            [Timer.set(2, 'm', 'Let cool')],
        ]);
        await this.printRecipe();
    }
}
