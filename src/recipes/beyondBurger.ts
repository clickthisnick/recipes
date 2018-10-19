import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'BeyondBurger';
        this.recipeGroup = c.beef;
        this.addIngredients([
            i.beyondBurger(),
            i.briocheHamburgerBun(),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            [Timer.set(3, 'm', 'Preheat pan on heat 6')],
            ['Put', this.get(i.beyondBurger()), 'in pan'],
            [Timer.set(4, 'm', 'Cook. No oil.')],
            [Timer.set(4, 'm', 'Flip beyond burger')],
            ['Use', this.get(i.briocheHamburgerBun()), 'for buns'],
        ]);
        await this.printRecipe();
    }
}
