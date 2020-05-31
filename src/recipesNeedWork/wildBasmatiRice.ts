import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.instantPot;
        this.addIngredients([
            i.wildBasmatiRice(1, u.cup),
            i.instaPot(1)
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.wildBasmatiRice()), 'in', this.get(i.instaPot())],
            ['Put in  1 cups of water'],
            ['Put on pressure cook for 22 minutes'],
            ['Let sit for 5 minutes'],
            ['Open steam valve'],
        ]);
        this.printRecipe();
    }
}
