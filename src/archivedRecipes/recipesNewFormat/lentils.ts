import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.component;
        this.variations = [
            {'recipe': [LentilHalfCup]},
        ]
    }
}

class LentilHalfCup extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.lentils(.5, u.cup),
                i.water(1, u.cup),
                i.tandoriMasalla(3, u.dash),
                i.driedOnion(2, u.dash),
                i.salt(1, u.dash),
            ]),
            e.instantPot().pressureCook(0, 5, 'm'),
        ]
    }
}
