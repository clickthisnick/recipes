import { Recipe } from '../class/recipe';
import { Categories as c } from '../constants/categories';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'CleanWaterBottleBig';
        this.recipeGroup = c.misc;
        this.addIngredients([
            i.whiteVinegar(1, u.tsp),
            i.bakingPowder(.5, u.tsp),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 10 seconds water in water bottle'],
            ['Put in', this.get(i.whiteVinegar())],
            ['Shake 60 seconds'],
            ['Dump out water'],
            ['Put 10 seconds water in water bottle'],
            ['Put in', this.get(i.bakingPowder())],
            ['Shake 60 seconds'],
            ['Dump out water'],
            ['Put 10 seconds water in water bottle'],
            ['Shake 20 seconds'],
            ['Dump out water'],
            ['Fill 1/4 with water'],
            ['Dump out water'],
            ['Let air dry'],
        ]);
        this.printRecipe();
    }
}
