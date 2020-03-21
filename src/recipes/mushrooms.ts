import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';
import { Async } from '../class/async';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'mushrooms';
        this.recipeGroup = c.component;
        this.addIngredients([
            i.crimniMushroom(8, u.ounce),
            i.oliveOil(1, u.tbsp),
            i.dash(1, u.unit),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            [Timer.preheatPan(5, true)],
                [Async.step, 'Wash', i.crimniMushroom(), 'with strainer'],
            ['Put', i.oliveOil(), 'in pan'],
            ['Put', i.crimniMushroom(0), 'in pan'],
            [Timer.panSear(4, 'm', i.crimniMushroom(0), true)],
                [Async.step, 'Wash and put away strainer'],
                [Async.step, 'Wash and put away measuring utensil'],
            ['Season with', i.dash()],
        ]);
        this.printRecipe();
    }
}
