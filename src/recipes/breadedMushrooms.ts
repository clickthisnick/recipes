import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            BreadedMushrooms
        ]
    }
}

class BreadedMushrooms extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(["Preheat oven to 450"]),
            text.set(["Cook panko for 5 minutes"]),
            e.bowl().add([
                i.cassavaFlour(.5, u.cup),
                i.cornstarch(2, u.tbsp),
                i.water(4, u.ounce),
                i.salt(.5, u.tsp),
                i.garlicPowder(.5, u.tsp),
            ]),
            text.set(["Slice 3–4 king oyster mushrooms"]),
            text.set(["Dip mushrooms into mixture, let drain, then dip into panko"]),
            text.set(['Spray', i.avocadoOil(), 'on panko']),
            text.set(['Cook for 25 minutes, flipping halfway']),
            text.set(['Broil for 1 minute']),
        ];
    }
}
