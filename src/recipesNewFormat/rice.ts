import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../constants/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.recipeName = 'Rice'
        this.variations = [
            {'recipe': [Rice1Cup, RiceHalfCup]}
        ]
    }
}

class Rice1Cup extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.brownRice(1, u.cup),
                i.water(1.5, u.cup)
            ]),
            e.instantPot().pressureCook(9, 15, 'm'),
            e.instantPot().pressureRelease(5, 'm')
        ];
    }
}

class RiceHalfCup extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.brownRice(.5, u.cup),
                i.water(1, u.cup)
            ]),
            e.instantPot().pressureCook(9, 7, 'm'),
            e.instantPot().pressureRelease(3, 'm')
        ];
    }
}
