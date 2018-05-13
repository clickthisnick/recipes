import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

// Serves 1
export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'BerrySmoothie';
        this.recipeGroup = c.smoothies;
        this.addIngredients([
            i.frozenBerries(1, i.cup()),
            i.almondMilk(2.5/4, i.cup()),
            i.plainYogurt(3, i.tbsp()),
            i.honey(1, i.tbsp()),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put in', this.get(i.frozenBerries())],
            ['Put in', this.get(i.almondMilk())],
            ['Put in', this.get(i.plainYogurt())],
            ['Put in', this.get(i.honey())],
            ['Mix with nutribullet'],
        ]);
        await this.printRecipe();
    }
}
