import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            WhiteRice1Cup, BrownRice1Cup, BrownRiceHalfCup
        ]
    }
}

class WhiteRice1Cup extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.whiteRice(1, u.cup),
                i.water(1.5, u.cup)
            ]),
            e.instantPot().pressureCook(9, 12, 'm'),
            Timer.set(5, 'm', 'let pressure release'),
            Timer.end()
        ];
    }
}

class BrownRice1Cup extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.brownRice(1, u.cup),
                i.water(1.5, u.cup)
            ]),
            e.instantPot().pressureCook(9, 15, 'm'),
            Timer.set(5, 'm', 'let pressure release'),
            Timer.end()
        ];
    }
}

class BrownRiceHalfCup extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.brownRice(.5, u.cup),
                i.water(1, u.cup)
            ]),
            e.instantPot().pressureCook(9, 7, 'm'),
            Timer.set(5, 'm', 'let pressure release'),
            Timer.end(),
        ];
    }
}
