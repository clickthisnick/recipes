import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../constants/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [Asparagus]},
        ]
    }
}

class Asparagus extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.ninja().preheat(500),
            e.ninja().add(i.asparagus(.5, u.bunch)),
            ['Brush', i.asparagus(), 'with', i.oliveOil(1, u.tsp)],
            e.ninja().cook(4, 'm', i.asparagus(), 500),
            i.asparagus().season(i.dash(1, u.unit))
        ];
    }
}
