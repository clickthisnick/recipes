import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            Corn
         ]
     }
}

class Corn extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pot().add([
                i.water(20, u.thousandSecondCounts)
            ]),
            Timer.set(15, 'm', 'Boil water'),
            Timer.end(),
            text.set(['Put corn in pot']),
            Timer.set(7, 'm', 'Boil Corn'),
            Timer.end(),
        ];
    }
}
