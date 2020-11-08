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
            {'recipe': [PorkChops]},
        ]
    }
}

class PorkChops extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.ninja().preheat(500),
            Timer.end(),
            e.ninja().add(i.porkRoast(4, u.unit)),
            e.ninja().cook(8, 'm', 500),
            Timer.end(),
            text.set(['Flip', i.porkChops()]),
            e.ninja().cook(5, 'm', 500),
            Timer.end(),
            text.set(['Open ninja and turn off ninja']),
            Timer.set(5, 'm', 'Let pork chops rest'),
            Timer.end(),
        ];
    }
}
