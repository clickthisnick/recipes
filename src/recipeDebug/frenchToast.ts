import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            FrenchToast
        ]
    }
}

class FrenchToast extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().preheat(5, 5),
            e.bowl().add([
                i.egg(2, u.unit),
                i.cinnamon(2, u.tsp),
            ]),
            e.bowl().stir(),
            Timer.end(),
            e.pan().add([
                i.butter(1, u.tsp),
            ]),
            text.set(['Dip the', i.bread(), 'in the mixture']),
            e.pan().add(i.item('Dipped bread')),
            e.pan().cook(3, 'm'),
            Timer.end(),
            text.set(['Flip french toast']),
            e.pan().cook(2.5, 'm'),
            Timer.end(),
        ]
    }
}
