import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            TacoSeasoning1PoundMeat
        ]
    }
}

class TacoSeasoning1PoundMeat extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.largeBowl().add([
                i.chilliPowder(1, u.tbsp),
                i.cumin(1.5, u.tsp),
                i.salt(1, u.tsp),
                i.smokedPaprika(.5, u.tsp),
                i.garlicPowder(.25, u.tsp),
                i.onionPowder(.25, u.tsp),
                i.driedOregano(.25, u.tsp),
                i.blackPepper(20, u.crack), // 1 u.tsp // TODO calculate this someday
                i.water(.5, u.cup),
            ]),
            e.largeBowl().mix(),
            e.largeBowl().add([
                i.ingredient("1 Pound Meat")
            ]),
            Timer.set(30, "m", "Let meat marindate"),
            Timer.end()
        ];
    }
}
