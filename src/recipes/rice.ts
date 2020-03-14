import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'rice';
        this.recipeGroup = c.component;
        this.addIngredients([
            i.brownRice(1, u.cup),
            i.instaPot(1),
            i.water(1.5, u.cup)
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', i.brownRice(), 'in', i.instaPot()],
            ['Put in', i.water()],
            [Timer.pressureCook(15, 'm')],
            [Timer.set(5, 'm', 'let sit without opening steam valve')],
            ['Open steam valve'],
        ]);
        this.printRecipe();
    }
}
