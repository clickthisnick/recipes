import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Lentil Spaghetti';
        this.recipeGroup = c.meal;
        this.recipeId = '';
        this.addIngredients([
            i.lentilSpaghetti(8, u.ounce),
            i.spaghettiSauce(25, u.ounce),
            i.water(1, u.cup),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Optional: Saute mushrooms and/or sausage in instant pot'],
            ['Add', i.water(.5, u.cup)],
            ['Add', i.spaghettiSauce()],
            ['Add', i.lentilSpaghetti()],
            ['Add', i.water(.5, u.cup), '(Don\'t stir)'],
            [Timer.pressureCook(10, 'm', true)],
            ['Release steam valve and serve'],
        ]);
        this.printRecipe();
    }
}
