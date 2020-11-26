import { Recipe, RecipeContainer } from '../class/recipe';
import { Categories as c } from '../constants/categories';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [PilgrimHats]},
        ]
    }
}

class PilgrimHats extends Recipe {
    constructor() {
        super();
        this.steps = [
            // https://mommysavers.com/thanksgiving-treats-pilgrim-hat-cookies/
            text.set(['Put upside down one fudge stripped cookie']),
            text.set(['Pipe orange frosting on cookie']),
            text.set(['Put upside down one miniature peanut butter cup']),
            text.set(['Pipe one orange frosting dot on peanut butter cup']),
        ];
    }
}
