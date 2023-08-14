import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.souvide;
        this.addIngredients([
            i.cauliflower(),
            i.butter(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Set souvide to 180 degrees'],
            ['Put a package of 1-2 inch', this.get(i.cauliflower()), 'in souvide bag with 3 Tbsp', this.get(i.butter())],
            ['Put in tandori masala seasoning'],
            [Timer.set(50, 'm', 'Souvide for 50 minutes')],
        ]);
        this.printRecipe();
    }
}
