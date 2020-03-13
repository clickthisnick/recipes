import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

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
            [Timer.souVide(19, 'm', this.get(i.sirloinTop()), 131)],
            ['Sear on both sides for a minute'],
        ]);
        this.printRecipe();
    }
}
