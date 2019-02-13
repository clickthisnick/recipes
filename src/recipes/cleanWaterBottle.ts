import { Recipe } from '../class/recipe';
import { Categories as c } from '../constants/categories';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'CleanWaterBottle';
        this.recipeGroup = c.misc;
        this.addIngredients([
            i.whiteVinegar(1, u.tsp),
            i.bakingPowder(.5, u.tsp),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 5 seconds water in water bottle'],
            ['Put in', this.get(i.whiteVinegar())],
            ['Shake 35 seconds'],
            ['Set on side for 2 minutes'],
            ['Flip and wait 2 minutes'],
            ['Dump out water'],
            ['Put 5 seconds water in water bottle'],
            ['Shake 35 seconds'],
            ['Dump out water'],
            ['Put 5 seconds water in water bottle'],
            ['Put in', this.get(i.bakingPowder())],
            ['Shake 35 seconds'],
            ['Set on side for 2 minutes'],
            ['Flip and wait 2 minutes'],
            ['Dump out water'],
            ['Put 5 seconds water in water bottle'],
            ['Shake 35 seconds'],
            ['Dump out water'],
            ['Fill to top with water'],
            ['Dump out water'],
            ['Rinse top and bottom of bottle'],
            ['Let air dry'],
        ]);
        await this.printRecipe();
    }
}
