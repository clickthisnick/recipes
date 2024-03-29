import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.component;
        this.variations = [
            {'recipe': [Mushroom]},
        ]
    }
}

class Mushroom extends Recipe {
    constructor() {
        super();
        this.steps = [
            [Timer.preheatPan(5, true)],
                [Async.step, 'Wash', i.i.Groups.mushroom(8, u.ounce), 'with strainer'],
            ['Put', i.oliveOil(1, u.tbsp), 'in pan'],
            ['Put', i.Groups.mushroom(), 'in pan'],
            [Timer.panSear(4, 'm', i.Groups.mushroom(), true)],
                [Async.step, 'Wash and put away strainer'],
                [Async.step, 'Wash and put away measuring utensil'],
            ['Season with', i.dash(1, u.unit)],
        ]
    }
}
