import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'BrinedChickenThighs';
        this.recipeGroup = c.chicken;
        this.addIngredients([
            i.chickenThighPackage(),
            i.salt(),
            i.paprika(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Cut out glass bowl and fill half way with warm water'],
            ['Put', this.get(i.salt()), 'and', this.get(i.paprika()), 'in the bowl and mix'],
            [Timer.set(25, 'm', 'Put chicken in the bowl and put in fridge for 25 minutes')],
            ['Cook in airfryer @ 370 deg for 12 minutes', this.get(i.chickenThighPackage())],
            [Timer.set(5, 'm', 'Flip chicken and cook for 7 minutes @ 370')],
        ]);
        this.printRecipe();
    }
}
