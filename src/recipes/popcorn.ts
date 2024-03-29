import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            PopCorn
        ]
    }
}

class PopCorn extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().preheat(7, 3),
            Timer.end(),
            e.pan().preheat(6, 0),
            Timer.end(),
            e.pan().add([
                i.popcorn(.5, u.cup)
            ]),
            e.pan().cook(3, 'm'),
            Timer.end(),
        ];
    }
}
