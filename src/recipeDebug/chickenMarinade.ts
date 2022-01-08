import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            DijonChicken
        ]
     }
}

class DijonChicken extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Mince', i.garlicClove(6, u.unit)]),
            e.bowl().add([
                i.dijonMustard(.75, u.cup),
                i.orangeJuice(.25, u.cup),
                i.oliveOil(2, u.tbsp),
                i.garlicClove(),
                i.salt(2, u.tsp),
                i.chickenThigh(3, u.pound),
            ]),
            Timer.set(12, 'h', 'Marinate chicken'),
            Timer.end(),
            Timer.set(10, 'm', 'Cook Chicken in ninja at 500'),
            Timer.end(),
        ]
    }
}
