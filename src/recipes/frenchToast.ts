import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'FrenchToast';
        this.recipeGroup = c.bread;
        this.addIngredients([
            i.bread(),
            i.butter(),
            i.eggWhite(),
            i.cinnamon(),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put a pan on heat 5'],
            ['Put some', this.get(i.butter()), 'in the pan'],
            ['Put the', this.get(i.eggWhite()), 'and the', this.get(i.cinnamon())],
            ['Dip the', this.get(i.bread()), 'in the mixture'],
            ['Put the bread on the pan for 3 minutes'],
            ['Flip the bread and keep on pan for 2 and a half minutes'],
        ]);
        await this.printRecipe();
    }
}
