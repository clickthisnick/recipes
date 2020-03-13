import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'MacaroniCheese';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.butter(3, u.tbsp),
            i.water(4, u.cup),
            i.salt(1, u.tsp),
            i.raoPastaElbow(1, u.pound),
            i.almondMilk(.5, u.cup),
            i.cheddarCheese(1, u.pound),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.butter()), 'in instant pot'],
            ['Put', this.get(i.water()), 'in instant pot'],
            ['Put', this.get(i.salt()), 'in instant pot'],
            ['Put', this.get(i.raoPastaElbow()), 'in instant pot'],
            [Timer.pressureCook(2, 'm')],
            ['Grate the', this.get(i.cheddarCheese())],
            ['Release valve'],
            ['Stir in', this.get(i.almondMilk())],
            ['Stir in cheese'],
            [Timer.set(5, 'm', 'Put lid back on (but don\'t cook)')],
        ]);
        this.printRecipe();
    }
}
