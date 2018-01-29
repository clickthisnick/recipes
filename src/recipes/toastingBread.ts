import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';

// http://allrecipes.com/recipe/230162/softest-soft-bread-with-air-pockets-using-bread-machine/
export class ToastingBread extends Recipe {
    constructor() {
        super();
        this.recipeName = ToastingBread.name;
        this.addIngredients([
            i.breadFlour(2, i.cup()),
            i.water(1, i.cup()),
            i.honey(4, i.tsp()),
            i.butter(5, i.tsp()),
            i.kosherSalt(1/2, i.tsp()),
            i.dryActiveYeast(2, i.tsp()),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Attach breadmaker arm'],
            ['Put in breadmaker', this.get(i.breadFlour())],
            ['Put in breadmaker', this.get(i.water())],
            ['Put in breadmaker', this.get(i.kosherSalt())],
            ['Put in breadmaker', this.get(i.honey())],
            ['Put in breadmaker', this.get(i.butter())],
            ['Put in breadmaker', this.get(i.dryActiveYeast())],
            ['Put bread maker on bread setting (menu item 1) with medium brust and 2 lb loaf and hit start'],
            ['Let bread cool for 20 minutes'],
            ['Slice bread'],
        ]);
        this.printRecipe();
    }
}

const recipe = new ToastingBread();

recipe.generateRecipe();
