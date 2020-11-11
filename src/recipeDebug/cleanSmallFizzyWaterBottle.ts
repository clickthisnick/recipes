import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [CleanSmallFizzyWaterBottle]},
        ]
    }
}

class CleanSmallFizzyWaterBottle extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Put 3 seconds water in water bottle']),
            text.set(['Put in', i.whiteVinegar(.5, u.tsp)]),
            Timer.set(30, 's', 'shake'),
            Timer.end(),
            text.set(['Dump out water']),
            text.set(['Put 5 seconds water in water bottle']),
            text.set(['Put in', i.bakingPowder(.25, u.tsp)]),
            Timer.set(30, 's', 'shake'),
            Timer.end(),
            text.set(['Dump out water']),
            text.set(['Put 3 seconds water in water bottle']),
            Timer.set(20, 's', 'shake'),
            Timer.end(),
            text.set(['Dump out water']),
            text.set(['Fill 1/4 with water']),
            text.set(['Dump out water']),
            text.set(['Let air dry']),
        ]
    }
}
