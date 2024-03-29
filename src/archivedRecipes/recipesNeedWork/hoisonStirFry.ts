import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.chinese;
        this.addIngredients([
            i.frozenStirFryVeggies(),
            i.sesameOil(),
            i.hoisonSauce(),
            i.pepperFlake(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put oven on 7 heat'],
            ['Put', this.get(i.sesameOil()), 'in pan'],
            ['Put', this.get(i.frozenStirFryVeggies()), 'in pan'],
            ['Cook for 7 minutes'],
            ['Put in ', this.get(i.hoisonSauce())],
            ['Cook for 3 minutes'],
            ['Put in', this.get(i.pepperFlake())],
            ['Cook for 5 minutes'],
        ]);
        this.printRecipe();
    }
}
