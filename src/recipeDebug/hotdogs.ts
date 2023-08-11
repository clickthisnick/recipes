import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.meal;
        this.variations = [
            AidellsCajunSausage
        ]
     }
}

class AidellsCajunSausage extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().preheat(5),
            Timer.end(),
            e.pan().add([
                i.water(1, u.cup),
                i.sausageAidellsCajun(4, u.unit),
            ]),
            Timer.set(8, 'm', 'cook'),
            text.set(['Cut', i.whiteOnion(1, u.unit), 'into slices']),
            Timer.end(),
            text.set(['Drain pan']),
            text.set(['Turn heat to 7']),
            Timer.set(2, 'm', 'brown hotdog'),
            Timer.end(),
            Timer.set(2, 'm', 'flip + brown hotdog'),
            Timer.end(),
            text.set(['Take out', i.sausageAidellsCajun(), 'and put on plate']),
            text.set(['Put', i.hotdogBunPotato(4, u.unit), 'in pan']),
            Timer.set(2, 'm', 'toast hotdog bun'),
            Timer.end(),
            Timer.set(1, 'm', 'flip + toast hotdog bun'),
            Timer.end(),
            text.set(['Assemble hotdog with', i.ketchup(1, u.unit), i.dijonMustard(1, u.unit)]),
        ];
    }
}
