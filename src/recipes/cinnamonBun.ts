import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'CinnamonBuns';
        this.recipeGroup = c.bread;
        this.addIngredients([
            i.briocheHamburgerBun(),
            i.cinnamon(),
            i.sugar(),
            i.butter(),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        // Its important to put liquid items first
        // Then the solid ones
        this.addSteps([
            ['Spread', this.get(i.butter()), 'on', this.get(i.briocheHamburgerBun())],
            ['Mix 2 parts', this.get(i.sugar()), 'with one part', this.get(i.cinnamon())],
            [Timer.set(17, 's', 'Microwave for 17 seconds')],
        ]);
        await this.printRecipe();
    }
}
