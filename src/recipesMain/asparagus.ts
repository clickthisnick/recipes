import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'asparagus';
        this.recipeGroup = c.component;
     }

     public init() {
         this.generateRecipes([
             {'recipe': [Asparagus]},
         ]);
     }
}

class Asparagus extends Recipe {
    constructor() {
        super();
        this.recipeId = 'asparagus';
    }
    public generateRecipe() {
        this.addIngredients([
            i.asparagus(.5, u.bunch),
            i.oliveOil(1, u.unit),
            i.dash(1, u.unit),
        ]);
        this.addSteps([
            [Timer.preheatNinja(500)],
            ['Put', i.asparagus()],
            ['Brush with', i.oliveOil()],
            [Timer.ninjaCook(4, 'm', i.asparagus(0), 500)],
            ['Season with', i.dash()],
        ]);
    }
}
