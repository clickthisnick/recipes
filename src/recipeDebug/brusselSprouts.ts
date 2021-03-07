import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [BrusselSprouts];
    }
}

class BrusselSprouts extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.ninja().preheatAirFry(15),
            i.brusselSprouts(1, u.pound).cutInHalf(),
            i.brusselSprouts().season([
                i.dash(3, u.dash),
                i.oliveOil(1, u.tbsp),
            ]),
            Timer.end(),
            e.ninja().add(i.brusselSprouts()),
            Timer.set(15, 'm', 'Wait for air fryer to be done'),
            Timer.end(),
        ];
    }
}
