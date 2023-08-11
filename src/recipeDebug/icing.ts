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
        this.recipeType = c.snack;
        this.variations = [
            Icing
        ]
    }
}

export class Icing extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.eggWhite(3, u.ounce),
                i.vanillaExtract(1, u.tsp),
                i.powderedSugar(4, u.cup),
            ]),
            e.kitchenAidMixingBowl().add([
                i.eggWhite(),
                i.vanillaExtract(),
            ]),
            text.set([
                'Run mixer on high until mixture is fluffy',
            ]),
            e.kitchenAidMixingBowl().add([
                i.powderedSugar()
            ]),
            Timer.set(7, 'm', 'Keep running kitchen aid mixer until mixture is glassy'),
            Timer.end()
        ];
    }
}
