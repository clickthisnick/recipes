import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.snack;
        this.addIngredients([
            i.allPurposeFlour(1, u.cup),
            i.egg(3, u.unit),
            i.water(1.5, u.cup),
            i.salt(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.allPurposeFlour()), 'in a bowl'],
            ['Put', this.get(i.water()), 'in a bowl'],
            ['Put', this.get(i.egg()), 'in a bowl'],
            ['Add pinch of', this.get(i.salt())],
            ['Mix batter'],
            ['Put stove on heat 6.5'],
            ['Cook pancake for 20 seconds'],
            ['Flip and cook pancake for 7 seconds'],
        ]);
        this.printRecipe();
    }
}
