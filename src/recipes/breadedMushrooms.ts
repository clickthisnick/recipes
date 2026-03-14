import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

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
            Timer.set(5, 'm', 'Cook panko'),
            Timer.end(),
            e.bowl().add([
                i.cassavaFlour(.5, u.cup),
                i.cornstarch(2, u.tbsp),
                i.water(7, u.ounce),
                i.salt(.5, u.tsp),
                i.garlicPowder(.5, u.tsp),
            ]),
            text.set(["Slice 3–4 king oyster mushrooms"]),
            text.set(["Dip mushrooms into mixture, let drain, then dip into panko"]),
            text.set(['Spray', i.avocadoOil(), 'on panko']),
            Timer.set(12, 'm', 'Cook'),
            Timer.end(),
            text.set(['Flip']),
            Timer.set(13, 'm', 'Cook'),
            Timer.end(),
            Timer.set(1, 'm', 'Broil'),
            Timer.end(),
        ];
    }
}
