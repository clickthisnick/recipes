import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'Spiral Ham';
        this.recipeGroup = c.frozen;
    }

    public init() {
        this.generateRecipes([
            {'recipe': [SpiralHam]}
        ]);
    }
}

class SpiralHam extends Recipe {
    constructor() {
        super();
        this.recipeId = 'cup';
    }
    public generateRecipe() {
        this.addIngredients([
            i.spiralCutHam(192, u.ounce), // 12 pounds
        ]);
        this.addSteps([
            [Timer.preheatOven(250)],
            ['Put', i.spiralCutHam(), 'in oven for 13 minutes per pound.'],
            ['Once cooked shave off fat'],
            ['Put portions into air tight sealed bags'],
        ]);
    }
}
