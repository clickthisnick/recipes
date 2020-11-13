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
            {'recipe': [Cereal]},
        ]
    }
}

class Cereal extends Recipe {
    constructor() {
        super();
        this.steps = [
            Timer.set(2, 's'),
            Timer.end(),
            e.bowl().add([
                i.flaxSeedCereal(2, u.cup),
                i.almondMilk(1.5, u.cup),
            ]),
            e.bowl().stir(),
        ]
    }
}
