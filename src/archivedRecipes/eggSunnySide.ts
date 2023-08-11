import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer} from '../class/timer';
import { Text as text} from '../class/text';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.meal;
        this.variations = [
            EggSunnySide
        ]
    }
}

class EggSunnySide extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().preheat(4, 2),
            Timer.end(),
            e.pan().add([
                i.egg(2, u.unit),
            ]),
            e.pan().cook(3.5, 'm'),
            Timer.end(),
            text.set(['Flip eggs']),
            e.pan().cook(2.5, 'm'),
            Timer.end(),
        ]
    }
}
