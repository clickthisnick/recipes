import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            CoffeeCreamer,
         ]
     }
}

class CoffeeCreamer extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pot().add([
                i.halfAndHalf(200, u.gram),
                i.honey(14, u.gram),
                i.vanillaExtract(1, u.tsp),
                i.monkFruit(1/4, u.tsp),
            ]),
            text.set(['Mix with matcha mixer'])
        ];
    }
}
