import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Categories as c } from '../constants/categories';

// Serves 1
export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'BerrySmoothie';
        this.recipeGroup = c.smoothies;
        this.addIngredients([
            i.frozenBerries(1, u.cup),
            i.almondMilk(2.5, u.cup),
            i.plainYogurt(3, u.tbsp),
            i.honey(1, u.tbsp),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put in', this.get(i.frozenBerries())],
            ['Put in', this.get(i.almondMilk())],
            ['Put in', this.get(i.plainYogurt())],
            ['Put in', this.get(i.honey())],
            ['Mix with nutribullet'],
        ]);
        this.printRecipe();
    }
}
