import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'asparagus';
        this.recipeGroup = c.component;
        this.addIngredients([
            i.asparagus(.5, u.bunch),
            i.chilliPowder(1, u.unit),
            i.salt(1, u.unit),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            [Timer.preheatPan(500)],
            ['Put', i.asparagus()],
            ['Brush with', i.chilliPowder()],
            [Timer.ninjaCook(4, 'm', i.asparagus(0), 500)],
            ['Season with', i.salt()],
        ]);
        this.printRecipe();
    }
}
