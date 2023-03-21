import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            BakedZiti
        ]
    }
}

class BakedZiti extends Recipe {
    constructor() {
        super();
        this.steps = [
            // '(1.5 quarts)
            e.pot().add([
                i.water(6, u.cup),
            ]),
            e.pot().boilWithLid(10, 'm', 7),
                text.set(['mince', i.garlicClove(4, u.unit)]),
                text.set(['mince', i.whiteOnion(1, u.unit)]),
            Timer.end(),
            e.pot().add([
                i.ziti(16, u.ounce),
                i.oliveOil(1, u.tbsp),
            ]),
            e.pot().cookWithLid(13, 'm', 7),
                e.pan().preheat(7, 2),
                Timer.end(),
                text.set(['Preheat oven to 350']),
                e.pan().add([
                    i.italianSausage(16, u.ounce)
                ]),
                e.pan().cook(5, 'm'),
                Timer.end(),
                e.pan().add([
                    i.garlicClove(),
                    i.Groups.onion(),
                    i.italianSeasoning(1, u.tsp),
                ]),
                e.pan().cook(5, 'm'),
                Timer.end(),
                e.pan().add([
                    i.spaghettiSauce(16, u.ounce)
                ]),
                e.pan().cook(1, 'm'),
                Timer.end(),
            Timer.end(),
            text.set(['Drain noodles']),
            text.set(['Spread a thin layer of the sauce in the bottom of a 9x13-inch casserole pan']),
            text.set(['Dot the surface with half the', i.ricottaCheese(8, u.ounce)]),
            text.set(['Put a spoonful of sauce into the pasta, stir, and then add the pasta into the casserole.']),
            text.set(['Pour the rest of the sauce over the pasta, dot the remaining', i.ricottaCheese(7, u.ounce), 'over the pasta, and sprinkle', i.mozzarellaCheese(8, u.ounce), i.parmesanCheese(3, u.ounce), 'on top.']),
            text.set(['At this point you could refrigerate or freeze, or bake']),
            Timer.set(25, 'm', 'Bake in oven until light brown and cheese is melted'),
                    e.pot().done(),
                    e.pan().done(),
            Timer.end()
        ];
    }
}
