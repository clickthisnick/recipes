import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.eggs;
        this.addIngredients([
            i.egg(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put pan on stove and turn to heat 5'],
            ['Crack in a bowl the', this.get(i.egg())],
            ['Scramble With Fork'],
            [Timer.set(3, 'm', 'Cook the eggs')],
            [Timer.set(2, 'm', 'Flip and cook eegs')],
        ]);
        this.printRecipe();
    }
}
