import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            Risotto
        ]
     }
}

class Risotto extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.oven().preheat(350),
            i.babyBellaMushroom(1, u.pound).cutIntoStrips(),
            i.whiteOnion().dice(),
            i.garlicClove(3, u.unit).dice(),
            Timer.end(),
            e.bakingSheet().add([
                i.babyBellaMushroom(),
                i.garlicClove(),
                i.thyme(6, u.sprigs),
                i.redPepperFlakes(.5, u.tsp),
                i.oliveOil(.25, u.cup),
                i.salt(.5, u.tsp),
            ]),
            text.set(['Set timer for 20 minutes to toss oven contents']),
            e.oven().cook(40, 'm', 350),
            e.pot().add([
                i.oliveOil(2, u.tbsp),
                i.whiteOnion(),
            ]),
            e.pot().cook(5, 'm', 4),
            Timer.end(),
            e.pot().add([
                i.arborioRice(1, u.cup),
                i.blackPepper(.5, u.tsp),
                i.salt(.5, u.tsp),
            ]),
            Timer.set(2, 'm', 'cook rice'),
            Timer.end(),
            e.pot().add([
                i.whiteWine(.5, u.cup),
            ]),
            Timer.set(2, 'm', 'cook rice with lid on'),
            Timer.end(),
            e.pot().add([
                i.chickenStock(2.5, u.cup),
            ]),
            Timer.set(18, 'm', 'cook rice'),
            Timer.end(),
            text.set(['Turn stove heat off']),
            e.pot().add([
                i.chickenStock(.5, u.cup),
            ]),
            e.pot().add([
                i.parmesanCheese(1, u.cup),
                i.butter(2, u.tbsp),
                i.lemonZest(.12, u.lemon),
            ]),
            Timer.end(),
            Timer.end(),
        ];
    }
}
