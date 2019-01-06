import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Crepes';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.allPurposeFlour(),
            i.egg(),
            i.water(),
            i.salt(),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 1 cup', this.get(i.allPurposeFlour()), 'in a bowl'],
            ['Put 1.5 cup', this.get(i.water()), 'in a bowl'],
            ['Put in 3', this.get(i.egg()), 'in a bowl'],
            ['Add pinch of', this.get(i.salt())],
            ['Mix batter'],
            ['Put stove on heat 6.5'],
            ['Cook pancake for 20 seconds'],
            ['Flip and cook pancake for 7 seconds'],
        ]);
        await this.printRecipe();
    }
}
