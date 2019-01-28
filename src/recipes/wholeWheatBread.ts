import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'WholeWheatBread';
        this.recipeGroup = c.bread;
        this.addIngredients([
            i.wheatBreadFlour(4.5, i.cup()),
            i.water(1.5, i.cup()),
            i.oliveOil(1, i.thirdCup()),
            i.honey(1, i.fourthCup()),
            i.kosherSalt(2, i.tsp()),
            i.dryActiveYeast(1, i.tbsp()),
            i.kosherSalt(2, i.tsp()),
            i.vitalWheatGluten(1, i.tsp()),
        ]);
    }

    public async generateRecipe() {
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
        await this.printRecipe();
    }
}
