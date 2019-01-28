import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

// http://allrecipes.com/recipe/230162/softest-soft-bread-with-air-pockets-using-bread-machine/
export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'ToastingBread';
        this.recipeGroup = c.bread;
        this.addIngredients([
            i.breadFlour(2, u.cup),
            i.water(1, u.cup),
            i.honey(4, u.tsp),
            i.oliveOil(4, u.tsp),
            i.kosherSalt(1/2, u.tsp),
            i.dryActiveYeast(2, u.tsp),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        // Its important to put liquid items first
        // Then the solid ones
        this.addSteps([
            ['Attach breadmaker arm'],
            ['Put in', this.get(i.water())],
            ['Put in', this.get(i.oliveOil())],
            ['Put in', this.get(i.breadFlour())],
            ['Put in', this.get(i.kosherSalt())],
            ['Put in', this.get(i.honey())],
            ['Put in center the', this.get(i.dryActiveYeast())],
            ['Put bread maker on bread setting (menu item 1) with medium crust and 2 lb loaf and hit start'],
            ['Let bread cool for 20 minutes'],
            ['Slice bread'],
        ]);
        await this.printRecipe();
    }
}
