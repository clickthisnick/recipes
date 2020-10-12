import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.variations = [
            {'recipe': [NinjaChickenThings]},
        ]
     }

     public init() {
         this.generateRecipes();
     }
}

class NinjaChickenThings extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.chickenThigh(1, u.pound),
        ]);
        this.addSteps([
            ['Season dry rub', i.chickenThigh()],
            [Timer.ninjaCook(10, 'm', 'Cook Chicken, flip at 5 min mark', 400)]
        ]);
    }
}
