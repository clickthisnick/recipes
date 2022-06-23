import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = "Thai Basil"
        this.recipeGroup = c.component;
        this.variations = [
            ThaiBasil
        ]
    }
}

class ThaiBasil extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.whiteRice(1, u.cup),
                i.water(1.5, u.cup),
            ]),
            e.instantPot().pressureCook(0, 5, 'm'),
            e.bowl().add([
                i.soySauce(2, u.tsp),
                i.coconutSugar(1, u.tsp),
                i.water(2, u.tbsp),
                i.oysterSauce(2, u.tsp),
            ]),
            e.pan().add([
                i.peanutOil(1.5, u.tbsp),
            ]),
            e.pan().preheat(7, 1),
                i.garlicClove(2, u.clove).dice(),
                i.serranoChilli(2, u.unit).dice(),
                i.greenOnion(1, u.unit).dice(),
                i.chickenThigh(.5, u.pound).dice(),
            Timer.end(),
            e.pan().add([
                i.garlicClove(),
                i.serranoChilli(),
            ]),
            Timer.set(10, 's'),
            Timer.end(),
            e.pan().add([
                i.greenOnion(),
                i.chickenThigh(),
            ]),
            Timer.set(2, 'm'),
            Timer.end(),
            e.pan().add([
                i.ingredient('sauce'),
            ]),
            Timer.set(1, 'm'),
            Timer.end(),
            e.pan().add([
                i.basil(1, u.cup),
            ])
        ];
    }
}
