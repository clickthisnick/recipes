import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [PopCorn]},
        ]
    }
}

class PopCorn extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().preheat(7, 3),
            e.pan().preheat(6, 0),
            e.pan().add(i.popcorn(.5, u.cup)),
            e.pan().cook(3, 'm')
        ];
    }
}
