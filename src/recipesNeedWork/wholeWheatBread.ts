import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.bread;
        this.addIngredients([
            i.wheatBreadFlour(4.5, u.cup),
            i.water(1.5, u.cup),
            i.oliveOil(.33, u.cup),
            i.honey(.25, u.cup),
            i.kosherSalt(2, u.tsp),
            i.dryActiveYeast(1, u.tbsp),
            i.kosherSalt(2, u.tsp),
            i.vitalWheatGluten(1, u.tsp),
        ]);
    }

    public generateRecipe() {
        this.prep();
        // Its important to put liquid items first
        // Then the solid ones
        this.addSteps([
            ['Attach breadmaker arm'],
            ['Put Ingredients in, in this order. Vital wheat gluten optional'],
            ['Put in', this.get(i.oliveOil())],
            ['Put in', this.get(i.honey())],
            ['Put in', this.get(i.water())],
            ['Put in', this.get(i.kosherSalt())],
            ['Put in', this.get(i.wheatBreadFlour())],
            ['Put in', this.get(i.vitalWheatGluten())],
            ['Put in center the', this.get(i.dryActiveYeast())],
            ['Put bread maker on bread setting (menu item 1) with medium crust and 2 lb loaf and hit start'],
            ['Let bread cool for 20 minutes'],
            ['Slice bread'],
        ]);
        this.printRecipe();
    }
}
