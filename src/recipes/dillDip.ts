import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [DillDip];
    }
}

class DillDip extends Recipe {
    constructor() {
        super();
        this.steps = [
            i.whiteOnion(2, u.tbsp).mince(),
            e.bowl().add([
                i.sourCream(1, u.cup),
                i.mayonaise(1, u.cup),
                i.dillWeed(2, u.tbsp),
                i.whiteOnion(),
                i.parsleyFlakes(2, u.tbsp),
                i.seaSalt(2, u.tsp),
            ]),
            e.bowl().mix(),
        ];
    }
}
