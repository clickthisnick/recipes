import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'rice';
        this.recipeGroup = c.component;
        this.recipeOptions = [
            {'recipe': ['rice']},
         ];
    }

    public init() {
        this.generateRecipes([
            Rice
        ]);
    }
}

class Rice extends Recipe {
    public generateRecipe() {
        this.recipeId = 'rice';
        this.addIngredients([
            i.brownRice(1, u.cup),
            i.water(1.5, u.cup)
        ]);
        this.addSteps([
            ['Put', i.brownRice(), 'in instant pot'],
            ['Put in', i.water()],
            [Timer.pressureCook(15, 'm', true)],
            [Timer.set(5, 'm', 'let sit without opening steam valve')],
            ['Open steam valve'],
        ]);
    }
}
