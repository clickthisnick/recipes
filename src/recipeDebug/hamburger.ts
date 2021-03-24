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
            Hamburgers
        ]
    }
}

class Hamburgers extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Form 2, 1 inch hamburgers with', i.groundBeef8020(1, u.pound)]),
            e.pan().add(i.item('hamburgers')),
            e.pan().cook(6, 'm', 4),
            Timer.end(),
            i.item('hamburger').season([
                i.smokedPaprika(2, u.dash),
                i.chilliPowder(2, u.dash),
                i.garlicPowder(2, u.dash)
            ]),
            text.set(['Flip hamburgers']),
            e.pan().add([
                i.Groups.mushroom(5, u.slice),
                i.Groups.onion(5, u.slice),
            ]),
            e.pan().cook(7, 'm', 4),
            Timer.end(),
            i.item('hamburger').season([
                i.smokedPaprika(2, u.dash),
                i.chilliPowder(2, u.dash),
                i.garlicPowder(2, u.dash)
            ]),
            text.set(['Flip hamburgers']),
            e.pan().cook(7, 'm', 4),
            Timer.end(),
            text.set(['Flip hamburgers']),
            Timer.set(5, 'm', 'Turn off heat and let food rest in pan'),
            Timer.end(),
            text.set(['Put burgers between', i.hamburgerBun(2, u.unit)]),
            i.item('hamburger').season([
                i.germanMustard(2, u.tbsp),
                i.ketchup(2, u.tbsp),
            ])
        ];
    }
}
