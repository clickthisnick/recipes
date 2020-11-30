import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'LentilPasta'
        this.variations = [
            MozzarellaSticks
        ]
     }
}

// https://showmetheyummy.com/air-fryer-mozzarella-sticks-recipe/
export class MozzarellaSticks extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Cut up', i.mozzarellaCheese(1, u.pound), 'into strips']),
            text.set(['Whisk', i.almondMilk(1, u.tbsp), 'with', i.egg(2, u.unit)]),
            text.set(['Coat cheese with', i.allPurposeFlour(1, u.unit)]),
            text.set(['Dip in egg mixture']),
            text.set(['Roll in', i.pankoBreadCrumbs(1, u.unit)]),
            text.set(['Freeze for 20 minutes']),
            text.set(['Heat oil in skillet and fry for 1 min a side']),
            text.set(['Sprinkle with', i.parsley(1, u.unit)]),
            text.set(['Dip in ', i.pizzaSauce(8, u.ounce)]),
        ];
    }
}
