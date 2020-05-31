import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.chicken;
        this.addIngredients([
            i.chickenThighPackage(),
            i.oldBay(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Sprinkle Chicken top and bottom with', this.get(i.oldBay())],
            ['Cook in airfryer @ 370 deg for 12 minutes', this.get(i.chickenThigh())],
            [Timer.set(5, 'm', 'Flip chicken and cook for 7 minutes @ 370')],
        ]);
        this.printRecipe();
    }
}
