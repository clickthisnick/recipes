import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../constants/equipment';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [Popcorn]},
        ]
    }
}

class Popcorn extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Put', i.oliveOil(1, u.tbsp), 'in', e.pot()],
            [Timer.set(4.5, 'm', 'Turn stove to heat 4')],
            ['Put in', i.popcorn(4, u.tbsp)],
            ['Cook until popped (write this down)'],
            ['Season with', i.dash(1, u.unit), i.salt(1, u.unit)],
        ];
    }
}
