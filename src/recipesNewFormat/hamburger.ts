import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../constants/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [Hamburgers]},
        ]
    }
}

class Hamburgers extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Form 2, 1 inch hamburgers with', i.groundBeef(1, u.pound)],
            e.pan().add([
                i.avacadoOil(2, u.tbsp),
                'hamburgers',
            ]),
            e.pan().cook(6, 'm', 5),
            i.item('hamburger').season([
                i.smokedPaprika(2, u.dash),
                i.chilliPowder(2, u.dash),
                i.garlicPowder(2, u.dash)
            ]),
            ['Flip hamburgers'],
            e.pan().cook(6, 'm', 5),
            i.item('hamburger').season([
                i.smokedPaprika(2, u.dash),
                i.chilliPowder(2, u.dash),
                i.garlicPowder(2, u.dash)
            ]),
            ['Flip hamburgers'],
            e.pan().cook(6, 'm', 5),
        ];
    }
}
