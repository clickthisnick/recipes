import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Frozen Chicken Wings';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.frozenChickenWings(1, u.pound),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.frozenChickenWings()), 'in microwave for 1lb defrost'],
            ['Put chicken wings in air fryer for 5min @ 400'],
            ['Stab wings to bone and flip'],
            ['Put chicken wings in air fryer for 5min @ 400'],
            ['Stab wings to bone and flip'],
            ['Put oil on wings and cook for 5min @ 400'],
            ['Flip'],
            ['Put oil on wings and cook for 5min @ 400'],
            ['Get container with bbq sauce and shack'],
        ]);
        this.printRecipe();
    }
}
