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
            text.set(['This makes 5 french toast slices']),
            e.pan().preheat(4, 4),
            e.bowl().add([
                i.egg(3, u.unit),
                i.oatMilk(3, u.tbsp),
                i.cinnamon(1, u.tsp),
            ]),
            e.bowl().stir(),
            Timer.end(),
            e.pan().add([
                i.coconutOil(1, u.tsp),
            ]),
            text.set(['Dip the', i.bread(), 'in the mixture']),
            e.pan().add(i.item('Dipped bread')),
            e.pan().cook(1.75, 'm'),
            Timer.end(),
            text.set(['Flip french toast']),
            e.pan().cook(1.75, 'm'),
            Timer.end(),
        ]
    }
}
