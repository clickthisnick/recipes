import { Recipe } from '../class/recipe';
import { Categories as c } from '../constants/categories';
import { Items as i } from '../constants/items';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.fish;
        this.addIngredients([
            i.salmon(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            // Whole foods marinated salmon filet are great
            [Timer.set(5, 'm', 'Preheat pan on heat 5')],
            ['Put', this.get(i.salmon()), 'skin down for 3 minutes'],
            [Timer.set(5, 'm', 'Flip salmon')],
        ]);
        this.printRecipe();
    }
}
