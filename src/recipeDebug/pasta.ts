import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'Spaghetti'
        this.variations = [
            LentilPenne, LentilPenne
        ]
    }
}

export class LentilPenne extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pot().add([
                i.water(25, u.second),
            ]),
        ];
    } 
}
