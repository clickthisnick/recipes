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
            ['Put', i.brownRice(1, u.cup), 'in', e.instantPot()],
            ['Put in', i.water(1.5, u.cup)],
            [Timer.pressureCook(9, 15, 'm', true)],
            [Timer.naturalPressRelease(5, 'm')],
            ['Open steam valve'],
        ];
    }
}

class RiceHalfCup extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Put', i.brownRice(.5, u.cup), 'in', e.instantPot()],
            ['Put in', i.water(1, u.cup)],
            [Timer.pressureCook(0, 7, 'm', true)],
            [Timer.naturalPressRelease(3, 'm')],
            ['Open steam valve'],
        ];
    }
}
