import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Top Sirloin';
        this.recipeGroup = c.component;
        this.addIngredients([
            i.sirloinTop(1, u.pound),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            [Timer.souVide(2.5, 'h', i.sirloinTop(), 131)],
            [Timer.preheatPan(7)],
            [Timer.panSear(30, 's', i.sirloinTop(0))],
            ['Flip'],
            [Timer.panSear(30, 's', i.sirloinTop(0))],
        ]);
        this.printRecipe();
    }
}
