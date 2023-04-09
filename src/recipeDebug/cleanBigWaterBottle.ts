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
        this.recipeName = 'Clean Water Bottle'
        this.variations = [
            CleanWaterBottle, CleanSmallFizzyWaterBottle
        ]
    }
}

class CleanWaterBottle extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Make sure straw is in water bottle']),
            text.set(['Power wash top to remove dust']),
            text.set(['Put 10 seconds water in water bottle']),
            text.set(['Put in', i.whiteVinegar(1, u.tsp)]),
            Timer.set(45, 's', 'shake'),
            Timer.end(),
            text.set(['Dump out water']),
            text.set(['Use straw pipe cleaner and clean the straw']),
            text.set(['Put 10 seconds water in water bottle']),
            text.set(['Put in', i.bakingPowder(.5, u.tsp)]),
            Timer.set(45, 's', 'shake'),
            Timer.end(),
            text.set(['Dump out water']),
            text.set(['Put 10 seconds water in water bottle']),
            Timer.set(20, 's', 'shake'),
            Timer.end(),
            text.set(['Dump out water']),
            text.set(['Fill 1/4 with water']),
            text.set(['Dump out water']),
            text.set(['Let air dry']),
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
