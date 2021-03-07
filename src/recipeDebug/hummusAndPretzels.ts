import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [HummusAndPretzels];
    }
}

class HummusAndPretzels extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Get', i.pretzelChips(2, u.bag)]),
            text.set(['Get', i.spicyHummus(1, u.container)]),
            text.set(['Enjoy']),
        ];
    }
}
