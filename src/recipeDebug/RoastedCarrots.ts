import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'CarrotsRoasted'
        this.variations = [
            OneLbRoastedCarrots, TwoLbRoastedCarrots
        ]
     }
}

export class OneLbRoastedCarrots extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.oven().preheat(400),
            e.bowl().add([
                i.carrots(16, u.ounce),
                i.paprika(.5, u.tsp),
                i.groundGinger(.5, u.tsp),
                i.cumin(.25, u.tsp),
                i.salt(.5, u.tsp),
                i.garlicPowder(.25, u.tsp),
                i.blackPepper(5, u.crack), // 1/4 tsp
                i.oliveOil(1, u.tbsp),
            ]),
            Timer.end(),
            e.oven().add([
                i.ingredient('carrot mixture'),
            ]),
            e.oven().roast(30, 'm', 400),
            Timer.end(),
            text.set(['Take carrots out of oven']),
        ];
    }
}

export class TwoLbRoastedCarrots extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.oven().preheat(400),
            e.bowl().add([
                i.carrots(32, u.ounce),
                i.paprika(1.5, u.tsp),
                i.groundGinger(1, u.tsp),
                i.cumin(.5, u.tsp),
                i.salt(.5, u.tsp),
                i.garlicPowder(.25, u.tsp),
                i.blackPepper(5, u.crack), // 1/4 tsp
                i.oliveOil(1, u.tbsp),
            ]),
            Timer.end(),
            e.oven().add([
                i.ingredient('carrot mixture'),
            ]),
            e.oven().roast(30, 'm', 400),
            Timer.end(),
            text.set(['Take carrots out of oven']),
        ];
    }
}
