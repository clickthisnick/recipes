import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.frozen;
        this.variations = [
            {'recipe': [SpiralHam]}
        ]
    }

    public init() {
        this.generateRecipes();
    }
}

class SpiralHam extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.spiralCutHam(192, u.ounce), // 12 pounds
        ]);
        this.addSteps([
            [Timer.preheatOven(250)],
            [Timer.ovenCook(156, 'm', 'Cook ham 13 minutes per pound', 250)],
            ['Once', i.spiralCutHam(), 'is cooked shave off fat'],
            ['Put portions into air tight sealed bags'],
        ]);
    }
}
