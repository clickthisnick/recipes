import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            LondonBroil
        ]
    }
}

class LondonBroil extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Marinate meat']),
            e.ninja().preheat(500),
            Timer.end(),
            e.ninja().add([
                i.londonBroil(1, u.pound),
            ])
        ];
    }
}
