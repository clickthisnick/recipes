import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'carnivore';
        this.recipeGroup = c.component;
        this.variations = [
            ChickenThighs
        ]
    }
}

class ChickenThighs extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add([
                i.butter(1, u.tsp),
            ]),
            e.pan().cook(1, 'm', 5),
            Timer.end(),
            e.pan().add([
                i.chickenThigh(1.5, u.pound),
            ]),
            e.pan().cook(4, 'm', 5),
            Timer.end(),
            text.set(['Flip', i.chickenThigh()]),
            e.pan().cook(4, 'm', 5),
            Timer.end(),
            e.pan().cook(2, 'm', 7),
            Timer.end(),
            text.set(['Flip', i.chickenThigh()]),
            e.pan().cook(2, 'm', 7),
            Timer.end(),
        ];
    }
}
