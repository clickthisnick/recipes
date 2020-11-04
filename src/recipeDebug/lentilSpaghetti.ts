import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'LentilPasta'
        this.variations = [
            {'recipe': [WholeFoodsLentilPenne]},
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
            text.set(['Stir instant pot and break up pasta']),
            e.instantPot().pressureCook(15, 11, 'm'),
        ];
    }
}
