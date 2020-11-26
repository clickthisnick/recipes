import { Recipe, RecipeContainer } from '../class/recipe';
import { Categories as c } from '../constants/categories';
import { Text as text} from '../class/text';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';

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
            text.set(['Put upside down one', i.fudgeStripedCookie(1, u.unit)]),
            text.set(['Pipe', i.orangeFrosting(1, u.unit), 'on cookie']),
            text.set(['Put upside down one ', i.miniaturePeanutButterCups(1, u.unit)]),
            text.set(['Pipe one', i.orangeFrosting(), 'dot on peanut butter cup']),
        ];
    }
}
