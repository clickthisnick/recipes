import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.meal;
        this.variations = [
            {'recipe': [NinjaChickenDrumsticks, NinjaChickenThighs]},
        ]
     }
}

class NinjaChickenThighs extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Season dry rub', i.chickenThigh(1, u.pound),],
            [Timer.ninjaCook(10, 'm', 'Cook Chicken, flip at 5 min mark', 400)]
        ]
    }
}

class NinjaChickenDrumsticks extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['(optional) Season dry rub', i.chickenDrumstickPackage(1, u.pound)],
            [Timer.ninjaCook(18, 'm', 'Cook Chicken, flip at 9 min mark', 450)],
            ['(optional) Add drumsticks + sauce in a container and shake']
        ]
    }
}
