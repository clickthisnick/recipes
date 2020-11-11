import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [BarbequeSauce]},
        ]
    }
}

class BarbequeSauce extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.saucePan().add([
                i.tomatoPaste(12, u.ounce),
                i.appleCiderVinegar(1.5, u.cup),
                i.worcestershireSauce(2, u.tbsp),
                i.liquidSmoke(1, u.tbsp),
                i.smokedPaprika(2, u.tsp),
                i.garlicPowder(1, u.tsp),
                i.onionPowder(1/2, u.tsp),
                i.seaSalt(1/2, u.tsp),
                i.chilliPowder(1/4, u.tsp),
                i.cayennePepper(1/4, u.tsp),
                i.monkFruit(1/8, u.tsp),
                i.water(1.5, u.cup),
            ]),
            e.saucePan().stir(),
            Timer.set(5, 'm', 'Put sauce pan on heat 5 until boil'),
            Timer.end(),
            Timer.set(20, 'm', 'Put sauce pan on heat 3 with lid'),
            Timer.end(),
        ];
    }
}
