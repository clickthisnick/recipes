import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.chicken;
        this.addIngredients([
            i.chickenThigh(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Preheat oven to 375 degrees'],
            ['Put 5 packs of', this.get(i.chickenThigh()), 'on oven tray'],
            ['Cook for 14 min'],
            ['Flip + Season'],
            ['Cook for 14 min'],
            ['Makes 9 containers of chicken'],
        ]);
        this.printRecipe();
    }
}
