import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [ThaiCoconutSoup]},
        ]
    }
}

class ThaiCoconutSoup extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Dice', i.whiteOnion(1, u.unit)]),
        ];
    }
}
