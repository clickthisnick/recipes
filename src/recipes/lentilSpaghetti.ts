import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Lentil Spaghetti';
        this.recipeGroup = c.instantPot;
        this.addIngredients([
            i.lentilSpaghetti(),
            i.spaghettiSauce(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Optional: Saute mushrooms and/or sausage in instant pot'],
            ['Add 1/2 cup water'],
            ['Add 25 ounce can of ', this.get(i.spaghettiSauce())],
            ['Add 8 ounce pkg of ', this.get(i.lentilSpaghetti())],
            ['Add 1/2 cup water. (Dont stir)'],
            [Timer.set(10, 'm', 'Pressure cook on high pressure for 10 minutes')],
        ]);
        this.printRecipe();
    }
}
