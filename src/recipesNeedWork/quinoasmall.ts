import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.instantPot;
        this.addIngredients([
            i.quinoa(),
            i.water(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 1/4 cup', this.get(i.quinoa()), 'in instant pot'],
            ['Put 1/2 cups', this.get(i.water()), 'in instant pot'],
            [Timer.pressureCook(0, 6, 'm')],
        ]);
        this.printRecipe();
    }
}
