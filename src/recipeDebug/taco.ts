import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
// import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            TacoTenderLoin
        ]
    }
}

class TacoTenderLoin extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().preheat(5, 2),
            Timer.end(),
            e.pan().add([
                i.ingredient("Marinated Tenderloin")
            ]),
            e.pan().cookWithLid(5, 'm', 10),
            Timer.end(),
        ];
    }
}
