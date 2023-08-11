import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.meal;
        this.variations = [
            {'recipe': [Smoothie]},
         ]
     }
}

class Smoothie extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Get out nutribullet'],
            ['Add', i.plainYogurt(.33, u.cup), i.frozenBerries(1.5, u.cup), i.almondMilk(1, u.cup)],
            // TODO add measurement
            ['Blend until berries are smooth'],
        ]
    }
}
