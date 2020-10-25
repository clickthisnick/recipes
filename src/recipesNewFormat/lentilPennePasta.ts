import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../constants/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'LentilPasta'
        this.variations = [
            {'recipe': [WholeFoodsLentilPenne, ModernBrandLentilPenne]},
        ]
     }
}

export class WholeFoodsLentilPenne extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.spaghettiSauce(25, u.ounce),
                i.water(1, u.cup),
                i.penneLentil(8, u.ounce),
                i.oliveOil(1, u.ounce)
            ]),
            e.instantPot().stir(),
            [Timer.pressureCook(15, 11, 'm', true)],
            ['Release steam valve and serve'],
        ];
    }
}

export class ModernBrandLentilPenne extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.spaghettiSauce(25, u.ounce),
                i.water(1, u.cup),
                i.penneLentil(8, u.ounce),
                i.oliveOil(1, u.ounce)
            ]),
            e.instantPot().stir(),
            [Timer.pressureCook(15, 7, 'm', true)],
            ['Release steam valve and serve'],
        ];
    }
}

