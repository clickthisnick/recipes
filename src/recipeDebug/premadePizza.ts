import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            PremadePizza
        ]
    }
}

class PremadePizza extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.oven().preheat(450),
            i.Groups.mushroom(3, u.unit).dice(),
            Timer.end(),
            text.set(['Cook', i.premadePizza(1, u.unit)]),
            Timer.set(12, 'm'),
            Timer.end(),
        ]
    }
}
