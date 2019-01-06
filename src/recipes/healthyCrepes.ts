import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'HealthyCrepes';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.almondFlour(),
            i.buckwheatFlour(),
            i.egg(),
            i.water(),
            i.salt(),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put half cup', this.get(i.almondFlour()), 'in a bowl'],
            ['Put half cup', this.get(i.buckwheatFlour()), 'in a bowl'],
            ['Put 1.5 cup', this.get(i.water()), 'in a bowl'],
            ['Put in 3', this.get(i.egg()), 'in a bowl'],
            ['Add pinch of', this.get(i.salt())],
            ['Mix batter'],
            ['Put stove on heat 6'],
            ['Cook pancake for 40 seconds'],
            ['Flip and cook pancake for 30 seconds'],
        ]);
        await this.printRecipe();
    }
}
