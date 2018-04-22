import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'AirFryChickenBreast';
        this.recipeGroup = c.chicken;
        this.addIngredients([
            i.chickenBreastPackage(),
            i.oldBay()
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Sprinkle Chicken top and bottom with', this.get(i.oldBay())],
            ['Cook in airfryer @ 400 deg for 13 minutes', this.get(i.chickenBreastPackage())],
            [Timer.set(5, 'm', 'Let chicken sit')],
        ]);
        await this.printRecipe();
    }
}
