import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'SirloinTop';
        this.recipeGroup = c.beef;
        this.addIngredients([
            i.sirloinTop(1, u.pound),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Souvide', this.get(i.sirloinTop()), 'at 131 degrees for 2 1/2 hours'],
            ['Sear on both sides for a minute'],
        ]);
        this.printRecipe();
    }
}
