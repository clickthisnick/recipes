import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'RiceInstantPot';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.brownRice(1, u.cup),
            i.instaPot(1)
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.brownRice()), 'in', this.get(i.instaPot())],
            ['Put in  1.5 cups of water'],
            ['Put on pressure cook for 15 minutes'],
            ['Let sit for 5 minutes'],
            ['Open steam valve'],
        ]);
        this.printRecipe();
    }
}
