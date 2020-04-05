import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'mushrooms';
        this.recipeGroup = c.component;
    }

    public init() {
        this.generateRecipes([
            {'recipe': [Mushroom]},
        ]);
    }
}

class Mushroom extends Recipe {
    constructor() {
        super();
        this.recipeId = 'mushroom';
    }
    public generateRecipe() {
        this.addIngredients([
            i.babyBella(8, u.ounce),
            i.oliveOil(1, u.tbsp),
            i.dash(1, u.unit),
        ]);
        this.addSteps([
            [Timer.preheatPan(5, true)],
                [Async.step, 'Wash', i.babyBella(), 'with strainer'],
            ['Put', i.oliveOil(), 'in pan'],
            ['Put', i.babyBella(0), 'in pan'],
            [Timer.panSear(4, 'm', i.babyBella(0), true)],
                [Async.step, 'Wash and put away strainer'],
                [Async.step, 'Wash and put away measuring utensil'],
            ['Season with', i.dash()],
        ]);
    }
}
