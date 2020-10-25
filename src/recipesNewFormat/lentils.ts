import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [LentilHalfCup]},
        ]
    }
}

class LentilHalfCup extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Put in', i.lentils(.5, u.cup), 'in instant pot',],
            ['Put in', i.water(1, u.cup)],
            ['Season with', i.tandoriMasalla(3, u.dash)],
            ['Season with', i.driedOnion(2, u.dash)],
            ['Season with', i.salt(1, u.dash)],
            [Timer.pressureCook(0, 5, 'm')],
        ]
    }
}
