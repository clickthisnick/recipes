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
            {'recipe': [Hamburgers]},
        ]
    }
}

class Hamburgers extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Form 2, 1 inch hamburgers with', i.groundBeef(1, u.pound)]),
            e.pan().add(i.item('hamburgers')),
            e.pan().cook(6, 'm', 5),
            i.item('hamburger').season([
                i.smokedPaprika(2, u.dash),
                i.chilliPowder(2, u.dash),
                i.garlicPowder(2, u.dash)
            ]),
            text.set(['Flip hamburgers']),
            e.pan().add([
                i.babyBellaMushroom(5, u.slice),
                i.redOnion(5, u.slice),
            ]),
            e.pan().cook(7, 'm', 5),
            i.item('hamburger').season([
                i.smokedPaprika(2, u.dash),
                i.chilliPowder(2, u.dash),
                i.garlicPowder(2, u.dash)
            ]),
            text.set(['Flip hamburgers']),
            e.pan().cook(7, 'm', 5),
            Timer.set(5, 'm', 'Let food rest')
        ];
    }
}
