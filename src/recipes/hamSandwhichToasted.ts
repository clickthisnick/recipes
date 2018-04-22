import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'HamSandwhich';
        this.recipeGroup = c.sandwhich;
        this.addIngredients([
            i.bread(),
            i.butter(),
            i.ham(),
            i.montereyJackCheese(),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put a pan on heat 5'],
            [this.get(i.butter()), 'the', this.get(i.bread())],
            ['Put the bread on the pan'],
            ['Spinkle the', this.get(i.montereyJackCheese()), 'on the bread'],
            ['Put pan lid on'],
            ['Cook for 1 and a half minutes'],
            ['Put 2 slices of', this.get(i.ham()), 'on the toasted bread'],
        ]);
        await this.printRecipe();
    }
}
