import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            WhiteMushrooms
        ]
     }
}

export class WhiteMushrooms extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.ninja().add([
                i.whiteMushroom(8, u.ounce),
            ]),
            e.ninja().airFry(13, 'm', 375),
            Timer.end(),
            i.whiteMushroom().seasonWith([
                i.lawlrySaltFree(1, u.tsp),
                i.redPepperFlakes(1/8, u.tsp),
                i.seaSalt(1/16, u.tsp),
            ])
        ];
    }
}
