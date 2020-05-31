import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

// Serves 1
export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.beef;
        this.addIngredients([
            i.beyondBurger(),
            i.briocheHamburgerBun(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.beyondBurger()), 'on pan on heat 5'],
            ['Wait 3 min/Flip'],
            ['Wait 3 min/Flip'],
            ['Wait 5 min/Flip'],
            ['Wait 5 min/Flip'],
            ['Use', this.get(i.briocheHamburgerBun()), 'for buns'],
        ]);
        this.printRecipe();
    }
}
