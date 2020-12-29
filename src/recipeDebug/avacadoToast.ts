import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment'
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            AvacadoToast2People
        ]
    }
}

class AvacadoToast2People extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bowl().add([
                i.avacado(2, u.unit),
                i.limeJuice(2, u.tbsp),
            ]),
            e.bowl().stir(),
            text.set(['Toast', i.bread(2, u.unit)]),
            text.set(['Spread avacado mixture on toast']),
        ];
    }
}
