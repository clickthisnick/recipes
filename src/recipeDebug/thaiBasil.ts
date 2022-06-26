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
            ThaiBasil,
            ThaiBasil2Servings
        ]
    }
}

class ThaiBasil2Servings extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.whiteRice(1.5, u.cup),
                i.water(2.5, u.cup),
            ]),
            e.instantPot().pressureCook(0, 5, 'm'),
            e.bowl().add([
                i.coconutSugar(2, u.tsp),
                i.soySauce(4, u.tsp),
                i.oysterSauce(4, u.tsp),
                i.water(4, u.tbsp),
            ]),
            e.pan().add([
                i.peanutOil(2, u.tbsp),
            ]),
            e.pan().preheat(7, 1),
            i.garlicClove(4, u.clove).dice(),
            i.serranoChilli(4, u.unit).dice(),
            i.greenOnion(2, u.unit).dice(),
            e.plate().add([
                i.garlicClove(),
                i.serranoChilli(),
                i.greenOnion(),
            ]),
            i.chickenBreast(1, u.pound).dice(),
            Timer.end(),
            e.pan().add([
                i.garlicClove(),
                i.serranoChilli(),
            ]),
            Timer.set(10, 's'),
            Timer.end(),
            e.pan().add([
                i.greenOnion(),
                i.sausage(),
            ]),
            Timer.set(4, 'm'),
            Timer.end(),
            e.pan().add([
                i.ingredient('sauce'),
            ]),
            Timer.set(2, 'm'),
            Timer.end(),
            e.pan().add([
                i.basil(2, u.cup),
            ])
        ];
    }
}


class ThaiBasil extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.whiteRice(.75, u.cup),
                i.water(1.25, u.cup),
            ]),
            e.instantPot().pressureCook(0, 5, 'm'),
            e.bowl().add([
                i.coconutSugar(1, u.tsp),
                i.soySauce(2, u.tsp),
                i.oysterSauce(2, u.tsp),
                i.water(2, u.tbsp),
            ]),
            e.pan().add([
                i.peanutOil(1.5, u.tbsp),
            ]),
            e.pan().preheat(7, 1),
            i.garlicClove(2, u.clove).dice(),
            i.serranoChilli(2, u.unit).dice(),
            i.greenOnion(1, u.unit).dice(),
            e.plate().add([
                i.garlicClove(),
                i.serranoChilli(),
                i.greenOnion(),
            ]),
            i.chickenBreast(.5, u.pound).dice(),
            Timer.end(),
            e.pan().add([
                i.garlicClove(),
                i.serranoChilli(),
            ]),
            Timer.set(10, 's'),
            Timer.end(),
            e.pan().add([
                i.greenOnion(),
                i.sausage(),
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